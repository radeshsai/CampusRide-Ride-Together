package com.campusride.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "buses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Bus {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "bus_number", nullable = false, unique = true) private String busNumber;
    @Column(name = "route_name", nullable = false) private String routeName;
    @Column(name = "driver_name") private String driverName;
    private Integer capacity;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private BusStatus status = BusStatus.ACTIVE;
    @Column(name = "start_location") private String startLocation;
    @Column(name = "end_location") private String endLocation;
    @Column(name = "schedule_info") private String scheduleInfo;
    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<BusLocation> locations;
    public enum BusStatus { ACTIVE, INACTIVE, MAINTENANCE }
}
