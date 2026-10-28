package com.skydevx.resumegenie.controller;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.*;
import com.skydevx.resumegenie.service.AuthService;
import com.skydevx.resumegenie.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication & User Management", description = "Endpoints for user registration, authentication, verification, and profile management")
public class AuthController {

    private final AuthService authService;
    private final FileUploadService fileUploadService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Registration successful.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful.", response));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify account email address via confirmation token (Browser link)")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmailGet(@RequestParam("token") String token) {
        AuthResponse response = authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully! You may now sign in.", response));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify account email address via JSON body (Mobile code/token)")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmailPost(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null || token.isBlank()) {
            token = request.get("code");
        }
        String email = request.get("email");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.<AuthResponse>builder()
                    .success(false)
                    .message("Verification code or token is required")
                    .build());
        }
        AuthResponse response = authService.verifyEmail(email, token);
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully!", response));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend account verification email")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("Email is required")
                    .build());
        }
        authService.resendVerification(email);
        return ResponseEntity.ok(ApiResponse.ok("Verification email resent. Please check your inbox."));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("If an account exists with this email, a password reset link has been dispatched."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using verified reset token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok("Password has been reset successfully. You may now log in with your new password."));
    }

    @GetMapping({"/profile", "/me"})
    @Operation(summary = "Retrieve authenticated user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> getProfile(@AuthenticationPrincipal User user) {
        AuthResponse response = authService.getProfile(user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload user profile avatar photo (JPEG, PNG, WebP <= 5MB)")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {

        Map<String, String> result = fileUploadService.uploadUserProfileImage(user, file);
        return ResponseEntity.ok(result);
    }
}
