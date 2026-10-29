package com.skydevx.resumegenie.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.skydevx.resumegenie.document.Resume;
import com.skydevx.resumegenie.document.User;
import com.skydevx.resumegenie.exception.ResourceNotFoundException;
import com.skydevx.resumegenie.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final Cloudinary cloudinary;
    private final AuthService authService;
    private final ResumeRepository resumeRepository;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final long MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

    public void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided for upload.");
        }

        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new IllegalArgumentException("Image file size exceeds the maximum permitted limit of 5MB.");
        }

        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        boolean isImageMime = contentType != null && (
                contentType.toLowerCase().startsWith("image/") ||
                contentType.equalsIgnoreCase("application/octet-stream")
        );
        boolean isImageExtension = originalName.endsWith(".jpg") ||
                originalName.endsWith(".jpeg") ||
                originalName.endsWith(".png") ||
                originalName.endsWith(".webp") ||
                originalName.endsWith(".heic");

        if (!isImageMime && !isImageExtension) {
            throw new IllegalArgumentException("Unsupported image format [" + contentType + "]. Only JPEG, PNG, and WebP are allowed.");
        }
    }

    public Map<String, String> uploadSingleImage(MultipartFile file, String folder) throws IOException {
        validateImageFile(file);

        if (cloudinary != null && cloudinary.config.cloudName != null && !cloudinary.config.cloudName.isBlank()) {
            try {
                Map<String, Object> uploadParams = ObjectUtils.asMap(
                        "folder", "resumegenie/" + (folder != null ? folder : "general"),
                        "resource_type", "image",
                        "overwrite", true
                );

                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
                String secureUrl = (String) uploadResult.get("secure_url");
                log.info("Cloudinary upload successful. Resource URL: {}", secureUrl);
                return Map.of("imageUrl", secureUrl);
            } catch (Exception e) {
                log.warn("Cloudinary upload failed ({}), falling back to direct base64 data URI storage.", e.getMessage());
            }
        }

        String mime = (file.getContentType() != null) ? file.getContentType() : "image/jpeg";
        String base64Url = "data:" + mime + ";base64," + java.util.Base64.getEncoder().encodeToString(file.getBytes());
        log.info("Direct Base64 image encoded successfully (size: {} bytes)", file.getSize());
        return Map.of("imageUrl", base64Url);
    }

    public Map<String, String> uploadResumeImages(String resumeId,
                                                  User user,
                                                  MultipartFile thumbnail,
                                                  MultipartFile profileImage) throws IOException {
        Resume resume = resumeRepository.findByUserIdAndId(user.getId(), resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + resumeId));

        Map<String, String> result = new HashMap<>();

        if (thumbnail != null && !thumbnail.isEmpty()) {
            Map<String, String> thumbUpload = uploadSingleImage(thumbnail, "thumbnails");
            resume.setThumbnailLink(thumbUpload.get("imageUrl"));
            result.put("thumbnailLink", thumbUpload.get("imageUrl"));
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            Map<String, String> profUpload = uploadSingleImage(profileImage, "avatars");
            if (resume.getProfileInfo() == null) {
                resume.setProfileInfo(new Resume.ProfileInfo());
            }
            resume.getProfileInfo().setProfilePreviewUrl(profUpload.get("imageUrl"));
            result.put("profilePreviewUrl", profUpload.get("imageUrl"));
        }

        resumeRepository.save(resume);
        result.put("message", "Images uploaded and attached to resume successfully.");
        return result;
    }

    public String uploadDataUriToCloudinary(String dataUri, String folder) {
        if (dataUri == null || !dataUri.startsWith("data:")) {
            return dataUri;
        }
        if (cloudinary != null && cloudinary.config.cloudName != null && !cloudinary.config.cloudName.isBlank()) {
            try {
                Map<String, Object> uploadParams = ObjectUtils.asMap(
                        "folder", "resumegenie/" + (folder != null ? folder : "users"),
                        "resource_type", "image",
                        "overwrite", true
                );
                Map<?, ?> uploadResult = cloudinary.uploader().upload(dataUri, uploadParams);
                String secureUrl = (String) uploadResult.get("secure_url");
                log.info("Cloudinary upload from Data URI successful. Resource URL: {}", secureUrl);
                return secureUrl;
            } catch (Exception e) {
                log.warn("Cloudinary upload from Data URI failed ({}), keeping fallback URI.", e.getMessage());
            }
        }
        return dataUri;
    }

    public Map<String, String> uploadUserProfileImage(User user, MultipartFile file) throws IOException {
        Map<String, String> uploadResult = uploadSingleImage(file, "users");
        String imageUrl = uploadResult.get("imageUrl");
        authService.updateProfileImage(user, imageUrl);
        return Map.of("imageUrl", imageUrl, "message", "User profile photo updated successfully.");
    }
}
