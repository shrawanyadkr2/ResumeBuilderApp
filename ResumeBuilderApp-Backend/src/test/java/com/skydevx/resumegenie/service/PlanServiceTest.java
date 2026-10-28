package com.skydevx.resumegenie.service;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.exception.PlanLimitExceededException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class PlanServiceTest {

    private PlanService planService;

    @BeforeEach
    void setUp() {
        planService = new PlanService();
        ReflectionTestUtils.setField(planService, "freeMaxResumes", 3);
        ReflectionTestUtils.setField(planService, "plusMaxResumes", 100);
    }

    @Test
    @DisplayName("Free user should be permitted up to 3 resumes, and blocked on 4th")
    void shouldEnforceFreeUserResumeLimits() {
        User freeUser = User.builder().id("freeUser").subscriptionPlan("FREE").build();

        // 0, 1, 2 should succeed
        assertDoesNotThrow(() -> planService.assertCanCreateResume(freeUser, 0));
        assertDoesNotThrow(() -> planService.assertCanCreateResume(freeUser, 2));

        // 3rd already exists -> attempting to create 4th should throw PlanLimitExceededException
        PlanLimitExceededException ex = assertThrows(PlanLimitExceededException.class,
                () -> planService.assertCanCreateResume(freeUser, 3));
        assertTrue(ex.getMessage().contains("Free plan limit of 3"));
    }

    @Test
    @DisplayName("Plus user should be allowed more than 3 resumes")
    void shouldAllowPlusUserHigherLimits() {
        User plusUser = User.builder().id("plusUser").subscriptionPlan("PLUS").build();

        assertDoesNotThrow(() -> planService.assertCanCreateResume(plusUser, 10));
        assertDoesNotThrow(() -> planService.assertCanCreateResume(plusUser, 50));
    }

    @Test
    @DisplayName("Free user should not be allowed to use premium template executive-03")
    void shouldBlockFreeUserFromPremiumTemplates() {
        User freeUser = User.builder().id("freeUser").subscriptionPlan("FREE").build();

        // Allowed standard template
        assertDoesNotThrow(() -> planService.assertCanUseTemplate(freeUser, "modern-01"));

        // Blocked premium template
        PlanLimitExceededException ex = assertThrows(PlanLimitExceededException.class,
                () -> planService.assertCanUseTemplate(freeUser, "executive-03"));
        assertTrue(ex.getMessage().contains("requires a Resume Genie Plus subscription"));
    }

    @Test
    @DisplayName("Plus user should be allowed all premium templates")
    void shouldAllowPlusUserAllTemplates() {
        User plusUser = User.builder().id("plusUser").subscriptionPlan("PLUS").build();

        assertDoesNotThrow(() -> planService.assertCanUseTemplate(plusUser, "executive-03"));
        assertDoesNotThrow(() -> planService.assertCanUseTemplate(plusUser, "tech-05"));
    }

    @Test
    @DisplayName("Plan entitlements summary should correctly reflect watermark rules")
    void shouldReflectCorrectEntitlementsSummary() {
        User freeUser = User.builder().id("freeUser").subscriptionPlan("FREE").build();
        Map<String, Object> freeEntitlements = planService.getPlanEntitlements(freeUser);
        assertEquals(true, freeEntitlements.get("watermarkEnabled"));
        assertEquals(false, freeEntitlements.get("isPlus"));

        User plusUser = User.builder().id("plusUser").subscriptionPlan("PLUS").build();
        Map<String, Object> plusEntitlements = planService.getPlanEntitlements(plusUser);
        assertEquals(false, plusEntitlements.get("watermarkEnabled"));
        assertEquals(true, plusEntitlements.get("isPlus"));
    }
}
