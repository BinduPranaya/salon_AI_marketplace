package com.example.demo.model;

import java.util.List;

public class Salon {
    private String id;
    private String name;
    private String description;
    private String city;
    private String address;
    private Double rating;
    private String ownerId;
    private List<String> images;
    private boolean approved;
    private Long createdAt;

    public Salon() {}

    public Salon(String id, String name, String description, String city, String address, Double rating, String ownerId, List<String> images, boolean approved, Long createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.city = city;
        this.address = address;
        this.rating = rating;
        this.ownerId = ownerId;
        this.images = images;
        this.approved = approved;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public static SalonBuilder builder() {
        return new SalonBuilder();
    }

    public static class SalonBuilder {
        private String id;
        private String name;
        private String description;
        private String city;
        private String address;
        private Double rating;
        private String ownerId;
        private List<String> images;
        private boolean approved;
        private Long createdAt;

        public SalonBuilder id(String id) { this.id = id; return this; }
        public SalonBuilder name(String name) { this.name = name; return this; }
        public SalonBuilder description(String description) { this.description = description; return this; }
        public SalonBuilder city(String city) { this.city = city; return this; }
        public SalonBuilder address(String address) { this.address = address; return this; }
        public SalonBuilder rating(Double rating) { this.rating = rating; return this; }
        public SalonBuilder ownerId(String ownerId) { this.ownerId = ownerId; return this; }
        public SalonBuilder images(List<String> images) { this.images = images; return this; }
        public SalonBuilder approved(boolean approved) { this.approved = approved; return this; }
        public SalonBuilder createdAt(Long createdAt) { this.createdAt = createdAt; return this; }

        public Salon build() {
            return new Salon(id, name, description, city, address, rating, ownerId, images, approved, createdAt);
        }
    }
}
