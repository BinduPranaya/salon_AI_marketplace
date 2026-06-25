package com.example.demo.model;

public class HairstylePreview {
    private String id;
    private String userId;
    private String originalImageUrl;
    private String selectedStyle;
    private String previewImageUrl;
    private Long createdAt;

    public HairstylePreview() {}

    public HairstylePreview(String id, String userId, String originalImageUrl, String selectedStyle, String previewImageUrl, Long createdAt) {
        this.id = id;
        this.userId = userId;
        this.originalImageUrl = originalImageUrl;
        this.selectedStyle = selectedStyle;
        this.previewImageUrl = previewImageUrl;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getOriginalImageUrl() { return originalImageUrl; }
    public void setOriginalImageUrl(String originalImageUrl) { this.originalImageUrl = originalImageUrl; }

    public String getSelectedStyle() { return selectedStyle; }
    public void setSelectedStyle(String selectedStyle) { this.selectedStyle = selectedStyle; }

    public String getPreviewImageUrl() { return previewImageUrl; }
    public void setPreviewImageUrl(String previewImageUrl) { this.previewImageUrl = previewImageUrl; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public static HairstylePreviewBuilder builder() {
        return new HairstylePreviewBuilder();
    }

    public static class HairstylePreviewBuilder {
        private String id;
        private String userId;
        private String originalImageUrl;
        private String selectedStyle;
        private String previewImageUrl;
        private Long createdAt;

        public HairstylePreviewBuilder id(String id) { this.id = id; return this; }
        public HairstylePreviewBuilder userId(String userId) { this.userId = userId; return this; }
        public HairstylePreviewBuilder originalImageUrl(String originalImageUrl) { this.originalImageUrl = originalImageUrl; return this; }
        public HairstylePreviewBuilder selectedStyle(String selectedStyle) { this.selectedStyle = selectedStyle; return this; }
        public HairstylePreviewBuilder previewImageUrl(String previewImageUrl) { this.previewImageUrl = previewImageUrl; return this; }
        public HairstylePreviewBuilder createdAt(Long createdAt) { this.createdAt = createdAt; return this; }

        public HairstylePreview build() {
            return new HairstylePreview(id, userId, originalImageUrl, selectedStyle, previewImageUrl, createdAt);
        }
    }
}
