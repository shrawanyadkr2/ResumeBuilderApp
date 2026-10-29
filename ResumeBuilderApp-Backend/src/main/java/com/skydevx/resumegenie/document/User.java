package com.skydevx.resumegenie.document;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    @JsonProperty("_id")
    private String id;

    @JsonProperty("id")
    public String getIdAlias() {
        return id;
    }

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String profileImageUrl;

    @Builder.Default
    private String subscriptionPlan = "FREE"; // FREE or PLUS

    @Builder.Default
    private boolean emailVerified = true;

    private String verificationToken;

    private LocalDateTime verificationExpires;

    @Indexed
    private String passwordResetToken;

    private LocalDateTime passwordResetExpires;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
