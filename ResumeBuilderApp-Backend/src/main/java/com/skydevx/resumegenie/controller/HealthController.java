package com.skydevx.resumegenie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.Status;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Health & System Status", description = "Endpoints for monitoring server health and readiness checks")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @Value("${app.branding:sky.devX}")
    private String branding;

    @Value("${app.name:Resume Genie}")
    private String appName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${spring.data.mongodb.database:resumegenie}")
    private String databaseName;

    @GetMapping
    @Operation(summary = "Check backend service and database health status")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", appName);
        health.put("organization", branding);
        health.put("profile", activeProfile);
        health.put("version", "1.0.0");
        health.put("database", databaseName);
        health.put("timestamp", LocalDateTime.now());
        health.put("uptimeMs", ManagementFactory.getRuntimeMXBean().getUptime());

        // Probe MongoDB safely without leaking credentials
        try {
            boolean mongoConnected = mongoTemplate.getDb() != null;
            health.put("databaseStatus", mongoConnected ? "CONNECTED" : "DISCONNECTED");
        } catch (Exception e) {
            health.put("databaseStatus", "UNREACHABLE");
        }

        return ResponseEntity.ok(health);
    }
}
