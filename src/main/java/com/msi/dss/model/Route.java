package com.msi.dss.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "route")
@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class Route implements Serializable {

  private static final long serialVersionUID = 2206476648234483355L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  private Long systemId;
  
  @Column(name = "Route")
  private String routeId;
  
  private String name;
  
  private String note;
  
  @Temporal(TemporalType.DATE)
  private Calendar created;
  
  @Temporal(TemporalType.DATE)
  private Calendar modified;

  @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "route")
  @OrderBy("sorting asc")
  @JsonIgnore
  private final List<Station> stations = new ArrayList<>();

  public Route() {
    systemId = 0L;
  }

  // @ManyToOne(cascade=CascadeType.ALL)
  // @JoinColumn(name="SYSTEM_ID")
  // private DefSystem system;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getSystemId() {
    return systemId;
  }

  public void setSystemId(Long systemId) {
    this.systemId = systemId;
  }

  public String getRouteId() {
    return routeId;
  }

  public void setRouteId(String routeId) {
    this.routeId = routeId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Calendar getCreated() {
    return created;
  }

  public void setCreated(Calendar created) {
    this.created = created;
  }

  public Calendar getModified() {
    return modified;
  }

  public void setModified(Calendar modified) {
    this.modified = modified;
  }

  public List<Station> getStations() {
    return stations;
  }

  public void addStation(Station station) {
    stations.add(station);
    station.setRoute(this);
  }

  public void removeStations(Station station) {
    stations.remove(station);
  }
}
