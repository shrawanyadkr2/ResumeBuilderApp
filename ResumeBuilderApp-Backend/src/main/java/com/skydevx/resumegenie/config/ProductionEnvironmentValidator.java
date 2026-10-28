package com.skydevx.resumegenie.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import java.util.ArrayList;
import java.util.List;

/**
 * Validates mandatory production environment variables on application startup.
 * Prevents application from starting in production with missing or fallback credentials.
 */
@Configuration
@Profile("prod")
@Slf4j
public class ProductionEnvironmentValidator {

    private final Environment environment;

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @Value("${app.cors.allowed-origins:}")
    private String corsOrigins;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:}")
    private String razorpayKeySecret;

    public ProductionEnvironmentValidator(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void validateProductionEnvironment() {
        log.info("[PROD-VALIDATOR] Running mandatory production environment checks...");

        List<String> missingConfigs = new ArrayList<>();

        if (mongoUri == null || mongoUri.isBlank() || mongoUri.contains("localhost") || mongoUri.contains("127.0.0.1")) {
            missingConfigs.add("MONGODB_URI (must point to a production MongoDB Atlas or replica cluster, not localhost)");
        }

        if (jwtSecret == null || jwtSecret.isBlank() || jwtSecret.contains("devDefaultSecretKey") || jwtSecret.length() < 32) {
            missingConfigs.add("JWT_SECRET (must be configured with a cryptographically strong secret at least 32 characters long)");
        }

        if (corsOrigins == null || corsOrigins.isBlank() || corsOrigins.contains("*")) {
            missingConfigs.add("CORS_ALLOWED_ORIGINS (must specify explicit frontend origin(s); wildcards '*' are prohibited with credentials in production)");
        }

        if (razorpayKeyId == null || razorpayKeyId.isBlank()) {
            missingConfigs.add("RAZORPAY_KEY_ID (required for payment processing)");
        }

        if (razorpayKeySecret == null || razorpayKeySecret.isBlank()) {
            missingConfigs.add("RAZORPAY_KEY_SECRET (required for payment processing)");
        }

        if (!missingConfigs.isEmpty()) {
            String errorMessage = "PRODUCTION CONFIGURATION FAILURE: The application cannot start in 'prod' profile because required settings are missing or invalid:\n - "
                    + String.join("\n - ", missingConfigs);
            log.error(errorMessage);
            throw new IllegalStateException(errorMessage);
        }

        log.info("[PROD-VALIDATOR] All mandatory production environment configurations validated successfully.");
    }
}
