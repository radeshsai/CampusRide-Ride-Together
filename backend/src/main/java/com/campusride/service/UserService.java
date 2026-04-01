package com.campusride.service;

import com.campusride.dto.UserDto.*;
import com.campusride.entity.User;
import com.campusride.exception.ResourceNotFoundException;
import com.campusride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user);
    }

    public UserProfileResponse updateProfile(UpdateProfileRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getCollegeName() != null) user.setCollegeName(req.getCollegeName());
        if (req.getStudentId() != null) user.setStudentId(req.getStudentId());
        return toResponse(userRepository.save(user));
    }

    private UserProfileResponse toResponse(User u) {
        UserProfileResponse r = new UserProfileResponse();
        r.setId(u.getId()); r.setName(u.getName()); r.setEmail(u.getEmail());
        r.setPhoneNumber(u.getPhoneNumber()); r.setProfilePicture(u.getProfilePicture());
        r.setRole(u.getRole().name()); r.setCollegeName(u.getCollegeName());
        r.setStudentId(u.getStudentId()); r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}
