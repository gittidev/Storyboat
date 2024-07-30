package com.ssafy.storyboat.domain.studio.api;

import com.ssafy.storyboat.common.api.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;

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
public class StudioController {

    private final StudioService studioService;

    @GetMapping("/studios")
    public ResponseEntity<ApiResponse<List<StudioResponse>>> getStudios(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        List<StudioResponse> studios = studioService.getStudios(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
        return ResponseEntity.ok(ApiResponse.success(studios, "find studios success"));
    }
}
