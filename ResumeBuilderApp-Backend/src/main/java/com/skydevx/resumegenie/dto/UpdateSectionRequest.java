package com.skydevx.resumegenie.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSectionRequest {

    @NotBlank(message = "Section name is required (e.g., profileInfo, contactInfo, workExperience, education, skills, projects, template)")
    private String section;

    @NotNull(message = "Data payload is required")
    private JsonNode data;
}
