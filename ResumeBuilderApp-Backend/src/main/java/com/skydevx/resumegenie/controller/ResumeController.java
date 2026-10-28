package com.skydevx.resumegenie.controller;

import com.skydevx.resumegenie.document.Resume;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.ApiResponse;
import com.skydevx.resumegenie.dto.CreateResumeRequest;
import com.skydevx.resumegenie.dto.UpdateSectionRequest;
import com.skydevx.resumegenie.service.FileUploadService;
import com.skydevx.resumegenie.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Resume Management", description = "Endpoints for creating, updating, querying, and deleting resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final FileUploadService fileUploadService;

    @PostMapping
    @Operation(summary = "Create a new resume")
    public ResponseEntity<Resume> createResume(
            @Valid @RequestBody CreateResumeRequest request,
            @AuthenticationPrincipal User user) {

        Resume newResume = resumeService.createResume(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
    }

    @GetMapping
    @Operation(summary = "Get all resumes for the authenticated user")
    public ResponseEntity<List<Resume>> getUserResumes(@AuthenticationPrincipal User user) {
        List<Resume> resumes = resumeService.getUserResumes(user);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a resume by ID")
    public ResponseEntity<Resume> getResumeById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal User user) {

        Resume resume = resumeService.getResumeById(id, user);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an entire resume")
    public ResponseEntity<Resume> updateResume(
            @PathVariable("id") String id,
            @RequestBody Resume updatedData,
            @AuthenticationPrincipal User user) {

        Resume updated = resumeService.updateResume(id, updatedData, user);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/section")
    @Operation(summary = "Update a specific section of a resume (profileInfo, contactInfo, workExperience, education, skills, projects, template)")
    public ResponseEntity<Resume> updateResumeSection(
            @PathVariable("id") String id,
            @Valid @RequestBody UpdateSectionRequest request,
            @AuthenticationPrincipal User user) {

        Resume updated = resumeService.updateResumeSection(id, request, user);
        return ResponseEntity.ok(updated);
    }

    @PostMapping(value = "/{id}/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload thumbnail and profile image for a resume")
    public ResponseEntity<Map<String, String>> uploadResumeImages(
            @PathVariable("id") String id,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @AuthenticationPrincipal User user) throws IOException {

        Map<String, String> result = fileUploadService.uploadResumeImages(id, user, thumbnail, profileImage);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resume by ID")
    public ResponseEntity<Map<String, String>> deleteResume(
            @PathVariable("id") String id,
            @AuthenticationPrincipal User user) {

        resumeService.deleteResume(id, user);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }
}
