package com.skydevx.resumegenie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skydevx.resumegenie.document.Resume;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.CreateResumeRequest;
import com.skydevx.resumegenie.exception.GlobalExceptionHandler;
import com.skydevx.resumegenie.service.FileUploadService;
import com.skydevx.resumegenie.service.ResumeService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ResumeControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private ResumeService resumeService;

    @Mock
    private FileUploadService fileUploadService;

    @InjectMocks
    private ResumeController resumeController;

    private final User testUser = User.builder().id("user_100").name("John Doe").email("john@skydevx.com").build();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resumeController)
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
    @DisplayName("POST /api/resumes should create a resume and return 201")
    void shouldCreateResume() throws Exception {
        CreateResumeRequest request = CreateResumeRequest.builder().title("Frontend Dev Resume").build();
        Resume resume = Resume.builder()
                .id("resume_555")
                .title("Frontend Dev Resume")
                .userId(testUser.getId())
                .build();

        when(resumeService.createResume(any(CreateResumeRequest.class), any(User.class))).thenReturn(resume);

        mockMvc.perform(post("/api/resumes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("resume_555"))
                .andExpect(jsonPath("$.title").value("Frontend Dev Resume"));
    }

    @Test
    @DisplayName("GET /api/resumes should return user resumes list")
    void shouldReturnUserResumes() throws Exception {
        Resume resume1 = Resume.builder().id("r1").title("Resume 1").userId(testUser.getId()).build();
        Resume resume2 = Resume.builder().id("r2").title("Resume 2").userId(testUser.getId()).build();

        when(resumeService.getUserResumes(any(User.class))).thenReturn(List.of(resume1, resume2));

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("r1"))
                .andExpect(jsonPath("$[1].id").value("r2"));
    }
}
