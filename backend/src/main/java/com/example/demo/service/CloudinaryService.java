package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    @Value("${glamai.cloudinary.cloud-name}")
    private String cloudName;

    @Value("${glamai.cloudinary.api-key}")
    private String apiKey;

    @Value("${glamai.cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private boolean isMockMode = false;
    private static final String UPLOAD_DIR = "uploads";

    @PostConstruct
    public void init() {
        if (cloudName == null || cloudName.isEmpty() ||
            apiKey == null || apiKey.isEmpty() ||
            apiSecret == null || apiSecret.isEmpty()) {
            this.isMockMode = true;
            System.err.println(">>> WARNING: Cloudinary credentials not fully configured.");
            System.err.println(">>> Running Cloudinary in Mock Local Storage Mode. Uploaded images will be saved in the './uploads' folder.");
            try {
                Files.createDirectories(Paths.get(UPLOAD_DIR));
            } catch (IOException e) {
                System.err.println("Failed to create local uploads folder: " + e.getMessage());
            }
        } else {
            try {
                this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiSecret
                ));
                System.out.println(">>> Cloudinary initialized successfully!");
            } catch (Exception e) {
                this.isMockMode = true;
                System.err.println(">>> ERROR: Failed to initialize Cloudinary. Falling back to local storage: " + e.getMessage());
                try {
                    Files.createDirectories(Paths.get(UPLOAD_DIR));
                } catch (IOException ex) {
                    System.err.println("Failed to create local uploads folder: " + ex.getMessage());
                }
            }
        }
    }

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        if (isMockMode) {
            try {
                String originalFilename = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String filename = UUID.randomUUID().toString() + fileExtension;
                Path destination = Paths.get(UPLOAD_DIR).resolve(filename);
                Files.write(destination, file.getBytes());
                return "http://localhost:8080/api/uploads/" + filename;
            } catch (IOException e) {
                throw new RuntimeException("Error saving image locally: " + e.getMessage(), e);
            }
        } else {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                return uploadResult.get("secure_url").toString();
            } catch (Exception e) {
                throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
            }
        }
    }

    public String uploadImage(byte[] fileBytes, String filename) {
        if (fileBytes == null || fileBytes.length == 0) return null;

        if (isMockMode) {
            try {
                String fileExtension = "";
                if (filename != null && filename.contains(".")) {
                    fileExtension = filename.substring(filename.lastIndexOf("."));
                } else {
                    fileExtension = ".jpg";
                }
                String newFilename = UUID.randomUUID().toString() + fileExtension;
                Path destination = Paths.get(UPLOAD_DIR).resolve(newFilename);
                Files.write(destination, fileBytes);
                return "http://localhost:8080/api/uploads/" + newFilename;
            } catch (IOException e) {
                throw new RuntimeException("Error saving image locally: " + e.getMessage(), e);
            }
        } else {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.emptyMap());
                return uploadResult.get("secure_url").toString();
            } catch (Exception e) {
                throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
            }
        }
    }
}
