package com.skydevx.resumegenie.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skydevx.resumegenie.document.Resume;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.CreateResumeRequest;
import com.skydevx.resumegenie.exception.ResourceNotFoundException;
import com.skydevx.resumegenie.repository.ResumeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private PlanService planService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ResumeService resumeService;

    @Test
    @DisplayName("Create resume should enforce plan limit and initialize default sections")
    void shouldCreateResumeSuccessfully() {
        User user = User.builder().id("user_test_1").name("Robin").build();
        CreateResumeRequest request = CreateResumeRequest.builder().title("Software Engineer Resume").build();

        when(resumeRepository.countByUserId("user_test_1")).thenReturn(1L);
        doNothing().when(planService).assertCanCreateResume(user, 1L);
        when(resumeRepository.save(any(Resume.class))).thenAnswer(invocation -> {
            Resume r = invocation.getArgument(0);
            r.setId("resume_abc_123");
            return r;
        });

        Resume created = resumeService.createResume(request, user);

        assertNotNull(created);
        assertEquals("resume_abc_123", created.getId());
        assertEquals("Software Engineer Resume", created.getTitle());
        assertEquals("user_test_1", created.getUserId());
        assertNotNull(created.getProfileInfo());
        assertNotNull(created.getContactInfo());
        assertNotNull(created.getWorkExperience());
        assertNotNull(created.getTemplate());

        verify(planService).assertCanCreateResume(user, 1L);
        verify(resumeRepository).save(any(Resume.class));
    }

    @Test
    @DisplayName("Get resume by ID should enforce strict user ownership")
    void shouldEnforceUserOwnershipOnGetResume() {
        User owner = User.builder().id("owner_id").build();
        User intruder = User.builder().id("intruder_id").build();

        Resume resume = Resume.builder().id("resume_1").userId("owner_id").title("Owner's Resume").build();

        when(resumeRepository.findByUserIdAndId("owner_id", "resume_1")).thenReturn(Optional.of(resume));
        when(resumeRepository.findByUserIdAndId("intruder_id", "resume_1")).thenReturn(Optional.empty());

        // Owner gets the resume
        Resume fetched = resumeService.getResumeById("resume_1", owner);
        assertEquals("resume_1", fetched.getId());

        // Intruder gets 404 ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> resumeService.getResumeById("resume_1", intruder));
    }

    @Test
    @DisplayName("Delete resume should fail if user does not own it")
    void shouldFailDeleteIfUserDoesNotOwn() {
        User intruder = User.builder().id("intruder_id").build();
        when(resumeRepository.findByUserIdAndId("intruder_id", "resume_99")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> resumeService.deleteResume("resume_99", intruder));
        verify(resumeRepository, never()).delete(any());
    }
}
