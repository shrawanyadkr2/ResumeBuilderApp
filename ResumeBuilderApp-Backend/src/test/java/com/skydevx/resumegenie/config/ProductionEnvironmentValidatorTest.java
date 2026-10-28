package com.skydevx.resumegenie.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ProductionEnvironmentValidatorTest {

    @Test
    @DisplayName("Should throw IllegalStateException if mandatory production secrets are missing")
    void shouldFailWhenProductionVariablesAreMissing() {
        MockEnvironment env = new MockEnvironment();
        ProductionEnvironmentValidator validator = new ProductionEnvironmentValidator(env);

        ReflectionTestUtils.setField(validator, "mongoUri", "");
        ReflectionTestUtils.setField(validator, "jwtSecret", "short");
        ReflectionTestUtils.setField(validator, "corsOrigins", "*");
        ReflectionTestUtils.setField(validator, "razorpayKeyId", "");
        ReflectionTestUtils.setField(validator, "razorpayKeySecret", "");

        assertThrows(IllegalStateException.class, validator::validateProductionEnvironment);
    }

    @Test
    @DisplayName("Should pass when all required production configurations are valid")
    void shouldPassWhenProductionVariablesAreConfigured() {
        MockEnvironment env = new MockEnvironment();
        ProductionEnvironmentValidator validator = new ProductionEnvironmentValidator(env);

        ReflectionTestUtils.setField(validator, "mongoUri", "mongodb+srv://user:pass@cluster0.net/resumegenie");
        ReflectionTestUtils.setField(validator, "jwtSecret", "aVeryStrongCryptographicProductionSecretKey64BytesLong1234567890!");
        ReflectionTestUtils.setField(validator, "corsOrigins", "https://resumegenie.app,https://admin.resumegenie.app");
        ReflectionTestUtils.setField(validator, "razorpayKeyId", "rzp_live_abc12345678");
        ReflectionTestUtils.setField(validator, "razorpayKeySecret", "liveSecretKey1234567890");

        assertDoesNotThrow(validator::validateProductionEnvironment);
    }
}
