package com.msi.dss.web.services;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.msi.dss.model.Route;
import com.msi.dss.model.Station;
import com.msi.dss.repo.RouteRepository;
import com.msi.dss.repo.StationRepository;
import com.msi.dss.web.request.RouteCreateCommand;
import com.msi.dss.web.request.StationCreateCommand;

@RestController
public class RouteController {

  private RouteRepository routeRepository;
  private StationRepository stationRepository;

  @Autowired
  public RouteController(RouteRepository routeRepo,
      StationRepository stationRepo) {
    this.routeRepository = routeRepo;
    this.stationRepository = stationRepo;
  }

  /**
   * 取得所有 Routes 資料
   * 
   * @return
   */
  @RequestMapping(value = "/api/routes", method = GET)
  public List<Route> getRoutes() {
    return routeRepository.findAll(new Sort(Sort.Direction.ASC, "id"));
  }

  /**
   * 取得 Stations 資料
   * 
   * @param routeId
   * @return
   */
  @RequestMapping(value = "/api/routes/{routeId:\\d+}/stations", method = GET)
  public ResponseEntity<List<Station>> getStations(
      final @PathVariable long routeId) {
    ResponseEntity<List<Station>> rv;
    Route oldRoute = this.routeRepository.findOne(routeId);
    if (oldRoute == null) {
      rv = new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return rv;
    }
    else {
      rv = new ResponseEntity<List<Station>>(oldRoute.getStations(),
          HttpStatus.OK);
    }
    return rv;
  }

  /**
   * 建立一個新的 route
   * 
   * @param command
   * @param bindingResult
   * @return
   */
  @RequestMapping(value = "/api/routes", method = POST)
  public ResponseEntity<Route> createRoute(
      final @RequestBody RouteCreateCommand command,
      final BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      throw new IllegalArgumentException("Invalid arguments.");
    }

    ResponseEntity<Route> rv;

    Route newRoute = new Route();
    newRoute.setRouteId(command.getRouteId());
    newRoute.setName(command.getName());
    newRoute.setNote(command.getNote());
    newRoute.setCreated(Calendar.getInstance());
    newRoute.setModified(newRoute.getCreated());

    try {
      this.routeRepository.save(newRoute);
      rv = new ResponseEntity<Route>(newRoute, HttpStatus.CREATED);
    }
    catch (DataIntegrityViolationException e) {
      rv = new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    return rv;
  }

  /**
   * 修改 Route
   * 
   * @param routeId
   * @param command
   * @param bindingResult
   * @return
   */
  @RequestMapping(value = "/api/routes/{routeId:\\d+}", method = PUT)
  public ResponseEntity<Route> updateRoute(final @PathVariable Long routeId,
      final @RequestBody RouteCreateCommand command,
      final BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      throw new IllegalArgumentException("Invalid arguments.");
    }

    ResponseEntity<Route> rv;
    Route oldRoute = this.routeRepository.findOne(routeId);
    if (oldRoute == null) {

      rv = new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return rv;
    }
    oldRoute.setRouteId(command.getRouteId());
    oldRoute.setName(command.getName());
    oldRoute.setNote(command.getNote());
    oldRoute.setModified(Calendar.getInstance());

    try {
      this.routeRepository.saveAndFlush(oldRoute);
      rv = new ResponseEntity<Route>(oldRoute, HttpStatus.OK);
    }
    catch (DataIntegrityViolationException e) {
      rv = new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    return rv;
  }

  /**
   * 刪除 Route
   * 
   * @param routeId
   * @return
   */
  @RequestMapping(value = "/api/routes/{routeId:\\d+}", method = DELETE)
  public ResponseEntity<Object> deleteRoute(final @PathVariable Long routeId) {

    ResponseEntity<Object> rv;
    if (!this.routeRepository.exists(routeId)) {
      rv = new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return rv;
    }

    this.routeRepository.delete(routeId);
    rv = new ResponseEntity<>(HttpStatus.NO_CONTENT);

    return rv;
  }

  /**
   * 建立一個新的 Station
   * 
   * @param routeId
   * @param command
   * @param bindingResult
   * @return
   */
  @RequestMapping(value = "/api/routes/{routeId:\\d+}/stations", method = POST)
  public ResponseEntity<Station> createStation(
      final @PathVariable Long routeId,
      final @RequestBody StationCreateCommand command,
      final BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      throw new IllegalArgumentException("Invalid arguments.");
    }
    ResponseEntity<Station> rv;

    Route oldRoute = this.routeRepository.findOne(routeId);
    if (oldRoute == null) {

      rv = new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return rv;
    }

    Station newStation = new Station();
    newStation.setStationId(command.getStationId());
    newStation.setNameTw(command.getNameTw());
    newStation.setNameEn("");
    newStation.setNote(command.getNote());
    newStation.setSorting(command.getSorting());
    newStation.setCreated(Calendar.getInstance());
    newStation.setModified(newStation.getCreated());

    try {
      oldRoute.addStation(newStation);
      this.routeRepository.saveAndFlush(oldRoute);
      // this.stationRepository.save(newStation);
      rv = new ResponseEntity<Station>(newStation, HttpStatus.CREATED);
    }
    catch (DataIntegrityViolationException e) {
      rv = new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    return rv;
  }

  /**
   * 修改 Station
   * 
   * @param routeId
   * @param stationId
   * @param command
   * @param bindingResult
   * @return
   */
  @RequestMapping(value = "/api/routes/{routeId:\\d+}/stations/{stationId:\\d+}", method = PUT)
  public ResponseEntity<Station> updateStation(
      final @PathVariable Long routeId,
      final @PathVariable Long stationId,
      final @RequestBody StationCreateCommand command,
      final BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      throw new IllegalArgumentException("Invalid arguments.");
    }
    ResponseEntity<Station> rv;

    Station oldStation = this.stationRepository.findOne(stationId);

    if (oldStation == null) {
      rv = new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return rv;
    }
    else {
      oldStation.setStationId(command.getStationId());
      oldStation.setNameTw(command.getNameTw());
      oldStation.setNote(command.getNote());
      oldStation.setSorting(command.getSorting());
      oldStation.setModified(Calendar.getInstance());

      try {
        this.stationRepository.saveAndFlush(oldStation);
        // this.stationRepository.save(newStation);
        rv = new ResponseEntity<Station>(oldStation, HttpStatus.OK);
      }
      catch (DataIntegrityViolationException e) {
        rv = new ResponseEntity<>(HttpStatus.CONFLICT);
      }
    }

    return rv;
  }

  /**
   * 刪除 Station
   * 
   * @param routeId
   * @param stationId
   * @return
   */
  @RequestMapping(value = "/api/routes/{routeId:\\d+}/stations/{stationId:\\d+}", method = DELETE)
  public ResponseEntity<Object> deleteStation(final @PathVariable Long routeId,
      final @PathVariable Long stationId) {

    ResponseEntity<Object> rv;
    if (!this.stationRepository.exists(stationId)) {
      rv = new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return rv;
    }

    this.stationRepository.delete(stationId);
    rv = new ResponseEntity<>(HttpStatus.NO_CONTENT);

    return rv;
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgumentException(
      IllegalArgumentException e) throws Exception {
    return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
  }
}
