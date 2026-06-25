package com.example.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FirestoreService {

    @Value("${glamai.firebase.credential-path}")
    private String credentialPath;

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    private Firestore firestore;
    private boolean isMockMode = false;

    // Mock database storage: Collection Name -> Document ID -> Map of fields
    private final Map<String, Map<String, Map<String, Object>>> mockDatabase = new ConcurrentHashMap<>();

    public FirestoreService(ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource(credentialPath);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(is))
                        .build();
                    if (FirebaseApp.getApps().isEmpty()) {
                        FirebaseApp.initializeApp(options);
                    }
                    this.firestore = FirestoreClient.getFirestore();
                    System.out.println(">>> Firebase Firestore initialized successfully!");
                }
            } else {
                enableMockMode("Firebase service account JSON file not found at: " + credentialPath);
            }
        } catch (Exception e) {
            enableMockMode("Error initializing Firebase: " + e.getMessage());
        }
    }

    private void enableMockMode(String reason) {
        this.isMockMode = true;
        System.err.println(">>> WARNING: " + reason);
        System.err.println(">>> Running GlamAI in Mock Database Mode (in-memory). Data will not be persisted after shutdown.");
    }

    public boolean isMockMode() {
        return isMockMode;
    }

    // CRUD Abstractions

    @SuppressWarnings("unchecked")
    public <T> List<T> getAll(String collection, Class<T> clazz) {
        List<T> results = new ArrayList<>();
        if (isMockMode) {
            Map<String, Map<String, Object>> docs = mockDatabase.getOrDefault(collection, Collections.emptyMap());
            for (Map<String, Object> data : docs.values()) {
                results.add(objectMapper.convertValue(data, clazz));
            }
        } else {
            try {
                firestore.collection(collection).get().get().getDocuments().forEach(doc -> {
                    results.add(objectMapper.convertValue(doc.getData(), clazz));
                });
            } catch (Exception e) {
                System.err.println("Firestore getAll error: " + e.getMessage());
            }
        }
        return results;
    }

    public <T> T getById(String collection, String id, Class<T> clazz) {
        if (id == null) return null;
        if (isMockMode) {
            Map<String, Map<String, Object>> docs = mockDatabase.getOrDefault(collection, Collections.emptyMap());
            Map<String, Object> data = docs.get(id);
            if (data == null) return null;
            return objectMapper.convertValue(data, clazz);
        } else {
            try {
                var doc = firestore.collection(collection).document(id).get().get();
                if (doc.exists()) {
                    return objectMapper.convertValue(doc.getData(), clazz);
                }
            } catch (Exception e) {
                System.err.println("Firestore getById error: " + e.getMessage());
            }
        }
        return null;
    }

    public <T> T getByField(String collection, String fieldName, Object value, Class<T> clazz) {
        if (fieldName == null || value == null) return null;
        if (isMockMode) {
            Map<String, Map<String, Object>> docs = mockDatabase.getOrDefault(collection, Collections.emptyMap());
            for (Map<String, Object> data : docs.values()) {
                if (value.equals(data.get(fieldName))) {
                    return objectMapper.convertValue(data, clazz);
                }
            }
        } else {
            try {
                var docs = firestore.collection(collection).whereEqualTo(fieldName, value).get().get().getDocuments();
                if (!docs.isEmpty()) {
                    return objectMapper.convertValue(docs.get(0).getData(), clazz);
                }
            } catch (Exception e) {
                System.err.println("Firestore getByField error: " + e.getMessage());
            }
        }
        return null;
    }


    @SuppressWarnings("unchecked")
    public void save(String collection, String id, Object data) {
        if (id == null || data == null) return;
        Map<String, Object> map = objectMapper.convertValue(data, Map.class);
        if (isMockMode) {
            mockDatabase.computeIfAbsent(collection, k -> new ConcurrentHashMap<>()).put(id, map);
        } else {
            try {
                firestore.collection(collection).document(id).set(map).get();
            } catch (Exception e) {
                System.err.println("Firestore save error: " + e.getMessage());
            }
        }
    }

    public void delete(String collection, String id) {
        if (id == null) return;
        if (isMockMode) {
            Map<String, Map<String, Object>> docs = mockDatabase.get(collection);
            if (docs != null) {
                docs.remove(id);
            }
        } else {
            try {
                firestore.collection(collection).document(id).delete().get();
            } catch (Exception e) {
                System.err.println("Firestore delete error: " + e.getMessage());
            }
        }
    }
}
