package com.example.demo.model;

public class Booking {
    private String id;
    private String userId;
    private String salonId;
    private String serviceId;
    private String bookingDate; // YYYY-MM-DD
    private String timeSlot;    // e.g. "10:00 AM"
    private String status;      // PENDING, CONFIRMED, COMPLETED, CANCELLED
    private Long createdAt;

    public Booking() {}

    public Booking(String id, String userId, String salonId, String serviceId, String bookingDate, String timeSlot, String status, Long createdAt) {
        this.id = id;
        this.userId = userId;
        this.salonId = salonId;
        this.serviceId = serviceId;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSalonId() { return salonId; }
    public void setSalonId(String salonId) { this.salonId = salonId; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private String id;
        private String userId;
        private String salonId;
        private String serviceId;
        private String bookingDate;
        private String timeSlot;
        private String status;
        private Long createdAt;

        public BookingBuilder id(String id) { this.id = id; return this; }
        public BookingBuilder userId(String userId) { this.userId = userId; return this; }
        public BookingBuilder salonId(String salonId) { this.salonId = salonId; return this; }
        public BookingBuilder serviceId(String serviceId) { this.serviceId = serviceId; return this; }
        public BookingBuilder bookingDate(String bookingDate) { this.bookingDate = bookingDate; return this; }
        public BookingBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public BookingBuilder status(String status) { this.status = status; return this; }
        public BookingBuilder createdAt(Long createdAt) { this.createdAt = createdAt; return this; }

        public Booking build() {
            return new Booking(id, userId, salonId, serviceId, bookingDate, timeSlot, status, createdAt);
        }
    }
}
