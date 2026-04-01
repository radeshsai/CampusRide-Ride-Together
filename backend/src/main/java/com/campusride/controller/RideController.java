package com.campusride.controller;

import com.campusride.dto.RideDto.*;
import com.campusride.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {
    private final RideService rideService;

    @PostMapping
    public ResponseEntity<RideResponse> createRide(@Valid @RequestBody CreateRideRequest req,
                                                    Authentication auth) {
        return ResponseEntity.ok(rideService.createRide(req, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<RideResponse>> getRides(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(rideService.getAvailableRides(origin, destination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RideResponse> getRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRideById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(@PathVariable Long id, Authentication auth) {
        rideService.deleteRide(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/driver-contact")
    public ResponseEntity<DriverContact> getDriverContact(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(rideService.getDriverContact(id, auth.getName()));
    }
}
