package com.example.demo.model;

public class Review {
    private String id;
    private String userId;
    private String userName;
    private String salonId;
    private Double rating;
    private String comment;
    private Long createdAt;

    public Review() {}

    public Review(String id, String userId, String userName, String salonId, Double rating, String comment, Long createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.salonId = salonId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getSalonId() { return salonId; }
    public void setSalonId(String salonId) { this.salonId = salonId; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public static ReviewBuilder builder() {
        return new ReviewBuilder();
    }

    public static class ReviewBuilder {
        private String id;
        private String userId;
        private String userName;
        private String salonId;
        private Double rating;
        private String comment;
        private Long createdAt;

        public ReviewBuilder id(String id) { this.id = id; return this; }
        public ReviewBuilder userId(String userId) { this.userId = userId; return this; }
        public ReviewBuilder userName(String userName) { this.userName = userName; return this; }
        public ReviewBuilder salonId(String salonId) { this.salonId = salonId; return this; }
        public ReviewBuilder rating(Double rating) { this.rating = rating; return this; }
        public ReviewBuilder comment(String comment) { this.comment = comment; return this; }
        public ReviewBuilder createdAt(Long createdAt) { this.createdAt = createdAt; return this; }

        public Review build() {
            return new Review(id, userId, userName, salonId, rating, comment, createdAt);
        }
    }
}
