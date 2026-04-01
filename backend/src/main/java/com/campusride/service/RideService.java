package com.campusride.service;

import com.campusride.dto.RideDto.CreateRideRequest;
import com.campusride.dto.RideDto.DriverContact;
import com.campusride.dto.RideDto.DriverInfo;
import com.campusride.dto.RideDto.RideResponse;
import com.campusride.entity.Booking;
import com.campusride.entity.Ride;
import com.campusride.entity.User;
import com.campusride.exception.ResourceNotFoundException;
import com.campusride.exception.UnauthorizedException;
import com.campusride.repository.BookingRepository;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public RideResponse createRide(CreateRideRequest req, String email) {
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Ride ride = Ride.builder()
                .driver(driver)
                .origin(req.getOrigin())
                .destination(req.getDestination())
                .originLat(req.getOriginLat())
                .originLng(req.getOriginLng())
                .destinationLat(req.getDestinationLat())
                .destinationLng(req.getDestinationLng())
                .departureTime(req.getDepartureTime())
                .totalSeats(req.getTotalSeats())
                .availableSeats(req.getTotalSeats())
                .pricePerSeat(req.getPricePerSeat())
                .vehicleModel(req.getVehicleModel())
                .vehicleNumber(req.getVehicleNumber())
                .notes(req.getNotes())
                .status(Ride.RideStatus.ACTIVE)
                .build();
        return toResponse(rideRepository.save(ride));
    }

    public List<RideResponse> getAvailableRides(String origin, String destination) {
        List<Ride> rides;
        LocalDateTime now = LocalDateTime.now();
        if ((origin != null && !origin.isEmpty()) || (destination != null && !destination.isEmpty())) {
            String o = origin != null ? origin.toLowerCase() : "";
            String d = destination != null ? destination.toLowerCase() : "";
            rides = rideRepository.searchRides(o, d, now);
        } else {
            rides = rideRepository.findAvailableRides(now);
        }
        return rides.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public RideResponse getRideById(Long id) {
        return toResponse(rideRepository.findByIdWithDriver(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found")));
    }

    @Transactional
    public void deleteRide(Long id, String email) {
        Ride ride = rideRepository.findByIdWithDriver(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));
        if (!ride.getDriver().getEmail().equals(email)) {
            throw new UnauthorizedException("Not authorized to delete this ride");
        }
        ride.setStatus(Ride.RideStatus.CANCELLED);
        rideRepository.save(ride);
    }

    @Transactional
    public DriverContact getDriverContact(Long rideId, String email) {
        Ride ride = rideRepository.findByIdWithDriver(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));
        User requester = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean hasBooking = bookingRepository.existsByUserAndRideAndStatus(
                requester, ride, Booking.BookingStatus.CONFIRMED);
        if (!hasBooking) {
            throw new UnauthorizedException("You must book this ride first to see driver contact");
        }
        User driver = ride.getDriver();
        DriverContact contact = new DriverContact();
        contact.setName(driver.getName());
        contact.setPhoneNumber(driver.getPhoneNumber());
        if (driver.getPhoneNumber() != null) {
            contact.setWhatsappLink("https://wa.me/" + driver.getPhoneNumber().replaceAll("[^0-9]", ""));
        }
        return contact;
    }

    private RideResponse toResponse(Ride ride) {
        RideResponse r = new RideResponse();
        r.setId(ride.getId());
        r.setOrigin(ride.getOrigin());
        r.setDestination(ride.getDestination());
        r.setOriginLat(ride.getOriginLat());
        r.setOriginLng(ride.getOriginLng());
        r.setDestinationLat(ride.getDestinationLat());
        r.setDestinationLng(ride.getDestinationLng());
        r.setDepartureTime(ride.getDepartureTime());
        r.setTotalSeats(ride.getTotalSeats());
        r.setAvailableSeats(ride.getAvailableSeats());
        r.setPricePerSeat(ride.getPricePerSeat());
        r.setVehicleModel(ride.getVehicleModel());
        r.setVehicleNumber(ride.getVehicleNumber());
        r.setNotes(ride.getNotes());
        r.setStatus(ride.getStatus().name());
        r.setCreatedAt(ride.getCreatedAt());
        DriverInfo di = new DriverInfo();
        di.setId(ride.getDriver().getId());
        di.setName(ride.getDriver().getName());
        di.setProfilePicture(ride.getDriver().getProfilePicture());
        di.setCollegeName(ride.getDriver().getCollegeName());
        r.setDriver(di);
        return r;
    }
}