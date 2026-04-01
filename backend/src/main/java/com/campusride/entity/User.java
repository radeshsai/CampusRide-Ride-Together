package com.campusride.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String email;
    private String password;
    @Column(name = "phone_number") private String phoneNumber;
    @Column(name = "profile_picture") private String profilePicture;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Role role = Role.USER;
    @Column(name = "google_id") private String googleId;
    @Column(name = "is_active") private boolean isActive = true;
    @Column(name = "college_name") private String collegeName;
    @Column(name = "student_id") private String studentId;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<Ride> driverRides;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<Booking> bookings;
    public enum Role { USER, DRIVER, ADMIN }
}
