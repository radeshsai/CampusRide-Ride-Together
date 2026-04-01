package com.campusride.repository;
import com.campusride.entity.Booking;
import com.campusride.entity.Ride;
import com.campusride.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    Optional<Booking> findByUserAndRide(User user, Ride ride);
    boolean existsByUserAndRideAndStatus(User user, Ride ride, Booking.BookingStatus status);
    long countByRideAndStatus(Ride ride, Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b JOIN FETCH b.ride r JOIN FETCH r.driver JOIN FETCH b.user WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findByUserWithDetails(@Param("userId") Long userId);
}
