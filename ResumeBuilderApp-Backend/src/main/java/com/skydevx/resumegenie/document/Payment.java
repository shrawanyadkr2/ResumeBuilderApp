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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "payments")
public class Payment {

    @Id
    @JsonProperty("_id")
    private String id;

    @JsonProperty("id")
    public String getIdAlias() {
        return id;
    }

    @Indexed
    private String userId;

    @Indexed
    private String razorpayOrderId;

    @Indexed
    private String razorpayPaymentId;

    private String razorpaySignature;

    private Integer amount; // Amount in paise (e.g. 49900 = INR 499.00)

    @Builder.Default
    private String currency = "INR";

    @Builder.Default
    private String planType = "PLUS"; // PLUS or PREMIUM

    @Builder.Default
    private String status = "created"; // created, paid, failed

    private String receipt;

    private String failureReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
