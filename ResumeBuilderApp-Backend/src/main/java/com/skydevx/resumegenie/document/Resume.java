package com.skydevx.resumegenie.document;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "resumes")
public class Resume {

    @Id
    @JsonProperty("_id")
    private String id;

    @JsonProperty("id")
    public String getIdAlias() {
        return id;
    }

    @Indexed
    private String userId;

    private String title;

    private String thumbnailLink;

    @Builder.Default
    private Template template = new Template();

    @Builder.Default
    private ProfileInfo profileInfo = new ProfileInfo();

    @Builder.Default
    private ContactInfo contactInfo = new ContactInfo();

    @Builder.Default
    private List<WorkExperience> workExperience = new ArrayList<>();

    @Builder.Default
    private List<Education> education = new ArrayList<>();

    @Builder.Default
    private List<Skill> skills = new ArrayList<>();

    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @Builder.Default
    private List<Certification> certifications = new ArrayList<>();

    @Builder.Default
    private List<Language> languages = new ArrayList<>();

    @Builder.Default
    private List<String> interests = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Template {
        @Builder.Default
        private String templateId = "modern-01";
        @Builder.Default
        private String theme = "modern";
        @Builder.Default
        private List<String> colorPalette = List.of("#6366f1", "#4f46e5", "#1e1b4b");
        @Builder.Default
        private String font = "Inter";
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ProfileInfo {
        private String fullName;
        private String designation;
        private String summary;
        private String profilePreviewUrl;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ContactInfo {
        private String email;
        private String phone;
        private String location;
        private String linkedIn;
        private String github;
        private String website;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkExperience {
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private String description;
        private Boolean isCurrent;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Education {
        private String degree;
        private String institution;
        private String startDate;
        private String endDate;
        private String score;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Skill {
        private String name;
        private Integer progress; // 0 to 100
        private String level;    // Beginner, Intermediate, Expert
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Project {
        private String title;
        private String description;
        private String github;
        private String liveDemo;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Certification {
        private String title;
        private String issuer;
        private String year;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Language {
        private String name;
        private Integer progress; // 0 to 100
    }
}
