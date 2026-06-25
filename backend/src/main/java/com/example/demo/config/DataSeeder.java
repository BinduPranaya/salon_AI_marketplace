package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.service.FirestoreService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private final FirestoreService db;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(FirestoreService db, PasswordEncoder passwordEncoder) {
        this.db = db;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> Seeding database with realistic startup data...");

        // 1. Seed Users (Admin, Salon Owners, Customers)
        User admin = User.builder()
                .id("user_admin")
                .name("GlamAI Admin")
                .email("admin@glamai.com")
                .password(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .profilePicture("https://api.dicebear.com/7.x/bottts/svg?seed=admin")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", admin.getId(), admin);

        User owner1 = User.builder()
                .id("user_owner1")
                .name("Marcus Aurelius")
                .email("owner1@glamai.com")
                .password(passwordEncoder.encode("owner123"))
                .role("SALON_OWNER")
                .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", owner1.getId(), owner1);

        User owner2 = User.builder()
                .id("user_owner2")
                .name("Jessica Alba")
                .email("owner2@glamai.com")
                .password(passwordEncoder.encode("owner123"))
                .role("SALON_OWNER")
                .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", owner2.getId(), owner2);

        User owner3 = User.builder()
                .id("user_owner3")
                .name("Elena Rostova")
                .email("owner3@glamai.com")
                .password(passwordEncoder.encode("owner123"))
                .role("SALON_OWNER")
                .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Elena")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", owner3.getId(), owner3);

        User customer1 = User.builder()
                .id("user_cust1")
                .name("Alice Smith")
                .email("user1@glamai.com")
                .password(passwordEncoder.encode("user123"))
                .role("USER")
                .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Alice")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", customer1.getId(), customer1);

        User customer2 = User.builder()
                .id("user_cust2")
                .name("Bob Johnson")
                .email("user2@glamai.com")
                .password(passwordEncoder.encode("user123"))
                .role("USER")
                .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Bob")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", customer2.getId(), customer2);

        User customer3 = User.builder()
                .id("user_cust3")
                .name("Clara Oswald")
                .email("user3@glamai.com")
                .password(passwordEncoder.encode("user123"))
                .role("USER")
                .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Clara")
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("users", customer3.getId(), customer3);

        // 2. Seed Salons
        // Let's use high-quality AI images generated on the fly via pollinations as defaults
        Salon salon1 = Salon.builder()
                .id("salon_crown")
                .name("The Crown Grooming Co.")
                .description("A premium grooming experience for gentlemen. Offering classic haircuts, hot towel shaves, and beard grooming in a refined vintage atmosphere.")
                .city("New York")
                .address("120 Broadway, Manhattan")
                .rating(4.8)
                .ownerId(owner1.getId())
                .images(List.of(
                        "https://image.pollinations.ai/prompt/luxurious_vintage_mens_barber_shop_interior_wood_leather_8k?nologo=true&seed=101",
                        "https://image.pollinations.ai/prompt/men_grooming_hot_towel_shave_treatment_8k?nologo=true&seed=102"
                ))
                .approved(true)
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("salons", salon1.getId(), salon1);

        Salon salon2 = Salon.builder()
                .id("salon_aura")
                .name("Aura Beauty Lounge")
                .description("Specializing in bridal makeup, luxury hair spa, and custom coloring. We use organic, eco-friendly products to pamper your hair and highlight your natural radiance.")
                .city("Los Angeles")
                .address("8432 Melrose Pl, West Hollywood")
                .rating(4.9)
                .ownerId(owner2.getId())
                .images(List.of(
                        "https://image.pollinations.ai/prompt/modern_luxury_aesthetic_hair_salon_interior_pastel_gold_8k?nologo=true&seed=201",
                        "https://image.pollinations.ai/prompt/professional_woman_getting_hair_styled_in_salon_8k?nologo=true&seed=202"
                ))
                .approved(true)
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("salons", salon2.getId(), salon2);

        Salon salon3 = Salon.builder()
                .id("salon_vogue")
                .name("Vogue Style Lab")
                .description("Avant-garde coloring, haircuts, and styling. Express your identity with our master stylists. We stay ahead of global fashion trends to offer bold, personalized looks.")
                .city("San Francisco")
                .address("450 Sutter St")
                .rating(4.7)
                .ownerId(owner3.getId())
                .images(List.of(
                        "https://image.pollinations.ai/prompt/sleek_futuristic_minimalist_hair_salon_neon_accents_8k?nologo=true&seed=301"
                ))
                .approved(true)
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("salons", salon3.getId(), salon3);

        Salon salon4 = Salon.builder()
                .id("salon_budget")
                .name("Budget Cuts")
                .description("Affordable, fast, and high-quality haircuts for students and busy professionals alike. No appointments needed, walk-ins welcome!")
                .city("New York")
                .address("242 W 14th St")
                .rating(4.2)
                .ownerId(owner1.getId())
                .images(List.of(
                        "https://image.pollinations.ai/prompt/clean_simple_bright_neighborhood_hair_salon_8k?nologo=true&seed=401"
                ))
                .approved(true)
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("salons", salon4.getId(), salon4);

        Salon salon5 = Salon.builder()
                .id("salon_velvet")
                .name("The Velvet Room")
                .description("A highly exclusive beauty salon offering premium caviar hair spa, high-end pampering, and editorial styling in a private, luxurious setting.")
                .city("Los Angeles")
                .address("9200 Sunset Blvd")
                .rating(5.0)
                .ownerId(owner2.getId())
                .images(List.of(
                        "https://image.pollinations.ai/prompt/ultra_luxury_exclusive_private_salon_interior_velvet_chairs_8k?nologo=true&seed=501"
                ))
                .approved(false) // Pending approval for Admin Dashboard testing!
                .createdAt(System.currentTimeMillis())
                .build();
        db.save("salons", salon5.getId(), salon5);

        // 3. Seed Services
        // Salon 1: Crown Grooming
        db.save("services", "srv_crown1", Service.builder()
                .id("srv_crown1").salonId(salon1.getId())
                .name("Classic Haircut").category("Haircut").price(45.0)
                .description("Precision scissor and clipper cut, customized for your face shape. Includes wash, scalp massage, and style styling.")
                .build());
        db.save("services", "srv_crown2", Service.builder()
                .id("srv_crown2").salonId(salon1.getId())
                .name("Luxury Beard Grooming").category("Grooming").price(35.0)
                .description("Detailed beard shaping and line-up with hot lather neck shave, conditioning beard oil, and hot towel treatment.")
                .build());
        db.save("services", "srv_crown3", Service.builder()
                .id("srv_crown3").salonId(salon1.getId())
                .name("Royal Hair & Scalp Spa").category("Hair Spa").price(65.0)
                .description("Rejuvenating scalp exfoliation, deep conditioning mask, and extended head and neck massage.")
                .build());

        // Salon 2: Aura Beauty Lounge
        db.save("services", "srv_aura1", Service.builder()
                .id("srv_aura1").salonId(salon2.getId())
                .name("Luxury Blowout").category("Haircut").price(55.0)
                .description("Includes shampoo, restorative scalp massage, custom blow dry, and hot iron finish for lasting volume.")
                .build());
        db.save("services", "srv_aura2", Service.builder()
                .id("srv_aura2").salonId(salon2.getId())
                .name("Balayage & Hair Coloring").category("Hair Coloring").price(180.0)
                .description("Custom hand-painted highlights that add dimension and brightness. Includes gloss toner and blow dry.")
                .build());
        db.save("services", "srv_aura3", Service.builder()
                .id("srv_aura3").salonId(salon2.getId())
                .name("Bridal Makeup & Styling").category("Bridal Makeup").price(250.0)
                .description("Premium HD airbrush makeup and elegant wedding hair design. Trials are booked separately.")
                .build());

        // Salon 3: Vogue Style Lab
        db.save("services", "srv_vogue1", Service.builder()
                .id("srv_vogue1").salonId(salon3.getId())
                .name("Modern Pixie & Bob Cuts").category("Haircut").price(80.0)
                .description("Edgy, contemporary cuts tailored to enhance face features. Includes wash, style, and blow dry.")
                .build());
        db.save("services", "srv_vogue2", Service.builder()
                .id("srv_vogue2").salonId(salon3.getId())
                .name("Vibrant Fashion Color").category("Hair Coloring").price(210.0)
                .description("Full bleach, pre-toning, and application of premium fashion shades (e.g. platinum, pastel rose, emerald).")
                .build());

        // Salon 4: Budget Cuts
        db.save("services", "srv_budget1", Service.builder()
                .id("srv_budget1").salonId(salon4.getId())
                .name("Quick Dry Trim").category("Haircut").price(25.0)
                .description("A clean, fast trim on dry hair to keep your style in shape. Does not include wash.")
                .build());
        db.save("services", "srv_budget2", Service.builder()
                .id("srv_budget2").salonId(salon4.getId())
                .name("Root Touch Up").category("Hair Coloring").price(65.0)
                .description("Single process root color application to match your existing shade. Covers grey hair.")
                .build());

        // Salon 5: Velvet Room
        db.save("services", "srv_velvet1", Service.builder()
                .id("srv_velvet1").salonId(salon5.getId())
                .name("Premium Caviar Hair Spa").category("Hair Spa").price(150.0)
                .description("Signature hair repair using caviar extract formulas to restore elasticity and mirror-like shine.")
                .build());

        // 4. Seed Reviews
        db.save("reviews", "rev1", Review.builder()
                .id("rev1").salonId(salon1.getId()).userId(customer1.getId()).userName(customer1.getName())
                .rating(5.0).comment("Best haircut in Manhattan! Marcus knows exactly what style works with my face shape. Super premium experience.")
                .createdAt(System.currentTimeMillis() - 86400000 * 5)
                .build());
        db.save("reviews", "rev2", Review.builder()
                .id("rev2").salonId(salon1.getId()).userId(customer2.getId()).userName(customer2.getName())
                .rating(4.6).comment("Very clean shop and professional staff. The hot towel shave is a must-try. I will definitely return.")
                .createdAt(System.currentTimeMillis() - 86400000 * 2)
                .build());
        db.save("reviews", "rev3", Review.builder()
                .id("rev3").salonId(salon2.getId()).userId(customer3.getId()).userName(customer3.getName())
                .rating(5.0).comment("Elena styled my hair for an editorial photoshoot and it turned out spectacular! The salon interior is gorgeous.")
                .createdAt(System.currentTimeMillis() - 86400000 * 10)
                .build());

        // 5. Seed Bookings
        db.save("bookings", "book1", Booking.builder()
                .id("book1").userId(customer1.getId()).salonId(salon1.getId()).serviceId("srv_crown1")
                .bookingDate("2026-06-20").timeSlot("10:00 AM").status("COMPLETED")
                .createdAt(System.currentTimeMillis() - 86400000 * 6)
                .build());

        db.save("bookings", "book2", Booking.builder()
                .id("book2").userId(customer2.getId()).salonId(salon1.getId()).serviceId("srv_crown2")
                .bookingDate("2026-06-25").timeSlot("02:00 PM").status("PENDING")
                .createdAt(System.currentTimeMillis() - 86400000 * 1)
                .build());

        db.save("bookings", "book3", Booking.builder()
                .id("book3").userId(customer3.getId()).salonId(salon2.getId()).serviceId("srv_aura3")
                .bookingDate("2026-06-28").timeSlot("11:30 AM").status("CONFIRMED")
                .createdAt(System.currentTimeMillis() - 86400000 * 2)
                .build());

        // 6. Seed Face Analysis History
        db.save("face_analyses", "fa1", FaceAnalysis.builder()
                .id("fa1")
                .userId(customer1.getId())
                .selfieUrl("https://image.pollinations.ai/prompt/close_up_portrait_corporate_headshot_young_man_8k?nologo=true&seed=55")
                .faceShape("Oval")
                .hairType("Wavy")
                .hairDensity("Medium")
                .recommendedStyles(List.of("Pompadour", "Textured Quiff", "Side Part"))
                .suitabilityScores(Map.of("Pompadour", 95, "Textured Quiff", 92, "Side Part", 89))
                .stylingTips(Map.of(
                        "Pompadour", "Use a blow dryer to lift hair at the front and style with high-shine pomade.",
                        "Textured Quiff", "Apply matte clay to dry hair to build volume and natural texture.",
                        "Side Part", "Part your hair along its natural line and comb down with a medium-hold gel."
                ))
                .createdAt(System.currentTimeMillis() - 86400000 * 5)
                .build());

        System.out.println(">>> Startup database seeding completed successfully!");
    }
}
