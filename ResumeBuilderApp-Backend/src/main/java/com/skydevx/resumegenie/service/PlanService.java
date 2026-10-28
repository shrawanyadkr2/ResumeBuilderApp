package com.skydevx.resumegenie.service;

import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.exception.PlanLimitExceededException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Centralized service managing Free and Plus subscription plan entitlements.
 * Guarantees server-side enforcement of limits and template access.
 */
@Service
public class PlanService {

    public static final String PLAN_FREE = "FREE";
    public static final String PLAN_PLUS = "PLUS";

    @Value("${app.entitlements.free.max-resumes:3}")
    private int freeMaxResumes;

    @Value("${app.entitlements.plus.max-resumes:100}")
    private int plusMaxResumes;

    private static final List<Map<String, Object>> TEMPLATE_CATALOG = List.of(
            Map.of(
                    "id", "modern-01",
                    "name", "Modern Clean",
                    "category", "Standard",
                    "description", "Clean and modern single/multi-column layout with bold accents.",
                    "premium", false,
                    "thumbnailUrl", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80"
            ),
            Map.of(
                    "id", "minimal-02",
                    "name", "Minimalist Classic",
                    "category", "Standard",
                    "description", "Simple typography-focused design suitable for all corporate roles.",
                    "premium", false,
                    "thumbnailUrl", "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80"
            ),
            Map.of(
                    "id", "executive-03",
                    "name", "Executive Elite",
                    "category", "Premium",
                    "description", "Sophisticated two-column executive format with elegant headers.",
                    "premium", true,
                    "thumbnailUrl", "https://images.unsplash.com/photo-1586282375594-55c3c0a13346?w=400&q=80"
            ),
            Map.of(
                    "id", "creative-04",
                    "name", "Creative Portfolio",
                    "category", "Premium",
                    "description", "Dynamic visual structure with visual skill meters and project cards.",
                    "premium", true,
                    "thumbnailUrl", "https://images.unsplash.com/photo-1586282375618-971778945654?w=400&q=80"
            ),
            Map.of(
                    "id", "tech-05",
                    "name", "Tech Architect",
                    "category", "Premium",
                    "description", "Developer-optimized layout prioritizing GitHub repos, stack tags, and contributions.",
                    "premium", true,
                    "thumbnailUrl", "https://images.unsplash.com/photo-1586282375662-811c75b871c8?w=400&q=80"
            )
    );

    public boolean isPlusUser(User user) {
        if (user == null || user.getSubscriptionPlan() == null) {
            return false;
        }
        String plan = user.getSubscriptionPlan().toUpperCase();
        return PLAN_PLUS.equals(plan) || "PREMIUM".equals(plan);
    }

    public void assertCanCreateResume(User user, long currentCount) {
        boolean isPlus = isPlusUser(user);
        int maxAllowed = isPlus ? plusMaxResumes : freeMaxResumes;

        if (currentCount >= maxAllowed) {
            String planName = isPlus ? "Plus" : "Free";
            throw new PlanLimitExceededException(
                    "Your " + planName + " plan limit of " + maxAllowed + " resume(s) has been reached. " +
                            (isPlus ? "Please contact support for enterprise limits." : "Upgrade to Resume Genie Plus to create up to 100 resumes and access premium templates.")
            );
        }
    }

    public void assertCanUseTemplate(User user, String templateId) {
        if (templateId == null || templateId.isBlank()) {
            return;
        }

        boolean isPlus = isPlusUser(user);
        if (isPlus) {
            return; // Plus users can use all templates
        }

        // Check if template is premium
        boolean isPremiumTemplate = TEMPLATE_CATALOG.stream()
                .filter(t -> templateId.equalsIgnoreCase((String) t.get("id")))
                .findFirst()
                .map(t -> Boolean.TRUE.equals(t.get("premium")))
                .orElse(false);

        if (isPremiumTemplate) {
            throw new PlanLimitExceededException(
                    "Template '" + templateId + "' requires a Resume Genie Plus subscription. Please upgrade to unlock premium templates."
            );
        }
    }

    public Map<String, Object> getPlanEntitlements(User user) {
        boolean isPlus = isPlusUser(user);
        List<String> accessibleTemplateIds = TEMPLATE_CATALOG.stream()
                .filter(t -> isPlus || !Boolean.TRUE.equals(t.get("premium")))
                .map(t -> (String) t.get("id"))
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("subscriptionPlan", isPlus ? PLAN_PLUS : PLAN_FREE);
        result.put("isPlus", isPlus);
        result.put("isPremium", isPlus);
        result.put("maxResumes", isPlus ? plusMaxResumes : freeMaxResumes);
        result.put("watermarkEnabled", !isPlus);
        result.put("priorityExport", isPlus);
        result.put("accessibleTemplates", accessibleTemplateIds);
        result.put("allTemplates", TEMPLATE_CATALOG);
        return result;
    }

    public List<Map<String, Object>> getAllTemplates() {
        return TEMPLATE_CATALOG;
    }
}
