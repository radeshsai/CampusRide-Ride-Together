package com.campusride.scheduler;

import com.campusride.dto.BusDto.UpdateLocationRequest;
import com.campusride.entity.Bus;
import com.campusride.repository.BusRepository;
import com.campusride.service.BusService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class BusSimulatorScheduler {
    private static final Logger log = LoggerFactory.getLogger(BusSimulatorScheduler.class);
    private final BusRepository busRepository;
    private final BusService busService;
    private final Random random = new Random();

    // Route waypoints for Hyderabad campus area
    private static final double[][] ROUTE_1 = {
        {17.3850, 78.4867}, {17.3855, 78.4875}, {17.3862, 78.4882},
        {17.3870, 78.4890}, {17.3878, 78.4895}, {17.3885, 78.4900},
        {17.3890, 78.4910}, {17.3895, 78.4920}, {17.3900, 78.4925},
        {17.3895, 78.4930}, {17.3888, 78.4935}, {17.3880, 78.4932}
    };
    private static final double[][] ROUTE_2 = {
        {17.3870, 78.4880}, {17.3863, 78.4888}, {17.3856, 78.4895},
        {17.3849, 78.4902}, {17.3843, 78.4909}, {17.3838, 78.4916},
        {17.3833, 78.4922}, {17.3838, 78.4928}, {17.3845, 78.4933},
        {17.3853, 78.4928}, {17.3860, 78.4922}, {17.3867, 78.4915}
    };

    private final Map<Long, Integer> busRouteIndex = new HashMap<>();
    private String[] stops1 = {"Hostel Gate", "Engineering Block", "Admin Block", "Canteen", "Library", "Main Gate"};
    private String[] stops2 = {"South Campus", "Science Block", "Sports Ground", "Admin Block", "Library", "Central Hub"};

    @Scheduled(fixedDelay = 3000)
    public void simulateBusMovement() {
        try {
            List<Bus> activeBuses = busRepository.findByStatus(Bus.BusStatus.ACTIVE);
            for (Bus bus : activeBuses) {
                double[][] route = bus.getId() % 2 == 1 ? ROUTE_1 : ROUTE_2;
                String[] stops = bus.getId() % 2 == 1 ? stops1 : stops2;
                int idx = busRouteIndex.getOrDefault(bus.getId(), 0);
                double[] point = route[idx];
                int nextIdx = (idx + 1) % route.length;
                int stopIdx = (idx / 2) % stops.length;

                UpdateLocationRequest req = new UpdateLocationRequest();
                req.setBusId(bus.getId());
                req.setLatitude(point[0] + (random.nextDouble() - 0.5) * 0.0002);
                req.setLongitude(point[1] + (random.nextDouble() - 0.5) * 0.0002);
                req.setSpeed(20.0 + random.nextDouble() * 20.0);
                req.setNextStop(stops[stopIdx]);
                req.setEtaMinutes(2 + random.nextInt(8));
                busService.updateLocation(req);
                busRouteIndex.put(bus.getId(), nextIdx);
            }
        } catch (Exception e) {
            log.warn("Bus simulation error: {}", e.getMessage());
        }
    }
}
