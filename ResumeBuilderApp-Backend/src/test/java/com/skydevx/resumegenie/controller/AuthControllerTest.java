package com.skydevx.resumegenie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skydevx.resumegenie.dto.AuthResponse;
import com.skydevx.resumegenie.dto.LoginRequest;
import com.skydevx.resumegenie.dto.RegisterRequest;
import com.skydevx.resumegenie.exception.GlobalExceptionHandler;
import com.skydevx.resumegenie.service.AuthService;
import com.skydevx.resumegenie.service.FileUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AuthService authService;

    @Mock
    private FileUploadService fileUploadService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/register should return 201 on valid input")
    void shouldRegisterUser() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("Taylor Swift")
                .email("taylor@skydevx.com")
                .password("Password123")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .id("u_101")
                .name("Taylor Swift")
                .email("taylor@skydevx.com")
                .token("sample.jwt.token")
                .subscriptionPlan("FREE")
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("taylor@skydevx.com"))
                .andExpect(jsonPath("$.data.token").value("sample.jwt.token"));
    }

    @Test
    @DisplayName("POST /api/auth/register should return 400 when validation fails")
    void shouldRejectInvalidRegistrationPayload() throws Exception {
        RegisterRequest invalid = RegisterRequest.builder()
                .name("")
                .email("not-an-email")
                .password("123") // too short
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    @DisplayName("POST /api/auth/register should accept 'fullName' as alias for 'name'")
    void shouldAcceptFullNameAlias() throws Exception {
        String payload = "{\"fullName\":\"Shrawan kumar yadav\",\"email\":\"shrawan29yadav@gmail.com\",\"password\":\"Secret123\"}";

        AuthResponse authResponse = AuthResponse.builder()
                .id("u_102")
                .name("Shrawan kumar yadav")
                .email("shrawan29yadav@gmail.com")
                .token("sample.jwt.token")
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/auth/login should return 200 on valid credentials")
    void shouldLoginUser() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("taylor@skydevx.com")
                .password("Password123")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .id("u_101")
                .name("Taylor Swift")
                .email("taylor@skydevx.com")
                .token("login.jwt.token")
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("login.jwt.token"));
    }
}
