package com.skydevx.resumegenie.service;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.AuthResponse;
import com.skydevx.resumegenie.dto.LoginRequest;
import com.skydevx.resumegenie.dto.RegisterRequest;
import com.skydevx.resumegenie.exception.ResourceExistsException;
import com.skydevx.resumegenie.exception.ResourceNotFoundException;
import com.skydevx.resumegenie.repository.UserRepository;
import com.skydevx.resumegenie.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.client.url:http://localhost:8081}")
    private String appBaseUrl;

    @Value("${app.verification.required:false}")
    private boolean emailVerificationRequired;

    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration for email: [{}]", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ResourceExistsException("An account with email " + request.getEmail() + " already exists.");
        }

        LocalDateTime now = LocalDateTime.now();

        User newUser = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .profileImageUrl(request.getProfileImageUrl())
                .subscriptionPlan("FREE")
                .emailVerified(true)
                .verificationToken(null)
                .verificationExpires(null)
                .createdAt(now)
                .updatedAt(now)
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("User registered and auto-verified: [{}]", savedUser.getEmail());

        String jwtToken = jwtUtil.generateToken(savedUser.getId());
        return toAuthResponse(savedUser, jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Processing login attempt for email: [{}]", request.getEmail());

        User existingUser = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        // Auto-verify any previously unverified user on login
        if (!existingUser.isEmailVerified()) {
            existingUser.setEmailVerified(true);
            existingUser.setVerificationToken(null);
            existingUser.setUpdatedAt(LocalDateTime.now());
            existingUser = userRepository.save(existingUser);
        }

        String token = jwtUtil.generateToken(existingUser.getId());
        return toAuthResponse(existingUser, token);
    }

    public AuthResponse verifyEmail(String token) {
        return verifyEmail(null, token);
    }

    public AuthResponse verifyEmail(String email, String token) {
        log.info("Verifying email (bypassed/auto-approved): email=[{}], token=[{}]", email, token);
        User user = null;
        if (email != null && !email.isBlank()) {
            user = userRepository.findByEmail(email.toLowerCase().trim()).orElse(null);
        }
        if (user == null && token != null && !token.isBlank()) {
            user = userRepository.findByVerificationToken(token.trim()).orElse(null);
        }
        if (user != null) {
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            user.setVerificationExpires(null);
            user.setUpdatedAt(LocalDateTime.now());
            user = userRepository.save(user);
        }
        String jwtToken = user != null ? jwtUtil.generateToken(user.getId()) : "";
        return toAuthResponse(user != null ? user : User.builder().email(email).name("User").emailVerified(true).build(), jwtToken);
    }

    public String resendVerification(String email) {
        log.info("Verification not required. Returning instant success for email: [{}]", email);
        return "123456";
    }

    public void forgotPassword(String email) {
        log.info("Processing forgot password request for: [{}]", email);

        userRepository.findByEmail(email.toLowerCase().trim()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setPasswordResetToken(resetToken);
            user.setPasswordResetExpires(LocalDateTime.now().plusHours(1));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            String baseUrl = appBaseUrl.replaceAll("/+$", "");
            String resetLink = baseUrl + "/reset-password?token=" + resetToken;
            emailService.sendPasswordResetEmailAsync(user.getEmail(), user.getName(), resetLink);
        });
    }

    public void resetPassword(String token, String newPassword) {
        log.info("Processing password reset with token: [{}]", token);

        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or already used password reset token."));

        if (user.getPasswordResetExpires() != null && user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token has expired. Please request a new reset link.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Password successfully updated for user: [{}]", user.getEmail());
    }

    public AuthResponse getProfile(User currentUser) {
        User freshUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toAuthResponse(freshUser, null);
    }

    public AuthResponse updateProfileImage(User currentUser, String imageUrl) {
        User freshUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        freshUser.setProfileImageUrl(imageUrl);
        freshUser.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(freshUser);
        log.info("Saved profile image in MongoDB for user [{}]: length={}", freshUser.getEmail(), (imageUrl != null ? imageUrl.length() : 0));
        return toAuthResponse(savedUser, null);
    }

    public AuthResponse updateProfile(User currentUser, String name, String imageUrl) {
        User freshUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (name != null && !name.isBlank()) {
            freshUser.setName(name.trim());
        }
        if (imageUrl != null && !imageUrl.isBlank()) {
            freshUser.setProfileImageUrl(imageUrl);
        }
        freshUser.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(freshUser);
        log.info("Updated profile in MongoDB for user [{}]: name={}, hasImage={}", freshUser.getEmail(), name, (imageUrl != null));
        return toAuthResponse(savedUser, null);
    }

    public AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .subscriptionPlan(user.getSubscriptionPlan())
                .emailVerified(true)
                .token(token)
                .verificationCode(null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
