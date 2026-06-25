package com.example.demo.controller;

import com.example.demo.model.Booking;
import com.example.demo.model.Salon;
import com.example.demo.model.Service;
import com.example.demo.model.User;
import com.example.demo.service.BookingService;
import com.example.demo.service.FirestoreService;
import com.example.demo.service.SalonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final FirestoreService firestoreService;
    private final SalonService salonService;
    private final BookingService bookingService;

    public DashboardController(FirestoreService firestoreService, SalonService salonService, BookingService bookingService) {
        this.firestoreService = firestoreService;
        this.salonService = salonService;
        this.bookingService = bookingService;
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getOwnerDashboardStats(@PathVariable String ownerId) {
        try {
            List<Salon> salons = firestoreService.getAll("salons", Salon.class).stream()
                    .filter(s -> s.getOwnerId().equals(ownerId))
                    .collect(Collectors.toList());

            List<String> salonIds = salons.stream().map(Salon::getId).collect(Collectors.toList());

            List<Service> services = firestoreService.getAll("services", Service.class).stream()
                    .filter(s -> salonIds.contains(s.getSalonId()))
                    .collect(Collectors.toList());

            List<Booking> bookings = bookingService.getAllBookings().stream()
                    .filter(b -> salonIds.contains(b.getSalonId()))
                    .collect(Collectors.toList());

            long totalBookings = bookings.size();
            long pendingBookings = bookings.stream().filter(b -> "PENDING".equalsIgnoreCase(b.getStatus())).count();
            long confirmedBookings = bookings.stream().filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus())).count();
            long completedBookings = bookings.stream().filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus())).count();
            long cancelledBookings = bookings.stream().filter(b -> "CANCELLED".equalsIgnoreCase(b.getStatus())).count();

            double totalRevenue = bookings.stream()
                    .filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus()) || "CONFIRMED".equalsIgnoreCase(b.getStatus()))
                    .mapToDouble(b -> {
                        Service s = services.stream().filter(srv -> srv.getId().equals(b.getServiceId())).findFirst().orElse(null);
                        return s != null ? s.getPrice() : 0.0;
                    })
                    .sum();

            Map<String, Object> stats = new HashMap<>();
            stats.put("salons", salons);
            stats.put("servicesCount", services.size());
            stats.put("totalBookings", totalBookings);
            stats.put("pendingBookings", pendingBookings);
            stats.put("confirmedBookings", confirmedBookings);
            stats.put("completedBookings", completedBookings);
            stats.put("cancelledBookings", cancelledBookings);
            stats.put("totalRevenue", totalRevenue);
            stats.put("bookings", bookings);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAdminDashboardStats() {
        try {
            List<Salon> salons = firestoreService.getAll("salons", Salon.class);
            List<User> users = firestoreService.getAll("users", User.class);
            List<Booking> bookings = bookingService.getAllBookings();

            long totalUsers = users.size();
            long customers = users.stream().filter(u -> "USER".equalsIgnoreCase(u.getRole())).count();
            long owners = users.stream().filter(u -> "SALON_OWNER".equalsIgnoreCase(u.getRole())).count();
            long admins = users.stream().filter(u -> "ADMIN".equalsIgnoreCase(u.getRole())).count();

            long totalSalons = salons.size();
            long approvedSalons = salons.stream().filter(Salon::isApproved).count();
            long pendingSalons = salons.stream().filter(s -> !s.isApproved()).count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("customersCount", customers);
            stats.put("ownersCount", owners);
            stats.put("adminsCount", admins);
            stats.put("totalSalons", totalSalons);
            stats.put("approvedSalons", approvedSalons);
            stats.put("pendingSalons", pendingSalons);
            stats.put("totalBookings", bookings.size());
            stats.put("salons", salons);
            stats.put("users", users.stream().peek(u -> u.setPassword(null)).collect(Collectors.toList()));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/admin/salons/{salonId}/approve")
    public ResponseEntity<?> approveSalon(@PathVariable String salonId, @RequestParam boolean approve) {
        try {
            Salon salon = salonService.getSalonById(salonId);
            if (salon == null) {
                return ResponseEntity.notFound().build();
            }
            salon.setApproved(approve);
            firestoreService.save("salons", salonId, salon);
            return ResponseEntity.ok(salon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
