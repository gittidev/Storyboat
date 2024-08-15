package com.ssafy.storyboat.domain.epub.api;

import com.ssafy.storyboat.domain.epub.application.EpubService;
import com.ssafy.storyboat.domain.epub.dto.EpubRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequiredArgsConstructor
@RequestMapping("/epub")
public class EpubController {

    private final EpubService epubService;

    @PostMapping("/create")
    public ResponseEntity<String> createEpub(@RequestBody EpubRequest request) {
        try {
            // EPUB 파일 생성
            byte[] epubBytes = epubService.createEpub(request.getTitle(), request.getText());

            // Base64로 인코딩
            String encodedEpub = Base64.getEncoder().encodeToString(epubBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + request.getTitle() + ".epub");

            return new ResponseEntity<>(encodedEpub, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
