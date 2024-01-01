package com.don.webloganalyzer.service;

import com.don.webloganalyzer.resource.WebServerDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Service
public class WebServerLogServiceImpl implements WebServiceLogService {

    @Value("${filepath}")
    String filePath;

    @Value("${threadSize}")
    int threadSize;

    private static final Map<String, Integer> countryCount = new HashMap<>();
    private static final Map<String, Integer> browserCount = new HashMap<>();
    private static final Map<String, Integer> osCount = new HashMap<>();
    private static final Map<String, Map<String, Integer>> dayTimeCount = new HashMap<>();

    @Override
    public WebServerDto getUsersLogs() {
        try (ExecutorService executorService = Executors.newFixedThreadPool(threadSize);
             BufferedReader br = new BufferedReader(new FileReader(filePath))) {

            String line;
            while ((line = br.readLine()) != null) {
                String finalLine = line;
                executorService.submit(() -> processLine(finalLine));
            }

            executorService.shutdown();

        } catch (IOException e) {
            log.error("Error processing logs: {}", e.getMessage());
        }

        WebServerDto webServerDto = new WebServerDto();

        webServerDto.setBrowsers(browserCount);
        webServerDto.setCountries(countryCount);
        webServerDto.setOperatingSystems(osCount);
        webServerDto.setTimeResponse(dayTimeCount);

        return webServerDto;
    }

    private static void processLine(String line) {

        log.info("Calculating using thread : " + Thread.currentThread());

        String[] columns = line.split(",");
        String day = columns[1].trim();
        String time = columns[2].trim();
        String os = columns[3].trim();
        String country = columns[4].trim();
        String browser = columns[5].trim();

        countryCount.merge(country, 1, Integer::sum);
        browserCount.merge(browser, 1, Integer::sum);
        osCount.merge(os, 1, Integer::sum);

        dayTimeCount
                .computeIfAbsent(day, k -> new HashMap<>())
                .merge(time, 1, Integer::sum);
    }
}
