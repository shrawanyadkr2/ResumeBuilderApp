package com.skydevx.resumegenie.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @JsonAlias({"fullName", "fullname", "userName", "username"})
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 128, message = "Password must be at least 6 characters long")
    private String password;

    private String profileImageUrl;

    public void setFullName(String fullName) {
        if (fullName != null && !fullName.isBlank()) {
            this.name = fullName;
        }
    }

    public String getFullName() {
        return this.name;
    }
}
