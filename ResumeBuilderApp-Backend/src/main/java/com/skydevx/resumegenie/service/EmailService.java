package com.skydevx.resumegenie.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:${spring.mail.properties.mail.smtp.from:noreply@skydevx.com}}")
    private String fromEmail;

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException, java.io.UnsupportedEncodingException {
        log.info("Sending HTML email to recipient: [{}] with subject: [{}] from: [{}]", to, subject, fromEmail);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail, "Resume Genie");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
        log.info("HTML email successfully submitted to SMTP server for [{}]", to);
    }

    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String filename)
            throws MessagingException {
        log.info("Sending email with attachment to: [{}], filename: [{}]", to, filename);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        if (attachment != null && attachment.length > 0) {
            String attachmentName = (filename != null && !filename.isBlank()) ? filename : "resume.pdf";
            helper.addAttachment(attachmentName, new ByteArrayResource(attachment));
        }

        mailSender.send(message);
        log.info("Email with attachment successfully submitted for [{}]", to);
    }

    public void sendVerificationEmailAsync(String to, String name, String verificationLink) {
        sendVerificationEmailAsync(to, name, verificationLink, null);
    }

    public void sendVerificationEmailAsync(String to, String name, String verificationLink, String code) {
        CompletableFuture.runAsync(() -> {
            try {
                String codeHtml = (code != null && !code.isBlank()) ? """
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Your 6-Digit Verification Code</p>
                            <span style="font-family: monospace, Consolas, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">%s</span>
                        </div>
                        """.formatted(code) : "";

                String html = """
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <h1 style="color: #4f46e5; margin: 0;">Resume Genie</h1>
                                <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Powered by sky.devX</p>
                            </div>
                            <h2 style="color: #1e293b; font-size: 20px;">Confirm your email address</h2>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                                Hi %s,<br><br>
                                Thank you for creating your Resume Genie account. Please verify your email address to activate your account and start crafting professional resumes.
                            </p>
                            %s
                            <div style="text-align: center; margin: 24px 0;">
                                <a href="%s" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                                    Verify Email Address (1-Click)
                                </a>
                            </div>
                            <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                                Or copy and paste this verification URL into your browser:<br>
                                <a href="%s" style="color: #4f46e5; word-break: break-all;">%s</a>
                            </p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                                This code and link expire in 24 hours. If you did not create a Resume Genie account, please disregard this email.
                            </p>
                        </div>
                        """.formatted(name, codeHtml, verificationLink, verificationLink, verificationLink);

                sendHtmlEmail(to, "Verify your Resume Genie Account - sky.devX", html);
            } catch (Exception e) {
                log.error("Failed to dispatch verification email to [{}]: {}", to, e.getMessage(), e);
            }
        });
    }

    public void sendPasswordResetEmailAsync(String to, String name, String resetLink) {
        CompletableFuture.runAsync(() -> {
            try {
                String html = """
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <h1 style="color: #4f46e5; margin: 0;">Resume Genie</h1>
                                <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Powered by sky.devX</p>
                            </div>
                            <h2 style="color: #1e293b; font-size: 20px;">Password Reset Request</h2>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                                Hi %s,<br><br>
                                We received a request to reset the password for your Resume Genie account. Click the button below to set a new password:
                            </p>
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="%s" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                                    Reset Password
                                </a>
                            </div>
                            <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                                Or copy and paste this reset URL into your browser:<br>
                                <a href="%s" style="color: #4f46e5; word-break: break-all;">%s</a>
                            </p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                                This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
                            </p>
                        </div>
                        """.formatted(name, resetLink, resetLink, resetLink);

                sendHtmlEmail(to, "Reset your Resume Genie Password", html);
            } catch (Exception e) {
                log.warn("Failed to dispatch password reset email to [{}]: {}", to, e.getMessage());
            }
        });
    }
}
