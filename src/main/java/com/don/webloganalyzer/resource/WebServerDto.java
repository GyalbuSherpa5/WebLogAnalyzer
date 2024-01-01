package com.don.webloganalyzer.resource;

import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Data
@ToString
public class WebServerDto {

    private Map<String, Integer> countries;

    private Map<String, Integer> browsers;

    private Map<String, Integer> operatingSystems;

    Map<String, Map<String, Integer>> timeResponse;

}
