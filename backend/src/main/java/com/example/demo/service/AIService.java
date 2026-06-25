package com.example.demo.service;

import com.example.demo.model.FaceAnalysis;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class AIService {

    @Value("${glamai.gemini.api-key}")
    private String geminiApiKey;

    private final CloudinaryService cloudinaryService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final List<FaceAnalysis> mockAnalysisPool = new ArrayList<>();

    public AIService(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
        initMockPool();
    }

    private void initMockPool() {
        // Mock 1: Oval
        mockAnalysisPool.add(FaceAnalysis.builder()
                .faceShape("Oval")
                .hairType("Wavy")
                .hairDensity("Medium")
                .recommendedStyles(List.of("Pompadour", "Textured Quiff", "Side Part"))
                .suitabilityScores(Map.of("Pompadour", 95, "Textured Quiff", 92, "Side Part", 89))
                .stylingTips(Map.of(
                        "Pompadour", "Use a blow dryer to lift hair at the front and style with high-shine pomade.",
                        "Textured Quiff", "Apply matte clay to dry hair to build volume and natural texture.",
                        "Side Part", "Part your hair along its natural line and comb down with a medium-hold gel."
                ))
                .build());

        // Mock 2: Round
        mockAnalysisPool.add(FaceAnalysis.builder()
                .faceShape("Round")
                .hairType("Straight")
                .hairDensity("Thick")
                .recommendedStyles(List.of("Buzz Cut", "Textured Fringe", "Faux Hawk"))
                .suitabilityScores(Map.of("Buzz Cut", 94, "Textured Fringe", 91, "Faux Hawk", 88))
                .stylingTips(Map.of(
                        "Buzz Cut", "Very low maintenance; wash daily and moisturize the scalp.",
                        "Textured Fringe", "Apply texture powder to damp hair and mess it forward with your fingers.",
                        "Faux Hawk", "Push hair towards the center using a strong-hold styling wax."
                ))
                .build());

        // Mock 3: Square
        mockAnalysisPool.add(FaceAnalysis.builder()
                .faceShape("Square")
                .hairType("Curly")
                .hairDensity("Thick")
                .recommendedStyles(List.of("Undercut Curly", "Curly Fringe", "Slicked Back"))
                .suitabilityScores(Map.of("Undercut Curly", 96, "Curly Fringe", 93, "Slicked Back", 90))
                .stylingTips(Map.of(
                        "Undercut Curly", "Keep the sides tight and use curl cream to define the curly top.",
                        "Curly Fringe", "Let curls fall forward naturally; use a diffuser to dry without frizz.",
                        "Slicked Back", "Apply a high-hold clay or wax and comb straight back."
                ))
                .build());

        // Mock 4: Heart
        mockAnalysisPool.add(FaceAnalysis.builder()
                .faceShape("Heart")
                .hairType("Coily")
                .hairDensity("Thick")
                .recommendedStyles(List.of("Afro Fade", "Short Twists", "Tapered Cut"))
                .suitabilityScores(Map.of("Afro Fade", 95, "Short Twists", 92, "Tapered Cut", 89))
                .stylingTips(Map.of(
                        "Afro Fade", "Hydrate curls daily with leave-in conditioner and pick it out for shape.",
                        "Short Twists", "Twist hair in small sections using a moisturizing twist butter or gel.",
                        "Tapered Cut", "Keep the back and sides short, leaving length at the crown to frame the face."
                ))
                .build());
    }

    public FaceAnalysis analyzeFace(String selfieUrl) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.startsWith("${")) {
            System.out.println(">>> Gemini API key not configured. Using Mock Face Analysis.");
            int index = Math.abs(selfieUrl.hashCode()) % mockAnalysisPool.size();
            FaceAnalysis mock = mockAnalysisPool.get(index);
            return FaceAnalysis.builder()
                    .id(UUID.randomUUID().toString())
                    .selfieUrl(selfieUrl)
                    .faceShape(mock.getFaceShape())
                    .hairType(mock.getHairType())
                    .hairDensity(mock.getHairDensity())
                    .recommendedStyles(mock.getRecommendedStyles())
                    .suitabilityScores(mock.getSuitabilityScores())
                    .stylingTips(mock.getStylingTips())
                    .createdAt(System.currentTimeMillis())
                    .build();
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            byte[] imageBytes = restTemplate.getForObject(selfieUrl, byte[].class);
            if (imageBytes == null) {
                throw new RuntimeException("Could not fetch selfie image bytes from URL: " + selfieUrl);
            }
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String promptText = "You are a professional hairstylist AI. Analyze this face and hair. "
                    + "Return a raw JSON object (strictly no markdown formatting, no ```json wrapper) with the following schema: "
                    + "{\n"
                    + "  \"faceShape\": \"Oval/Round/Square/Heart/Diamond\",\n"
                    + "  \"hairType\": \"Straight/Wavy/Curly/Coily\",\n"
                    + "  \"hairDensity\": \"Thin/Medium/Thick\",\n"
                    + "  \"recommendedStyles\": [\"Style 1\", \"Style 2\", \"Style 3\"],\n"
                    + "  \"suitabilityScores\": {\"Style 1\": 95, \"Style 2\": 92, \"Style 3\": 89},\n"
                    + "  \"stylingTips\": {\"Style 1\": \"tip 1...\", \"Style 2\": \"tip 2...\", \"Style 3\": \"tip 3...\"}\n"
                    + "}";

            Map<String, Object> textPart = Map.of("text", promptText);
            Map<String, Object> imagePart = Map.of(
                    "inlineData", Map.of(
                            "mimeType", "image/jpeg",
                            "data", base64Image
                    )
            );
            Map<String, Object> content = Map.of("parts", List.of(textPart, imagePart));
            Map<String, Object> payload = Map.of("contents", List.of(content));

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
            Map<?, ?> response = restTemplate.postForObject(url, requestEntity, Map.class);

            if (response != null) {
                List<?> candidates = (List<?>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> contentObj = (Map<?, ?>) candidate.get("content");
                    List<?> parts = (List<?>) contentObj.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map<?, ?> part = (Map<?, ?>) parts.get(0);
                        String rawText = part.get("text").toString().trim();
                        if (rawText.startsWith("```")) {
                            rawText = rawText.replaceAll("(?s)^```(?:json)?\\s*(.*?)\\s*```$", "$1");
                        }
                        FaceAnalysis analysis = objectMapper.readValue(rawText, FaceAnalysis.class);
                        analysis.setId(UUID.randomUUID().toString());
                        analysis.setSelfieUrl(selfieUrl);
                        analysis.setCreatedAt(System.currentTimeMillis());
                        return analysis;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage() + ". Falling back to mock.");
        }

        int index = Math.abs(selfieUrl.hashCode()) % mockAnalysisPool.size();
        FaceAnalysis mock = mockAnalysisPool.get(index);
        return FaceAnalysis.builder()
                .id(UUID.randomUUID().toString())
                .selfieUrl(selfieUrl)
                .faceShape(mock.getFaceShape())
                .hairType(mock.getHairType())
                .hairDensity(mock.getHairDensity())
                .recommendedStyles(mock.getRecommendedStyles())
                .suitabilityScores(mock.getSuitabilityScores())
                .stylingTips(mock.getStylingTips())
                .createdAt(System.currentTimeMillis())
                .build();
    }

    public String generateHairstylePreview(String originalImageUrl, String selectedStyle) {
        try {
            String prompt = "Professional studio portrait photography of a person with the hairstyle " + selectedStyle + 
                            ", hyper-realistic, 8k resolution, premium hair design, matching facial features of the model, photorealistic";
            
            String encodedPrompt = URLEncoder.encode(prompt, StandardCharsets.UTF_8.toString());
            String generationUrl = "https://image.pollinations.ai/prompt/" + encodedPrompt + "?width=512&height=512&nologo=true&seed=" + Math.abs(originalImageUrl.hashCode());

            byte[] generatedBytes = restTemplate.getForObject(generationUrl, byte[].class);
            if (generatedBytes != null && generatedBytes.length > 0) {
                return cloudinaryService.uploadImage(generatedBytes, "preview_" + selectedStyle.replaceAll("\\s+", "_") + ".jpg");
            }
        } catch (Exception e) {
            System.err.println("Failed to generate AI hairstyle preview: " + e.getMessage());
        }

        return originalImageUrl;
    }
}
