package com.campusride.controller;

import com.campusride.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/ride/{rideId}/user/{userId}")
    public ResponseEntity<Map<String, Object>> createReview(
            @PathVariable Long rideId,
            @PathVariable Long userId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment,
            Authentication auth) {
        return ResponseEntity.ok(reviewService.createReview(rideId, userId, rating, comment, auth.getName()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }
}
