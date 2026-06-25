package com.example.demo.service;

import com.example.demo.model.Review;
import com.example.demo.model.Salon;
import com.example.demo.model.Service;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class SalonService {

    private final FirestoreService firestoreService;

    public SalonService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<Salon> getSalons(String city, String name, String serviceCategory, Boolean approvedOnly) {
        List<Salon> salons = firestoreService.getAll("salons", Salon.class);
        List<Service> services = firestoreService.getAll("services", Service.class);

        return salons.stream()
                .filter(salon -> !approvedOnly || salon.isApproved())
                .filter(salon -> city == null || city.isEmpty() || salon.getCity().equalsIgnoreCase(city))
                .filter(salon -> name == null || name.isEmpty() || salon.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(salon -> {
                    if (serviceCategory == null || serviceCategory.isEmpty()) return true;
                    return services.stream()
                            .anyMatch(s -> s.getSalonId().equals(salon.getId()) && s.getCategory().equalsIgnoreCase(serviceCategory));
                })
                .collect(Collectors.toList());
    }

    public Salon getSalonById(String id) {
        return firestoreService.getById("salons", id, Salon.class);
    }

    public List<Service> getSalonServices(String salonId) {
        List<Service> allServices = firestoreService.getAll("services", Service.class);
        return allServices.stream()
                .filter(s -> s.getSalonId().equals(salonId))
                .collect(Collectors.toList());
    }

    public List<Review> getSalonReviews(String salonId) {
        List<Review> allReviews = firestoreService.getAll("reviews", Review.class);
        return allReviews.stream()
                .filter(r -> r.getSalonId().equals(salonId))
                .collect(Collectors.toList());
    }

    public Review addReview(String salonId, Review review) {
        review.setId(UUID.randomUUID().toString());
        review.setSalonId(salonId);
        review.setCreatedAt(System.currentTimeMillis());
        firestoreService.save("reviews", review.getId(), review);

        // Recalculate salon average rating
        recalculateSalonRating(salonId);

        return review;
    }

    private void recalculateSalonRating(String salonId) {
        Salon salon = getSalonById(salonId);
        if (salon == null) return;

        List<Review> reviews = getSalonReviews(salonId);
        if (reviews.isEmpty()) {
            salon.setRating(5.0);
        } else {
            double avg = reviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
            salon.setRating(Math.round(avg * 10.0) / 10.0);
        }
        firestoreService.save("salons", salon.getId(), salon);
    }

    public Salon saveSalon(Salon salon) {
        if (salon.getId() == null) {
            salon.setId(UUID.randomUUID().toString());
            salon.setCreatedAt(System.currentTimeMillis());
        }
        firestoreService.save("salons", salon.getId(), salon);
        return salon;
    }

    public Service saveService(Service service) {
        if (service.getId() == null) {
            service.setId(UUID.randomUUID().toString());
        }
        firestoreService.save("services", service.getId(), service);
        return service;
    }

    public void deleteService(String serviceId) {
        firestoreService.delete("services", serviceId);
    }
}
