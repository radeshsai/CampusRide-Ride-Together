package com.campusride.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDto {
    @Data
    public static class RegisterRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6) private String password;
        private String phoneNumber;
        private String collegeName;
        private String studentId;
    }
    @Data
    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }
    @Data
    public static class GoogleLoginRequest {
        @NotBlank private String token;
    }
    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String role;
        private String profilePicture;
        public AuthResponse(String token, Long id, String name, String email, String role, String profilePicture) {
            this.token = token; this.id = id; this.name = name;
            this.email = email; this.role = role; this.profilePicture = profilePicture;
        }
    }
}
