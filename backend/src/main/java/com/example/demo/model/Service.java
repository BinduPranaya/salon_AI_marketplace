package com.example.demo.model;

public class Service {
    private String id;
    private String salonId;
    private String name;
    private String category;
    private Double price;
    private String description;

    public Service() {}

    public Service(String id, String salonId, String name, String category, Double price, String description) {
        this.id = id;
        this.salonId = salonId;
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSalonId() { return salonId; }
    public void setSalonId(String salonId) { this.salonId = salonId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static ServiceBuilder builder() {
        return new ServiceBuilder();
    }

    public static class ServiceBuilder {
        private String id;
        private String salonId;
        private String name;
        private String category;
        private Double price;
        private String description;

        public ServiceBuilder id(String id) { this.id = id; return this; }
        public ServiceBuilder salonId(String salonId) { this.salonId = salonId; return this; }
        public ServiceBuilder name(String name) { this.name = name; return this; }
        public ServiceBuilder category(String category) { this.category = category; return this; }
        public ServiceBuilder price(Double price) { this.price = price; return this; }
        public ServiceBuilder description(String description) { this.description = description; return this; }

        public Service build() {
            return new Service(id, salonId, name, category, price, description);
        }
    }
}
