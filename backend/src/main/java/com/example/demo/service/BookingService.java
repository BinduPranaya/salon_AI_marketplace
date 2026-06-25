package com.example.demo.service;

import com.example.demo.model.Booking;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final FirestoreService firestoreService;

    public BookingService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public Booking createBooking(Booking booking) {
        booking.setId(UUID.randomUUID().toString());
        booking.setStatus("PENDING");
        booking.setCreatedAt(System.currentTimeMillis());
        firestoreService.save("bookings", booking.getId(), booking);
        return booking;
    }

    public List<Booking> getBookingsByUserId(String userId) {
        List<Booking> bookings = firestoreService.getAll("bookings", Booking.class);
        return bookings.stream()
                .filter(b -> b.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public List<Booking> getBookingsBySalonId(String salonId) {
        List<Booking> bookings = firestoreService.getAll("bookings", Booking.class);
        return bookings.stream()
                .filter(b -> b.getSalonId().equals(salonId))
                .collect(Collectors.toList());
    }

    public List<Booking> getAllBookings() {
        return firestoreService.getAll("bookings", Booking.class);
    }

    public Booking updateBookingStatus(String id, String status) {
        Booking booking = firestoreService.getById("bookings", id, Booking.class);
        if (booking == null) {
            throw new RuntimeException("Booking not found with ID: " + id);
        }
        booking.setStatus(status.toUpperCase());
        firestoreService.save("bookings", id, booking);
        return booking;
    }
}
