package com.campusride.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rides")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ride {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "driver_id", nullable = false) private User driver;
    @Column(nullable = false) private String origin;
    @Column(nullable = false) private String destination;
    @Column(name = "origin_lat") private Double originLat;
    @Column(name = "origin_lng") private Double originLng;
    @Column(name = "destination_lat") private Double destinationLat;
    @Column(name = "destination_lng") private Double destinationLng;
    @Column(name = "departure_time", nullable = false) private LocalDateTime departureTime;
    @Column(name = "total_seats", nullable = false) private Integer totalSeats;
    @Column(name = "available_seats", nullable = false) private Integer availableSeats;
    @Column(name = "price_per_seat", precision = 10, scale = 2) private BigDecimal pricePerSeat;
    @Column(name = "vehicle_model") private String vehicleModel;
    @Column(name = "vehicle_number") private String vehicleNumber;
    @Column(name = "notes", length = 500) private String notes;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private RideStatus status = RideStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<Booking> bookings;
    public enum RideStatus { ACTIVE, COMPLETED, CANCELLED }
}
