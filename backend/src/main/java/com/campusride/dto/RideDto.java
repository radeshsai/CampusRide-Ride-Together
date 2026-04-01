package com.campusride.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RideDto {

    @Data
    public static class CreateRideRequest {
        @NotBlank
        private String origin;

        @NotBlank
        private String destination;

        private Double originLat;
        private Double originLng;
        private Double destinationLat;
        private Double destinationLng;

        @NotNull
        private LocalDateTime departureTime;

        @NotNull
        @Min(1)
        private Integer totalSeats;

        private BigDecimal pricePerSeat;
        private String vehicleModel;
        private String vehicleNumber;
        private String notes;
    }

    @Data
    public static class RideResponse {
        private Long id;
        private DriverInfo driver;
        private String origin;
        private String destination;
        private Double originLat;
        private Double originLng;
        private Double destinationLat;
        private Double destinationLng;
        private LocalDateTime departureTime;
        private Integer totalSeats;
        private Integer availableSeats;
        private BigDecimal pricePerSeat;
        private String vehicleModel;
        private String vehicleNumber;
        private String notes;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    public static class DriverInfo {
        private Long id;
        private String name;
        private String profilePicture;
        private String collegeName;
    }

    @Data
    public static class DriverContact {
        private String name;
        private String phoneNumber;
        private String whatsappLink;
    }
}