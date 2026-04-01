package com.campusride.config;

import com.campusride.entity.Bus;
import com.campusride.entity.BusLocation;
import com.campusride.repository.BusLocationRepository;
import com.campusride.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final BusRepository busRepository;
    private final BusLocationRepository busLocationRepository;

    @Override
    public void run(String... args) {
        if (busRepository.count() == 0) {
            Bus bus1 = Bus.builder()
                .busNumber("CR-001").routeName("North Campus – Main Gate")
                .driverName("Ravi Kumar").capacity(45).status(Bus.BusStatus.ACTIVE)
                .startLocation("North Campus Hostel").endLocation("Main Gate")
                .scheduleInfo("Every 20 mins, 7AM–9PM").build();

            Bus bus2 = Bus.builder()
                .busNumber("CR-002").routeName("South Campus – Library")
                .driverName("Suresh Reddy").capacity(40).status(Bus.BusStatus.ACTIVE)
                .startLocation("South Campus").endLocation("Central Library")
                .scheduleInfo("Every 30 mins, 8AM–8PM").build();

            bus1 = busRepository.save(bus1);
            bus2 = busRepository.save(bus2);

            busLocationRepository.save(BusLocation.builder()
                .bus(bus1).latitude(17.3850).longitude(78.4867)
                .speed(30.0).nextStop("Engineering Block").etaMinutes(5).build());

            busLocationRepository.save(BusLocation.builder()
                .bus(bus2).latitude(17.3870).longitude(78.4880)
                .speed(25.0).nextStop("Admin Block").etaMinutes(8).build());

            log.info("Sample bus data initialized");
        }
    }
}
