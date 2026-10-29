package com.skydevx.resumegenie.controller;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.*;
import com.skydevx.resumegenie.service.AuthService;
import com.skydevx.resumegenie.service.EmailService;
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
    private final EmailService emailService;

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

    @GetMapping(value = "/verify-email", produces = MediaType.TEXT_HTML_VALUE)
    @Operation(summary = "Verify account email address via confirmation token (Browser link)")
    public ResponseEntity<String> verifyEmailGet(@RequestParam("token") String token) {
        try {
            authService.verifyEmail(token);
            String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Email Verified - Resume Genie</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #090D16; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
                    .card { background: #0F172A; border: 1px solid #1E293B; border-radius: 20px; padding: 48px 32px; text-align: center; max-width: 440px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
                    .icon { font-size: 64px; margin-bottom: 20px; display: inline-block; }
                    h1 { color: #10B981; font-size: 26px; font-weight: 800; margin: 0 0 12px 0; }
                    p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; }
                    .badge { background: rgba(0, 102, 255, 0.15); color: #38BDF8; padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; border: 1px solid #0284C7; display: inline-block; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="icon">✅</div>
                    <h1>Email Verified!</h1>
                    <p>Your Resume Genie account is now verified and active. You can return to the mobile app and sign in right away.</p>
                    <div class="badge">POWERED BY SKY.DEVX</div>
                  </div>
                </body>
                </html>
                """;
            return ResponseEntity.ok(html);
        } catch (Exception ex) {
            String errorHtml = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Verification Status - Resume Genie</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #090D16; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
                    .card { background: #0F172A; border: 1px solid #1E293B; border-radius: 20px; padding: 48px 32px; text-align: center; max-width: 440px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
                    .icon { font-size: 64px; margin-bottom: 20px; display: inline-block; }
                    h1 { color: #38BDF8; font-size: 24px; font-weight: 800; margin: 0 0 12px 0; }
                    p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="icon">ℹ️</div>
                    <h1>Verification Notice</h1>
                    <p>%s</p>
                  </div>
                </body>
                </html>
                """.formatted(ex.getMessage() != null ? ex.getMessage() : "Invalid or expired token. If you already verified, please sign in.");
            return ResponseEntity.ok(errorHtml);
        }
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
    public ResponseEntity<ApiResponse<Map<String, String>>> resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, String>>builder()
                    .success(false)
                    .message("Email is required")
                    .build());
        }
        String code = authService.resendVerification(email);
        return ResponseEntity.ok(ApiResponse.ok("Verification email resent. Please check your inbox.", Map.of("code", code != null ? code : "")));
    }

    @GetMapping("/test-email")
    @Operation(summary = "Diagnostic test endpoint for email delivery")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestParam("to") String to) {
        return ResponseEntity.ok(emailService.testSendEmail(to));
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

    @PutMapping({"/profile", "/me"})
    @Operation(summary = "Update authenticated user profile (name, profileImageUrl)")
    public ResponseEntity<ApiResponse<AuthResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> updates) {
        String name = (String) updates.get("name");
        String imageUrl = (String) updates.get("profileImageUrl");
        if (imageUrl == null) {
            imageUrl = (String) updates.get("imageUrl");
        }
        if (imageUrl != null && imageUrl.startsWith("data:")) {
            imageUrl = fileUploadService.uploadDataUriToCloudinary(imageUrl, "users");
        }
        AuthResponse response = authService.updateProfile(user, name, imageUrl);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully.", response));
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload user profile avatar photo (JPEG, PNG, WebP <= 25MB)")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {

        Map<String, String> result = fileUploadService.uploadUserProfileImage(user, file);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/upload-avatar", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Upload user profile avatar as Base64 Data URI directly to Cloudinary")
    public ResponseEntity<Map<String, String>> uploadAvatarJson(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> payload) {
        String base64Data = payload.get("image");
        if (base64Data == null || base64Data.isBlank()) {
            base64Data = payload.get("data");
        }
        if (base64Data == null || base64Data.isBlank()) {
            base64Data = payload.get("profileImageUrl");
        }
        if (base64Data == null || base64Data.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No image payload provided"));
        }
        String cloudinaryUrl = fileUploadService.uploadDataUriToCloudinary(base64Data, "users");
        authService.updateProfileImage(user, cloudinaryUrl);
        return ResponseEntity.ok(Map.of("imageUrl", cloudinaryUrl, "message", "User profile photo uploaded to Cloudinary successfully."));
    }
}
