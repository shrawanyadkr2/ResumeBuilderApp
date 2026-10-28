package com.skydevx.resumegenie.controller;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.dto.ApiResponse;
import com.skydevx.resumegenie.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@Tag(name = "Resume Templates & Entitlements", description = "Endpoints for discovering resume templates and querying subscription entitlements")
public class TemplateController {

    private final PlanService planService;

    @GetMapping
    @Operation(summary = "Get the public catalog of all resume templates")
    public ResponseEntity<List<Map<String, Object>>> getAllTemplates() {
        return ResponseEntity.ok(planService.getAllTemplates());
    }

    @GetMapping("/entitlements")
    @Operation(summary = "Get user-specific plan restrictions and accessible templates")
    public ResponseEntity<Map<String, Object>> getPlanEntitlements(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(planService.getPlanEntitlements(user));
    }
}
