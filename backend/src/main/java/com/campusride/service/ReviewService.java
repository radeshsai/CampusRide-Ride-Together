package com.campusride.service;

import com.campusride.entity.*;
import com.campusride.exception.*;
import com.campusride.repository.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    public Map<String, Object> createReview(Long rideId, Long reviewedUserId, int rating,
                                             String comment, String reviewerEmail) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
        User reviewed = userRepository.findById(reviewedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        boolean hasBooking = bookingRepository.existsByUserAndRideAndStatus(
                reviewer, ride, Booking.BookingStatus.CONFIRMED);
        if (!hasBooking) throw new BadRequestException("You must have taken this ride to leave a review");
        if (rating < 1 || rating > 5) throw new BadRequestException("Rating must be between 1 and 5");

        Review review = Review.builder()
                .reviewer(reviewer).reviewedUser(reviewed).ride(ride)
                .rating(rating).comment(comment).build();
        reviewRepository.save(review);

        return Map.of("message", "Review submitted", "rating", rating);
    }

    public Map<String, Object> getUserReviews(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Review> reviews = reviewRepository.findByReviewedUser(user);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        List<Map<String, Object>> list = reviews.stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.getId());
            m.put("reviewerName", r.getReviewer().getName());
            m.put("rating", r.getRating());
            m.put("comment", r.getComment());
            m.put("createdAt", r.getCreatedAt());
            return m;
        }).collect(Collectors.toList());
        return Map.of("userId", userId, "averageRating", Math.round(avg * 10.0) / 10.0, "totalReviews", reviews.size(), "reviews", list);
    }
}
