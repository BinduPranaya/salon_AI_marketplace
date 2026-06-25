package com.example.demo.controller;

import com.example.demo.model.Review;
import com.example.demo.model.Salon;
import com.example.demo.model.Service;
import com.example.demo.service.SalonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salons")
public class SalonController {

    private final SalonService salonService;

    public SalonController(SalonService salonService) {
        this.salonService = salonService;
    }

    @GetMapping
    public ResponseEntity<List<Salon>> getSalons(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String serviceCategory,
            @RequestParam(defaultValue = "true") Boolean approvedOnly) {
        return ResponseEntity.ok(salonService.getSalons(city, name, serviceCategory, approvedOnly));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salon> getSalonById(@PathVariable String id) {
        Salon salon = salonService.getSalonById(id);
        if (salon == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(salon);
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<List<Service>> getSalonServices(@PathVariable String id) {
        return ResponseEntity.ok(salonService.getSalonServices(id));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getSalonReviews(@PathVariable String id) {
        return ResponseEntity.ok(salonService.getSalonReviews(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable String id, @RequestBody Review review) {
        try {
            Review added = salonService.addReview(id, review);
            return ResponseEntity.ok(added);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerSalon(@RequestBody Salon salon) {
        try {
            Salon saved = salonService.saveSalon(salon);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/services")
    public ResponseEntity<?> saveService(@PathVariable String id, @RequestBody Service service) {
        try {
            service.setSalonId(id);
            Service saved = salonService.saveService(service);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/services/{serviceId}")
    public ResponseEntity<?> deleteService(@PathVariable String id, @PathVariable String serviceId) {
        try {
            salonService.deleteService(serviceId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
