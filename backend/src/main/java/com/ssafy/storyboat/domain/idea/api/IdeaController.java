package com.ssafy.storyboat.domain.idea.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.idea.application.IdeaService;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.dto.StudioCreateRequest;
import com.ssafy.storyboat.domain.studio.dto.ideaResponse;
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
@RequestMapping("/studios/{studioId}/ideas")
public class IdeaController {

    private final IdeaService ideaService;

    @GetMapping
    public ResponseEntity<?> getIdeas(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable("studioId") Long studioId ) {
        List<ideaResponse> ideas = ideaService.getIdeas(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
        return ResponseEntity.ok().body(ApiResponse.success(ideas, "Ideas retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<?> createIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @RequestBody StudioCreateRequest studioCreateRequest) {
        ideaService.createIdea(customOAuth2User, studioCreateRequest.getName(), studioCreateRequest.getDescription());
        return ResponseEntity.ok().body(ApiResponse.success("Idea created successfully"));
    }

    @GetMapping("/{ideaId}")
    public ResponseEntity<?> viewIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        IdeaResponse ideaResponse = ideaService.viewIdea();
        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse, "Studio retrieved successfully"));
    }

    @PutMapping("{ideaId}")
    public ResponseEntity<?>  updateIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable("studioId") Long studioId, @RequestBody StudioUpdateRequest studioUpdateRequest) {
        IdeaResponse ideaResponse = ideaService.updateIdea(customOAuth2User, )
        return ResponseEntity.ok().body(ApiResponse.success(ideResponse, 
    }

    @DeleteMapping("{ideaId}")
    public ResponseEntity<?>  deleteIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable("studioId") Long studioId, @RequestBody StudioUpdateRequest studioUpdateRequest) {
        IdeaResponse ideaResponse = ideaService.deleteIdea(customOAuth2User, studioId, studioUpdateRequest.getName(), studioUpdateRequest.getDescription());
        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse,
    }
}

