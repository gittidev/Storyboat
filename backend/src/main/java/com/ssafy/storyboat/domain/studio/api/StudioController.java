package com.ssafy.storyboat.domain.studio.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.dto.StudioCreateRequest;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;

import com.ssafy.storyboat.domain.studio.dto.StudioUpdateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Transactional
@RequestMapping("/studios")
public class StudioController {

    private final StudioService studioService;

    @PostMapping
    public ResponseEntity<?> createStudio(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @RequestBody StudioCreateRequest studioCreateRequest) {
        studioService.createStudio(customOAuth2User, studioCreateRequest.getName(), studioCreateRequest.getDescription());
        return ResponseEntity.ok().body(ApiResponse.success("Studio created successfully"));
    }

    @GetMapping
    public ResponseEntity<?> getStudios(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        List<StudioResponse> studios = studioService.getStudios(customOAuth2User);
        return ResponseEntity.ok().body(ApiResponse.success(studios, "Studios retrieved successfully"));
    }

    @PutMapping("/{studioId}")
    public ResponseEntity<?>  updateStudio(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable("studioId") Long studioId, @RequestBody StudioUpdateRequest studioUpdateRequest) {
        StudioResponse studioResponse = studioService.updateStudio(studioId, customOAuth2User.getUserId(), studioUpdateRequest.getName(), studioUpdateRequest.getDescription());
        return ResponseEntity.ok().body(ApiResponse.success(studioResponse, "Studio updated successfully"));
    }
}
