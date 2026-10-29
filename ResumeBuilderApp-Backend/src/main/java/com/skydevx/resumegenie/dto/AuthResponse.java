package com.skydevx.resumegenie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String id;
    private String name;
    private String email;
    private String profileImageUrl;
    private String subscriptionPlan;
    private boolean emailVerified;

    @JsonProperty("emailVarified")
    public boolean isEmailVarified() {
        return emailVerified;
    }

    private String token;
    private String verificationCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
