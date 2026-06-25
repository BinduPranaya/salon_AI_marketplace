package com.example.demo.model;

import java.util.List;
import java.util.Map;

public class FaceAnalysis {
    private String id;
    private String userId;
    private String selfieUrl;
    private String faceShape;
    private String hairType;
    private String hairDensity;
    private List<String> recommendedStyles;
    private Map<String, Integer> suitabilityScores;
    private Map<String, String> stylingTips;
    private Long createdAt;

    public FaceAnalysis() {}

    public FaceAnalysis(String id, String userId, String selfieUrl, String faceShape, String hairType, String hairDensity, List<String> recommendedStyles, Map<String, Integer> suitabilityScores, Map<String, String> stylingTips, Long createdAt) {
        this.id = id;
        this.userId = userId;
        this.selfieUrl = selfieUrl;
        this.faceShape = faceShape;
        this.hairType = hairType;
        this.hairDensity = hairDensity;
        this.recommendedStyles = recommendedStyles;
        this.suitabilityScores = suitabilityScores;
        this.stylingTips = stylingTips;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSelfieUrl() { return selfieUrl; }
    public void setSelfieUrl(String selfieUrl) { this.selfieUrl = selfieUrl; }

    public String getFaceShape() { return faceShape; }
    public void setFaceShape(String faceShape) { this.faceShape = faceShape; }

    public String getHairType() { return hairType; }
    public void setHairType(String hairType) { this.hairType = hairType; }

    public String getHairDensity() { return hairDensity; }
    public void setHairDensity(String hairDensity) { this.hairDensity = hairDensity; }

    public List<String> getRecommendedStyles() { return recommendedStyles; }
    public void setRecommendedStyles(List<String> recommendedStyles) { this.recommendedStyles = recommendedStyles; }

    public Map<String, Integer> getSuitabilityScores() { return suitabilityScores; }
    public void setSuitabilityScores(Map<String, Integer> suitabilityScores) { this.suitabilityScores = suitabilityScores; }

    public Map<String, String> getStylingTips() { return stylingTips; }
    public void setStylingTips(Map<String, String> stylingTips) { this.stylingTips = stylingTips; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public static FaceAnalysisBuilder builder() {
        return new FaceAnalysisBuilder();
    }

    public static class FaceAnalysisBuilder {
        private String id;
        private String userId;
        private String selfieUrl;
        private String faceShape;
        private String hairType;
        private String hairDensity;
        private List<String> recommendedStyles;
        private Map<String, Integer> suitabilityScores;
        private Map<String, String> stylingTips;
        private Long createdAt;

        public FaceAnalysisBuilder id(String id) { this.id = id; return this; }
        public FaceAnalysisBuilder userId(String userId) { this.userId = userId; return this; }
        public FaceAnalysisBuilder selfieUrl(String selfieUrl) { this.selfieUrl = selfieUrl; return this; }
        public FaceAnalysisBuilder faceShape(String faceShape) { this.faceShape = faceShape; return this; }
        public FaceAnalysisBuilder hairType(String hairType) { this.hairType = hairType; return this; }
        public FaceAnalysisBuilder hairDensity(String hairDensity) { this.hairDensity = hairDensity; return this; }
        public FaceAnalysisBuilder recommendedStyles(List<String> recommendedStyles) { this.recommendedStyles = recommendedStyles; return this; }
        public FaceAnalysisBuilder suitabilityScores(Map<String, Integer> suitabilityScores) { this.suitabilityScores = suitabilityScores; return this; }
        public FaceAnalysisBuilder stylingTips(Map<String, String> stylingTips) { this.stylingTips = stylingTips; return this; }
        public FaceAnalysisBuilder createdAt(Long createdAt) { this.createdAt = createdAt; return this; }

        public FaceAnalysis build() {
            return new FaceAnalysis(id, userId, selfieUrl, faceShape, hairType, hairDensity, recommendedStyles, suitabilityScores, stylingTips, createdAt);
        }
    }
}
