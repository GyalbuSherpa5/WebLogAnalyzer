package com.don.webloganalyzer.controller;

import com.don.webloganalyzer.resource.WebServerDto;
import com.don.webloganalyzer.service.WebServiceLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WebServerLogController {

    private final WebServiceLogService webServiceLogService;

    @GetMapping("/userLogs")
    public WebServerDto getUserLogs() {
        return webServiceLogService.getUsersLogs();
    }
}
