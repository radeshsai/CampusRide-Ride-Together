package com.campusride.repository;
import com.campusride.entity.Bus;
import com.campusride.entity.BusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface BusLocationRepository extends JpaRepository<BusLocation, Long> {
    @Query("SELECT bl FROM BusLocation bl WHERE bl.bus = :bus ORDER BY bl.recordedAt DESC LIMIT 1")
    Optional<BusLocation> findLatestByBus(@Param("bus") Bus bus);
}
