package com.campusride.controller;

import com.campusride.dto.BusDto.*;
import com.campusride.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    private final BusService busService;

    @GetMapping
    public ResponseEntity<List<BusResponse>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/{id}/location")
    public ResponseEntity<BusLocationResponse> getBusLocation(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getLatestLocation(id));
    }

    @PostMapping("/update-location")
    public ResponseEntity<BusLocationResponse> updateLocation(@RequestBody UpdateLocationRequest req) {
        return ResponseEntity.ok(busService.updateLocation(req));
    }
}
