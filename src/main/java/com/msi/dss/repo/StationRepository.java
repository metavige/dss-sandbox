package com.msi.dss.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.msi.dss.model.Station;

public interface StationRepository extends JpaRepository<Station, Long> {
  
}
