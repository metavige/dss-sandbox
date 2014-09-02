package com.msi.dss.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.msi.dss.model.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
	
}
