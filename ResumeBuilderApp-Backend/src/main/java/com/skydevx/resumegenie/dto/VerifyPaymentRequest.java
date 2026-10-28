package com.skydevx.resumegenie.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyPaymentRequest {

    @NotBlank(message = "razorpay_order_id is required")
    @JsonProperty("razorpay_order_id")
    @JsonAlias({"razorpayOrderId", "orderId", "razorpay_order_id"})
    private String razorpayOrderId;

    @NotBlank(message = "razorpay_payment_id is required")
    @JsonProperty("razorpay_payment_id")
    @JsonAlias({"razorpayPaymentId", "paymentId", "razorpay_payment_id"})
    private String razorpayPaymentId;

    @NotBlank(message = "razorpay_signature is required")
    @JsonProperty("razorpay_signature")
    @JsonAlias({"razorpaySignature", "signature", "razorpay_signature"})
    private String razorpaySignature;
}
