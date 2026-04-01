package com.campusride.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class BusDto {
    @Data
    public static class BusResponse {
        private Long id;
        private String busNumber, routeName, driverName, status, startLocation, endLocation, scheduleInfo;
        private Integer capacity;
        private BusLocationResponse currentLocation;
    }
    @Data
    public static class BusLocationResponse {
        private Long busId;
        private Double latitude, longitude, speed;
        private String nextStop;
        private Integer etaMinutes;
        private LocalDateTime recordedAt;
    }
    @Data
    public static class UpdateLocationRequest {
        private Long busId;
        private Double latitude, longitude, speed;
        private String nextStop;
        private Integer etaMinutes;
    }
}
