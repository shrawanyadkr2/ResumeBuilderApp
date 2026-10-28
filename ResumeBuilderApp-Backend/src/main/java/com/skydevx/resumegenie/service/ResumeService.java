package com.skydevx.resumegenie.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skydevx.resumegenie.document.Resume;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.CreateResumeRequest;
import com.skydevx.resumegenie.dto.UpdateSectionRequest;
import com.skydevx.resumegenie.exception.ResourceNotFoundException;
import com.skydevx.resumegenie.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final PlanService planService;
    private final ObjectMapper objectMapper;

    public Resume createResume(CreateResumeRequest request, User user) {
        log.info("Creating resume titled [{}] for user [{}]", request.getTitle(), user.getId());

        long count = resumeRepository.countByUserId(user.getId());
        planService.assertCanCreateResume(user, count);

        Resume newResume = Resume.builder()
                .userId(user.getId())
                .title(request.getTitle().trim())
                .template(new Resume.Template())
                .profileInfo(new Resume.ProfileInfo())
                .contactInfo(new Resume.ContactInfo())
                .workExperience(new ArrayList<>())
                .education(new ArrayList<>())
                .skills(new ArrayList<>())
                .projects(new ArrayList<>())
                .certifications(new ArrayList<>())
                .languages(new ArrayList<>())
                .interests(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return resumeRepository.save(newResume);
    }

    public List<Resume> getUserResumes(User user) {
        return resumeRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
    }

    public Resume getResumeById(String id, User user) {
        return resumeRepository.findByUserIdAndId(user.getId(), id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));
    }

    public Resume updateResume(String id, Resume updatedData, User user) {
        Resume existing = getResumeById(id, user);

        if (updatedData.getTemplate() != null && updatedData.getTemplate().getTemplateId() != null) {
            planService.assertCanUseTemplate(user, updatedData.getTemplate().getTemplateId());
            existing.setTemplate(updatedData.getTemplate());
        }

        if (updatedData.getTitle() != null && !updatedData.getTitle().isBlank()) {
            existing.setTitle(updatedData.getTitle());
        }

        if (updatedData.getThumbnailLink() != null) {
            existing.setThumbnailLink(updatedData.getThumbnailLink());
        }

        if (updatedData.getProfileInfo() != null) {
            existing.setProfileInfo(updatedData.getProfileInfo());
        }

        if (updatedData.getContactInfo() != null) {
            existing.setContactInfo(updatedData.getContactInfo());
        }

        if (updatedData.getWorkExperience() != null) {
            existing.setWorkExperience(updatedData.getWorkExperience());
        }

        if (updatedData.getEducation() != null) {
            existing.setEducation(updatedData.getEducation());
        }

        if (updatedData.getSkills() != null) {
            existing.setSkills(updatedData.getSkills());
        }

        if (updatedData.getProjects() != null) {
            existing.setProjects(updatedData.getProjects());
        }

        if (updatedData.getCertifications() != null) {
            existing.setCertifications(updatedData.getCertifications());
        }

        if (updatedData.getLanguages() != null) {
            existing.setLanguages(updatedData.getLanguages());
        }

        if (updatedData.getInterests() != null) {
            existing.setInterests(updatedData.getInterests());
        }

        existing.setUpdatedAt(LocalDateTime.now());
        return resumeRepository.save(existing);
    }

    public Resume updateResumeSection(String id, UpdateSectionRequest request, User user) {
        Resume existing = getResumeById(id, user);
        String section = request.getSection().toLowerCase().trim();

        try {
            switch (section) {
                case "profileinfo", "personalinfo" -> existing.setProfileInfo(
                        objectMapper.treeToValue(request.getData(), Resume.ProfileInfo.class));
                case "contactinfo" -> existing.setContactInfo(
                        objectMapper.treeToValue(request.getData(), Resume.ContactInfo.class));
                case "workexperience" -> existing.setWorkExperience(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<Resume.WorkExperience>>() {}));
                case "education" -> existing.setEducation(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<Resume.Education>>() {}));
                case "skills" -> existing.setSkills(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<Resume.Skill>>() {}));
                case "projects" -> existing.setProjects(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<Resume.Project>>() {}));
                case "certifications" -> existing.setCertifications(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<Resume.Certification>>() {}));
                case "languages" -> existing.setLanguages(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<Resume.Language>>() {}));
                case "interests" -> existing.setInterests(
                        objectMapper.readValue(request.getData().traverse(), new TypeReference<List<String>>() {}));
                case "template" -> {
                    Resume.Template tmpl = objectMapper.treeToValue(request.getData(), Resume.Template.class);
                    if (tmpl != null && tmpl.getTemplateId() != null) {
                        planService.assertCanUseTemplate(user, tmpl.getTemplateId());
                    }
                    existing.setTemplate(tmpl);
                }
                default -> throw new IllegalArgumentException("Unknown resume section: " + request.getSection());
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to parse section [{}] data", section, e);
            throw new IllegalArgumentException("Invalid data payload format for section: " + request.getSection());
        }

        existing.setUpdatedAt(LocalDateTime.now());
        return resumeRepository.save(existing);
    }

    public void deleteResume(String id, User user) {
        Resume existing = getResumeById(id, user);
        resumeRepository.delete(existing);
        log.info("Deleted resume [{}] for user [{}]", id, user.getId());
    }
}
