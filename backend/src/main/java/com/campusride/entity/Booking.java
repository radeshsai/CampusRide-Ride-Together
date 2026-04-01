package com.campusride.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ride_id", nullable = false) private Ride ride;
    @Column(name = "seats_booked", nullable = false) private Integer seatsBooked = 1;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private BookingStatus status = BookingStatus.CONFIRMED;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "cancelled_at") private LocalDateTime cancelledAt;
    public enum BookingStatus { CONFIRMED, CANCELLED }
}
