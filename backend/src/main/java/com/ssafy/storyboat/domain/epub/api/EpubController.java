package com.ssafy.storyboat.domain.epub.api;

import com.ssafy.storyboat.common.exception.InternalServerErrorException;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/epub")
public class EpubController {

    private final EpubService epubService;

    @PostMapping("/create")
    public ResponseEntity<byte[]> createEpub(@RequestBody EpubRequest request) {
        try {
            byte[] epubBytes = epubService.createEpub(request.getTitle(), request.getText());

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, "application/epub+zip");
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=book.epub");

            return new ResponseEntity<>(epubBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
