package com.skydevx.resumegenie.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.skydevx.resumegenie.repository.ResumeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileUploadServiceTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @Mock
    private AuthService authService;

    @Mock
    private ResumeRepository resumeRepository;

    @InjectMocks
    private FileUploadService fileUploadService;

    @BeforeEach
    void setUp() {
        lenient().when(cloudinary.uploader()).thenReturn(uploader);
    }

    @Test
    @DisplayName("Should reject disallowed file types like executables or shell scripts")
    void shouldRejectDisallowedFileTypes() {
        MockMultipartFile executableFile = new MockMultipartFile(
                "file", "malicious.exe", "application/x-msdownload", "fake binary".getBytes());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> fileUploadService.validateImageFile(executableFile));
        assertTrue(ex.getMessage().contains("Unsupported image format"));
    }

    @Test
    @DisplayName("Should reject files exceeding 5MB size limit")
    void shouldRejectOversizedFiles() {
        byte[] oversizedBytes = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile largeFile = new MockMultipartFile(
                "file", "large.png", "image/png", oversizedBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> fileUploadService.validateImageFile(largeFile));
        assertTrue(ex.getMessage().contains("exceeds the maximum permitted limit of 5MB"));
    }

    @Test
    @DisplayName("Should accept and upload valid PNG image")
    void shouldUploadValidImage() throws IOException {
        MockMultipartFile validPng = new MockMultipartFile(
                "file", "avatar.png", "image/png", "fake png data".getBytes());

        when(uploader.upload(any(byte[].class), anyMap()))
                .thenReturn(Map.of("secure_url", "https://res.cloudinary.com/test/image/upload/v1/avatar.png"));

        Map<String, String> result = fileUploadService.uploadSingleImage(validPng, "avatars");

        assertNotNull(result);
        assertEquals("https://res.cloudinary.com/test/image/upload/v1/avatar.png", result.get("imageUrl"));
    }
}
