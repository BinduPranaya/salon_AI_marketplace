package com.example.demo.controller;

import com.example.demo.model.FaceAnalysis;
import com.example.demo.model.HairstylePreview;
import com.example.demo.service.AIService;
import com.example.demo.service.CloudinaryService;
import com.example.demo.service.FirestoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final CloudinaryService cloudinaryService;
    private final FirestoreService firestoreService;

    public AIController(AIService aiService, CloudinaryService cloudinaryService, FirestoreService firestoreService) {
        this.aiService = aiService;
        this.cloudinaryService = cloudinaryService;
        this.firestoreService = firestoreService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeFace(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            if (imageUrl == null) {
                return ResponseEntity.badRequest().body("Failed to upload selfie");
            }

            FaceAnalysis analysis = aiService.analyzeFace(imageUrl);
            analysis.setUserId(userId);

            firestoreService.save("face_analyses", analysis.getId(), analysis);

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<?> generatePreview(@RequestBody PreviewRequest request) {
        try {
            String previewUrl = aiService.generateHairstylePreview(request.getOriginalImageUrl(), request.getSelectedStyle());

            HairstylePreview preview = HairstylePreview.builder()
                    .id(UUID.randomUUID().toString())
                    .userId(request.getUserId())
                    .originalImageUrl(request.getOriginalImageUrl())
                    .selectedStyle(request.getSelectedStyle())
                    .previewImageUrl(previewUrl)
                    .createdAt(System.currentTimeMillis())
                    .build();

            firestoreService.save("hairstyle_previews", preview.getId(), preview);

            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/analysis-history/{userId}")
    public ResponseEntity<List<FaceAnalysis>> getAnalysisHistory(@PathVariable String userId) {
        List<FaceAnalysis> all = firestoreService.getAll("face_analyses", FaceAnalysis.class);
        List<FaceAnalysis> userHistory = all.stream()
                .filter(a -> a.getUserId().equals(userId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userHistory);
    }

    @GetMapping("/preview-history/{userId}")
    public ResponseEntity<List<HairstylePreview>> getPreviewHistory(@PathVariable String userId) {
        List<HairstylePreview> all = firestoreService.getAll("hairstyle_previews", HairstylePreview.class);
        List<HairstylePreview> userHistory = all.stream()
                .filter(p -> p.getUserId().equals(userId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userHistory);
    }

    public static class PreviewRequest {
        private String userId;
        private String originalImageUrl;
        private String selectedStyle;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getOriginalImageUrl() { return originalImageUrl; }
        public void setOriginalImageUrl(String originalImageUrl) { this.originalImageUrl = originalImageUrl; }
        public String getSelectedStyle() { return selectedStyle; }
        public void setSelectedStyle(String selectedStyle) { this.selectedStyle = selectedStyle; }
    }
}
