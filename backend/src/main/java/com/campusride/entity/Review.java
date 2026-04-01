package com.campusride.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "reviewer_id", nullable = false) private User reviewer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "reviewed_user_id", nullable = false) private User reviewedUser;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ride_id", nullable = false) private Ride ride;
    @Column(nullable = false) private Integer rating;
    @Column(length = 500) private String comment;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
