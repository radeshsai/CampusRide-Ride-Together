package com.campusride.service;

import com.campusride.dto.BusDto.*;
import com.campusride.entity.*;
import com.campusride.exception.*;
import com.campusride.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusService {
    private final BusRepository busRepository;
    private final BusLocationRepository busLocationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<BusResponse> getAllBuses() {
        return busRepository.findByStatus(Bus.BusStatus.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BusLocationResponse getLatestLocation(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        return busLocationRepository.findLatestByBus(bus)
                .map(this::toLocationResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No location data for this bus"));
    }

    @Transactional
    public BusLocationResponse updateLocation(UpdateLocationRequest req) {
        Bus bus = busRepository.findById(req.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        BusLocation location = BusLocation.builder()
                .bus(bus).latitude(req.getLatitude()).longitude(req.getLongitude())
                .speed(req.getSpeed()).nextStop(req.getNextStop()).etaMinutes(req.getEtaMinutes()).build();
        location = busLocationRepository.save(location);
        BusLocationResponse response = toLocationResponse(location);
        messagingTemplate.convertAndSend("/topic/bus/" + bus.getId() + "/location", response);
        return response;
    }

    private BusResponse toResponse(Bus bus) {
        BusResponse r = new BusResponse();
        r.setId(bus.getId()); r.setBusNumber(bus.getBusNumber()); r.setRouteName(bus.getRouteName());
        r.setDriverName(bus.getDriverName()); r.setCapacity(bus.getCapacity());
        r.setStatus(bus.getStatus().name()); r.setStartLocation(bus.getStartLocation());
        r.setEndLocation(bus.getEndLocation()); r.setScheduleInfo(bus.getScheduleInfo());
        busLocationRepository.findLatestByBus(bus).ifPresent(loc -> r.setCurrentLocation(toLocationResponse(loc)));
        return r;
    }

    private BusLocationResponse toLocationResponse(BusLocation loc) {
        BusLocationResponse r = new BusLocationResponse();
        r.setBusId(loc.getBus().getId()); r.setLatitude(loc.getLatitude()); r.setLongitude(loc.getLongitude());
        r.setSpeed(loc.getSpeed()); r.setNextStop(loc.getNextStop()); r.setEtaMinutes(loc.getEtaMinutes());
        r.setRecordedAt(loc.getRecordedAt());
        return r;
    }
}
