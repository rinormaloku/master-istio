package com.sa.web;

import com.sa.web.dto.SentenceDto;
import com.sa.web.dto.SentimentDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class SentimentController {

    @Value("${sa.logic.api.url}")
    private String saLogicApiUrl;

    private final RestTemplate restTemplate;

    public SentimentController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/sentiment")
    public SentimentDto sentimentAnalysis(@RequestBody SentenceDto sentenceDto, @RequestHeader Map<String, String> requestHeaders) {

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        for (String key : requestHeaders.keySet()) {
            headers.add(key, requestHeaders.getOrDefault(key, "no-value"));
        }

        HttpEntity<SentenceDto> httpEntity = new HttpEntity<SentenceDto>(sentenceDto, headers);

        return restTemplate
                .exchange(saLogicApiUrl + "/analyse/sentiment", HttpMethod.POST, httpEntity, SentimentDto.class)
                .getBody();
    }
}


