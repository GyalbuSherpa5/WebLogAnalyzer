package com.don.webloganalyzer.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DayAndTime {

    private Map<String, List<GenericResponse<String, Integer>>> timeResponse;
}
