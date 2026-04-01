package com.campusride.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingDto {
    @Data
    public static class CreateBookingRequest {
        @NotNull private Long rideId;
        @Min(1) private Integer seatsBooked = 1;
    }
    @Data
    public static class BookingResponse {
        private Long id, rideId;
        private String origin, destination, driverName, status;
        private LocalDateTime departureTime, createdAt, cancelledAt;
        private Integer seatsBooked;
        private BigDecimal totalPrice;
    }
}
