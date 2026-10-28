package com.skydevx.resumegenie.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String secret = "mySuperSecureTestSecretKeyAtLeast32BytesLong1234567890!";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 3600000L); // 1 hour
    }

    @Test
    @DisplayName("Should generate valid JWT token with user ID subject")
    void shouldGenerateValidToken() {
        String userId = "user123_test";
        String token = jwtUtil.generateToken(userId);

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals(userId, jwtUtil.getUserIdFromToken(token));
        assertFalse(jwtUtil.isTokenExpired(token));
    }

    @Test
    @DisplayName("Should reject malformed or tampered token")
    void shouldRejectMalformedToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidPayload.signature";
        assertFalse(jwtUtil.validateToken(invalidToken));
        assertNull(jwtUtil.getUserIdFromToken(invalidToken));
    }

    @Test
    @DisplayName("Should identify expired token correctly")
    void shouldIdentifyExpiredToken() {
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", -1000L); // Negative expiry
        String expiredToken = jwtUtil.generateToken("user_expired");

        assertFalse(jwtUtil.validateToken(expiredToken));
        assertTrue(jwtUtil.isTokenExpired(expiredToken));
    }
}
