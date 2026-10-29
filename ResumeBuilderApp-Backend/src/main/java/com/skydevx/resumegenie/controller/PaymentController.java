package com.skydevx.resumegenie.controller;

import com.razorpay.RazorpayException;
import com.skydevx.resumegenie.document.Payment;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.ApiResponse;
import com.skydevx.resumegenie.dto.CreateOrderRequest;
import com.skydevx.resumegenie.dto.VerifyPaymentRequest;
import com.skydevx.resumegenie.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment & Plus Subscription", description = "Endpoints for Razorpay order generation, signature verification, and webhook handling")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @Operation(summary = "Create a Razorpay payment order for Plus plan upgrade")
    public ResponseEntity<Map<String, Object>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User user) throws RazorpayException {

        Payment payment = paymentService.createOrder(user, request.getPlanType());

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("orderId", payment.getRazorpayOrderId());
        response.put("amount", payment.getAmount());
        response.put("currency", payment.getCurrency());
        response.put("receipt", payment.getReceipt());
        response.put("planType", payment.getPlanType());
        String keyId = paymentService.getRazorpayKeyId();
        response.put("keyId", keyId != null ? keyId : "rzp_test_TIY8F95ZYQV2PN");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature server-side")
    public ResponseEntity<ApiResponse<Map<String, String>>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal User currentUser) {

        boolean isValid = paymentService.verifyPayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                currentUser
        );

        if (isValid) {
            return ResponseEntity.ok(ApiResponse.ok(
                    "Payment verified successfully! Your account has been upgraded to Resume Genie Plus.",
                    Map.of("status", "success", "orderId", request.getRazorpayOrderId())
            ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.<Map<String, String>>builder()
                    .success(false)
                    .message("Payment signature verification failed. Please contact support.")
                    .build());
        }
    }

    @PostMapping("/webhook")
    @Operation(summary = "Process asynchronous webhooks from Razorpay")
    public ResponseEntity<Map<String, Object>> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        if (signature == null || signature.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Missing X-Razorpay-Signature header"));
        }

        boolean processed = paymentService.processWebhook(payload, signature);

        if (processed) {
            return ResponseEntity.ok(Map.of("status", "received"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Invalid webhook signature or payload"));
        }
    }

    @GetMapping("/history")
    @Operation(summary = "Retrieve payment transaction history for authenticated user")
    public ResponseEntity<List<Payment>> getPaymentHistory(@AuthenticationPrincipal User user) {
        List<Payment> payments = paymentService.getUserPayments(user);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Retrieve payment order details by order ID")
    public ResponseEntity<Payment> getOrderDetails(
            @PathVariable("orderId") String orderId,
            @AuthenticationPrincipal User user) {

        Payment payment = paymentService.getPaymentDetails(orderId, user);
        return ResponseEntity.ok(payment);
    }
}
