package com.campusride.service;

import com.campusride.dto.AuthDto.*;
import com.campusride.entity.User;
import com.campusride.exception.BadRequestException;
import com.campusride.repository.UserRepository;
import com.campusride.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName()).email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phoneNumber(req.getPhoneNumber())
                .collegeName(req.getCollegeName())
                .studentId(req.getStudentId())
                .role(User.Role.USER).build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(),
                user.getRole().name(), user.getProfilePicture());
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(),
                user.getRole().name(), user.getProfilePicture());
    }

    public AuthResponse googleLogin(GoogleLoginRequest req) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId)).build();
            GoogleIdToken idToken = verifier.verify(req.getToken());
            if (idToken == null) throw new BadRequestException("Invalid Google token");
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");
            String googleId = payload.getSubject();

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .name(name).email(email).googleId(googleId)
                        .profilePicture(picture).role(User.Role.USER).build();
                return userRepository.save(newUser);
            });
            String token = jwtUtil.generateToken(user.getEmail());
            return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(),
                    user.getRole().name(), user.getProfilePicture());
        } catch (Exception e) {
            log.error("Google login error: {}", e.getMessage());
            throw new BadRequestException("Google authentication failed");
        }
    }
}
