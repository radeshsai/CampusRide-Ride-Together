package com.campusride.repository;

import com.campusride.entity.Ride;
import com.campusride.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByDriverOrderByCreatedAtDesc(User driver);

    @Query("SELECT r FROM Ride r JOIN FETCH r.driver WHERE r.status = 'ACTIVE' AND r.availableSeats > 0 ORDER BY r.departureTime ASC")
    List<Ride> findAvailableRides();

    @Query("SELECT r FROM Ride r JOIN FETCH r.driver WHERE r.status = 'ACTIVE' AND r.availableSeats > 0 AND (LOWER(r.origin) LIKE %:origin% OR LOWER(r.destination) LIKE %:destination%) ORDER BY r.departureTime ASC")
    List<Ride> searchRides(@Param("origin") String origin, @Param("destination") String destination);

    @Query("SELECT r FROM Ride r JOIN FETCH r.driver WHERE r.id = :id")
    Optional<Ride> findByIdWithDriver(@Param("id") Long id);

    @Query("SELECT r FROM Ride r JOIN FETCH r.driver WHERE r.status = 'ACTIVE' AND r.availableSeats > 0 AND r.departureTime > :now ORDER BY r.departureTime ASC")
    List<Ride> findAvailableRides(@Param("now") LocalDateTime now);

    @Query("SELECT r FROM Ride r JOIN FETCH r.driver WHERE r.status = 'ACTIVE' AND r.availableSeats > 0 AND r.departureTime > :now AND (LOWER(r.origin) LIKE %:origin% OR LOWER(r.destination) LIKE %:destination%) ORDER BY r.departureTime ASC")
    List<Ride> searchRides(@Param("origin") String origin, @Param("destination") String destination, @Param("now") LocalDateTime now);
}