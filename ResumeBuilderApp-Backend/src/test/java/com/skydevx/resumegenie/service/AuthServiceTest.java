package com.skydevx.resumegenie.service;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.AuthResponse;
import com.skydevx.resumegenie.dto.LoginRequest;
import com.skydevx.resumegenie.dto.RegisterRequest;
import com.skydevx.resumegenie.exception.ResourceExistsException;
import com.skydevx.resumegenie.repository.UserRepository;
import com.skydevx.resumegenie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "appBaseUrl", "http://localhost:8081");
        ReflectionTestUtils.setField(authService, "emailVerificationRequired", true);
    }

    @Test
    @DisplayName("Registration should hash password, generate token, and save user")
    void shouldRegisterNewUserSuccessfully() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Alex Hunter")
                .email("alex@skydevx.com")
                .password("SecretPass123")
                .build();

        when(userRepository.existsByEmail("alex@skydevx.com")).thenReturn(false);
        when(passwordEncoder.encode("SecretPass123")).thenReturn("$2a$12$hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId("user_alex_123");
            return u;
        });
        when(jwtUtil.generateToken("user_alex_123")).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("alex@skydevx.com", response.getEmail());
        assertEquals("Alex Hunter", response.getName());
        assertEquals("mocked.jwt.token", response.getToken());
        assertTrue(response.isEmailVerified());

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Registration with existing email should throw ResourceExistsException")
    void shouldRejectDuplicateEmailOnRegistration() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Alex Hunter")
                .email("existing@skydevx.com")
                .password("SecretPass123")
                .build();

        when(userRepository.existsByEmail("existing@skydevx.com")).thenReturn(true);

        assertThrows(ResourceExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login should authenticate with valid password and return JWT")
    void shouldLoginSuccessfullyWithValidCredentials() {
        LoginRequest request = LoginRequest.builder()
                .email("alex@skydevx.com")
                .password("SecretPass123")
                .build();

        User existingUser = User.builder()
                .id("user_alex_123")
                .name("Alex Hunter")
                .email("alex@skydevx.com")
                .password("$2a$12$hashedPassword")
                .subscriptionPlan("FREE")
                .build();

        when(userRepository.findByEmail("alex@skydevx.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("SecretPass123", "$2a$12$hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("user_alex_123")).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("Alex Hunter", response.getName());
    }

    @Test
    @DisplayName("Login with invalid password should throw BadCredentialsException")
    void shouldRejectLoginWithInvalidPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("alex@skydevx.com")
                .password("WrongPassword")
                .build();

        User existingUser = User.builder()
                .id("user_alex_123")
                .email("alex@skydevx.com")
                .password("$2a$12$hashedPassword")
                .build();

        when(userRepository.findByEmail("alex@skydevx.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("WrongPassword", "$2a$12$hashedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
