package com.campusride.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "bus_locations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BusLocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "bus_id", nullable = false) private Bus bus;
    @Column(nullable = false) private Double latitude;
    @Column(nullable = false) private Double longitude;
    private Double speed;
    @Column(name = "next_stop") private String nextStop;
    @Column(name = "eta_minutes") private Integer etaMinutes;
    @CreationTimestamp @Column(name = "recorded_at", updatable = false) private LocalDateTime recordedAt;
}
