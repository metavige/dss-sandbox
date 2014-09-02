package com.msi.dss.model;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "station")
@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
public class Station implements Serializable {

  private static final long serialVersionUID = 5945551045953661718L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(name="station")
  private String stationId;
  
  @Column(name = "name_tw")
  private String nameTw;
  
  @Column(name = "name_en")
  @JsonIgnore
  private String nameEn;
  
  private String note;

  @Column(name = "Sorting")
  private Integer sorting;
  
  @Temporal(TemporalType.DATE)
  @JsonIgnore
  @NotNull
  private Calendar created;
  
  @Temporal(TemporalType.DATE)
  @JsonIgnore
  @NotNull 
  private Calendar modified;

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "route_id", referencedColumnName = "id")
  private Route route;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getStationId() {
    return stationId;
  }

  public void setStationId(String station) {
    this.stationId = station;
  }

  public String getNameTw() {
    return nameTw;
  }

  public void setNameTw(String nameTw) {
    this.nameTw = nameTw;
  }

  public String getNameEn() {
    return nameEn;
  }

  public void setNameEn(String nameEn) {
    this.nameEn = nameEn;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Integer getSorting() {
    return sorting;
  }

  public void setSorting(Integer sorting) {
    this.sorting = sorting;
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

  public Route getRoute() {
    return route;
  }

  public void setRoute(Route route) {
    this.route = route;
  }
}
