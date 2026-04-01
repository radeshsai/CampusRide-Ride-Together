package com.campusride.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class UserDto {
    @Data
    public static class UserProfileResponse {
        private Long id;
        private String name, email, phoneNumber, profilePicture, role, collegeName, studentId;
        private LocalDateTime createdAt;
    }
    @Data
    public static class UpdateProfileRequest {
        private String name, phoneNumber, collegeName, studentId;
    }
}
