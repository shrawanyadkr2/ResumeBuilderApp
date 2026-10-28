package com.skydevx.resumegenie.controller;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.ApiResponse;
import com.skydevx.resumegenie.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Recruiter Email Dispatch", description = "Endpoints for emailing resumes directly to recruiters and hiring managers")
public class EmailController {

    private final EmailService emailService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final long MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    @PostMapping(value = "/send-resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Dispatch resume PDF as an email attachment to a recruiter")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendResumeByEmail(
            @RequestPart("recipientEmail") String recipientEmail,
            @RequestPart(value = "subject", required = false) String subject,
            @RequestPart(value = "message", required = false) String message,
            @RequestPart("pdfFile") MultipartFile pdfFile,
            @AuthenticationPrincipal User user) throws MessagingException, IOException {

        // Validate recipient email
        if (recipientEmail == null || recipientEmail.isBlank() || !EMAIL_PATTERN.matcher(recipientEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .message("Please provide a valid recipient email address.")
                    .build());
        }

        // Validate PDF file
        if (pdfFile == null || pdfFile.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .message("PDF attachment file is required.")
                    .build());
        }

        if (pdfFile.getSize() > MAX_PDF_SIZE_BYTES) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .message("PDF attachment exceeds maximum allowed size of 10MB.")
                    .build());
        }

        byte[] pdfBytes = pdfFile.getBytes();
        String originalFilename = pdfFile.getOriginalFilename();
        String filename = (originalFilename != null && !originalFilename.isBlank()) ? originalFilename : "resume.pdf";
        if (!filename.toLowerCase().endsWith(".pdf")) {
            filename += ".pdf";
        }

        String senderName = (user != null && user.getName() != null) ? user.getName() : "Candidate";
        String emailSubject = (subject != null && !subject.isBlank()) ? subject.trim() : "Job Application - " + senderName;
        String emailBody = (message != null && !message.isBlank())
                ? message.trim()
                : "Hello,\n\nPlease find attached my professional resume generated via Resume Genie.\n\nBest regards,\n" + senderName;

        emailService.sendEmailWithAttachment(recipientEmail.trim(), emailSubject, emailBody, pdfBytes, filename);

        Map<String, Object> data = Map.of(
                "recipient", recipientEmail.trim(),
                "filename", filename,
                "submissionStatus", "SUBMITTED_TO_GATEWAY"
        );

        return ResponseEntity.ok(ApiResponse.ok("Resume has been successfully submitted to Brevo for delivery to " + recipientEmail.trim(), data));
    }
}
