package com.msi.dss.web.request;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StationCreateCommand {

	@NotBlank
	private String stationId;
	@NotBlank
	private String nameTw;
	private String note;
	@NotNull
	private int sorting;
	
	public String getStationId() {
		return stationId;
	}
	public void setStationId(String station) {
		this.stationId = station;
	}
	public String getNameTw() {
		return nameTw;
	}
	public void setNameTw(String name) {
		this.nameTw = name;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
  public int getSorting() {
    return sorting;
  }
  public void setSorting(int sorting) {
    this.sorting = sorting;
  }
}
