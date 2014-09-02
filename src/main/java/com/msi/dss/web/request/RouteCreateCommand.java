package com.msi.dss.web.request;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteCreateCommand {

	@NotBlank
	private String routeId;
	@NotBlank
	private String name;
	private String note;
	
	public String getRouteId() {
		return routeId;
	}
	public void setRouteId(String route) {
		this.routeId = route;
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
}
