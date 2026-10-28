package com.skydevx.resumegenie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skydevx.resumegenie.document.Payment;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.CreateOrderRequest;
import com.skydevx.resumegenie.dto.VerifyPaymentRequest;
import com.skydevx.resumegenie.exception.GlobalExceptionHandler;
import com.skydevx.resumegenie.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private final User testUser = User.builder().id("user_pay_1").email("pay@skydevx.com").build();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return parameter.hasParameterAnnotation(AuthenticationPrincipal.class)
                                && parameter.getParameterType().equals(User.class);
                    }

                    @Override
                    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                        return testUser;
                    }
                })
                .build();
    }

    @Test
    @DisplayName("POST /api/payment/create-order should return order details")
    void shouldCreatePaymentOrder() throws Exception {
        CreateOrderRequest request = CreateOrderRequest.builder().planType("PLUS").build();
        Payment payment = Payment.builder()
                .razorpayOrderId("order_xyz_789")
                .amount(49900)
                .currency("INR")
                .receipt("RG_REC_123")
                .planType("PLUS")
                .build();

        when(paymentService.createOrder(any(User.class), eq("PLUS"))).thenReturn(payment);

        mockMvc.perform(post("/api/payment/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value("order_xyz_789"))
                .andExpect(jsonPath("$.amount").value(49900))
                .andExpect(jsonPath("$.currency").value("INR"));
    }

    @Test
    @DisplayName("POST /api/payment/verify should return 200 on valid signature")
    void shouldVerifyValidPayment() throws Exception {
        VerifyPaymentRequest request = VerifyPaymentRequest.builder()
                .razorpayOrderId("order_xyz_789")
                .razorpayPaymentId("pay_abc_123")
                .razorpaySignature("valid_sig_123")
                .build();

        when(paymentService.verifyPayment("order_xyz_789", "pay_abc_123", "valid_sig_123")).thenReturn(true);

        mockMvc.perform(post("/api/payment/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("success"));
    }

    @Test
    @DisplayName("POST /api/payment/verify should accept both camelCase and snake_case JSON keys")
    void shouldAcceptCamelCasePaymentVerifyPayload() throws Exception {
        String camelCaseJson = """
            {
                "razorpayOrderId": "order_camel_123",
                "razorpayPaymentId": "pay_camel_456",
                "razorpaySignature": "sig_camel_789"
            }
            """;

        when(paymentService.verifyPayment("order_camel_123", "pay_camel_456", "sig_camel_789")).thenReturn(true);

        mockMvc.perform(post("/api/payment/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(camelCaseJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/payment/verify should return 400 on invalid signature")
    void shouldRejectInvalidPaymentSignature() throws Exception {
        VerifyPaymentRequest request = VerifyPaymentRequest.builder()
                .razorpayOrderId("order_xyz_789")
                .razorpayPaymentId("pay_abc_123")
                .razorpaySignature("forged_signature")
                .build();

        when(paymentService.verifyPayment("order_xyz_789", "pay_abc_123", "forged_signature")).thenReturn(false);

        mockMvc.perform(post("/api/payment/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
