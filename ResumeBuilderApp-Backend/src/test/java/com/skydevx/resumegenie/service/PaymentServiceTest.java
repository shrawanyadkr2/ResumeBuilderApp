package com.skydevx.resumegenie.service;

import com.skydevx.resumegenie.document.Payment;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.repository.PaymentRepository;
import com.skydevx.resumegenie.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentService paymentService;

    private final String testWebhookSecret = "test_webhook_secret_key_12345";
    private final String testKeySecret = "test_razorpay_secret_key_12345";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "rzp_test_123");
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", testKeySecret);
        ReflectionTestUtils.setField(paymentService, "razorpayWebhookSecret", testWebhookSecret);
        ReflectionTestUtils.setField(paymentService, "plusPlanAmount", 49900);
        ReflectionTestUtils.setField(paymentService, "currency", "INR");
    }

    @Test
    @DisplayName("Webhook signature verification should process valid captured payment and upgrade user")
    void shouldProcessValidWebhookAndUpgradeUser() throws Exception {
        String payload = """
                {
                    "event": "payment.captured",
                    "payload": {
                        "payment": {
                            "entity": {
                                "id": "pay_987654",
                                "order_id": "order_123456"
                            }
                        }
                    }
                }
                """;

        // Generate HMAC-SHA256 signature
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(testWebhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            String h = Integer.toHexString(0xff & b);
            if (h.length() == 1) hex.append('0');
            hex.append(h);
        }
        String validSignature = hex.toString();

        Payment payment = Payment.builder()
                .id("pay_doc_1")
                .userId("user_upgrade_1")
                .razorpayOrderId("order_123456")
                .status("created")
                .planType("PLUS")
                .build();

        User user = User.builder()
                .id("user_upgrade_1")
                .subscriptionPlan("FREE")
                .build();

        when(paymentRepository.findByRazorpayOrderId("order_123456")).thenReturn(Optional.of(payment));
        when(userRepository.findById("user_upgrade_1")).thenReturn(Optional.of(user));

        boolean processed = paymentService.processWebhook(payload, validSignature);

        assertTrue(processed);
        assertEquals("paid", payment.getStatus());
        assertEquals("pay_987654", payment.getRazorpayPaymentId());
        assertEquals("PLUS", user.getSubscriptionPlan());

        verify(paymentRepository).save(payment);
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Webhook processing should be idempotent on duplicate events")
    void shouldHandleDuplicateWebhookEventsIdempotently() throws Exception {
        String payload = """
                {
                    "event": "order.paid",
                    "payload": {
                        "payment": {
                            "entity": {
                                "id": "pay_already_paid",
                                "order_id": "order_duplicate"
                            }
                        }
                    }
                }
                """;

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(testWebhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            String h = Integer.toHexString(0xff & b);
            if (h.length() == 1) hex.append('0');
            hex.append(h);
        }
        String validSignature = hex.toString();

        Payment alreadyPaidPayment = Payment.builder()
                .id("pay_doc_dup")
                .userId("user_1")
                .razorpayOrderId("order_duplicate")
                .status("paid") // Already paid!
                .build();

        when(paymentRepository.findByRazorpayOrderId("order_duplicate")).thenReturn(Optional.of(alreadyPaidPayment));

        boolean processed = paymentService.processWebhook(payload, validSignature);

        assertTrue(processed);
        // User should not be re-upgraded
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Invalid webhook signature should be rejected")
    void shouldRejectInvalidWebhookSignature() {
        String payload = "{\"event\": \"payment.captured\"}";
        String invalidSignature = "invalid_signature_hex_code_1234";

        boolean processed = paymentService.processWebhook(payload, invalidSignature);
        assertFalse(processed);
        verify(paymentRepository, never()).save(any());
    }
}
