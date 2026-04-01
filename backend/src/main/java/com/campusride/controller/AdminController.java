package com.campusride.controller;

import com.campusride.entity.*;
import com.campusride.exception.ResourceNotFoundException;
import com.campusride.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRides", rideRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("activeBuses", busRepository.findByStatus(Bus.BusStatus.ACTIVE).size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId()); m.put("name", u.getName()); m.put("email", u.getEmail());
            m.put("role", u.getRole()); m.put("isActive", u.isActive()); m.put("createdAt", u.getCreatedAt());
            return m;
        }).collect(Collectors.toList()));
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleUserActive(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("id", id, "isActive", user.isActive()));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("id", id, "role", user.getRole()));
    }

    @DeleteMapping("/rides/{id}")
    public ResponseEntity<Void> deleteRide(@PathVariable Long id) {
        Ride ride = rideRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ride not found"));
        ride.setStatus(Ride.RideStatus.CANCELLED);
        rideRepository.save(ride);
        return ResponseEntity.noContent().build();
    }
}
