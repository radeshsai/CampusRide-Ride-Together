package com.campusride.service;

import com.campusride.dto.BookingDto.*;
import com.campusride.entity.*;
import com.campusride.exception.*;
import com.campusride.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Ride ride = rideRepository.findById(req.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.ACTIVE)
            throw new BadRequestException("Ride is not active");
        if (ride.getDriver().getEmail().equals(email))
            throw new BadRequestException("You cannot book your own ride");
        if (bookingRepository.existsByUserAndRideAndStatus(user, ride, Booking.BookingStatus.CONFIRMED))
            throw new BadRequestException("You already have a booking for this ride");
        if (ride.getAvailableSeats() < req.getSeatsBooked())
            throw new BadRequestException("Not enough seats available");

        ride.setAvailableSeats(ride.getAvailableSeats() - req.getSeatsBooked());
        rideRepository.save(ride);

        Booking booking = Booking.builder()
                .user(user).ride(ride).seatsBooked(req.getSeatsBooked())
                .status(Booking.BookingStatus.CONFIRMED).build();
        booking = bookingRepository.save(booking);

        // Broadcast seat update
        messagingTemplate.convertAndSend("/topic/rides/" + ride.getId() + "/seats", ride.getAvailableSeats());

        return toResponse(booking);
    }

    @Transactional
    public List<BookingResponse> getMyBookings(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserWithDetails(user.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
}

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getEmail().equals(email))
            throw new UnauthorizedException("Not authorized to cancel this booking");
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED)
            throw new BadRequestException("Booking already cancelled");

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        Ride ride = booking.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
        rideRepository.save(ride);
        bookingRepository.save(booking);

        messagingTemplate.convertAndSend("/topic/rides/" + ride.getId() + "/seats", ride.getAvailableSeats());
        return toResponse(booking);
    }

    private BookingResponse toResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId()); r.setRideId(b.getRide().getId());
        r.setOrigin(b.getRide().getOrigin()); r.setDestination(b.getRide().getDestination());
        r.setDepartureTime(b.getRide().getDepartureTime());
        r.setDriverName(b.getRide().getDriver().getName());
        r.setSeatsBooked(b.getSeatsBooked()); r.setStatus(b.getStatus().name());
        r.setCreatedAt(b.getCreatedAt()); r.setCancelledAt(b.getCancelledAt());
        if (b.getRide().getPricePerSeat() != null)
            r.setTotalPrice(b.getRide().getPricePerSeat().multiply(java.math.BigDecimal.valueOf(b.getSeatsBooked())));
        return r;
    }
}
