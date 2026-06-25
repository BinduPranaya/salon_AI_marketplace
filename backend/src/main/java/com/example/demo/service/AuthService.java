package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final FirestoreService firestoreService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(FirestoreService firestoreService, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.firestoreService = firestoreService;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public User register(User registrationData) {
        if (firestoreService.getByField("users", "email", registrationData.getEmail(), User.class) != null) {
            throw new RuntimeException("Email already in use.");
        }

        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .name(registrationData.getName())
                .email(registrationData.getEmail())
                .password(passwordEncoder.encode(registrationData.getPassword()))
                .role(registrationData.getRole() != null ? registrationData.getRole() : "USER")
                .profilePicture(registrationData.getProfilePicture() != null ? registrationData.getProfilePicture() : "")
                .createdAt(System.currentTimeMillis())
                .build();

        firestoreService.save("users", user.getId(), user);
        return user;
    }

    public String login(String email, String password) {
        User user = firestoreService.getByField("users", "email", email, User.class);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        return tokenProvider.generateToken(user.getEmail(), user.getRole());
    }

    public User getUserByEmail(String email) {
        return firestoreService.getByField("users", "email", email, User.class);
    }
}
