package com.ssafy.storyboat.domain.idea.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.idea.application.IdeaService;
import com.ssafy.storyboat.domain.idea.dto.IdeaCreateRequest;
import com.ssafy.storyboat.domain.idea.dto.IdeaResponse;
import com.ssafy.storyboat.domain.idea.dto.IdeaUpdateRequest;
import com.ssafy.storyboat.domain.studio.dto.StudioCreateRequest;
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
    public ResponseEntity<?> getIdeas(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        List<?> ideas = ideaService.getIdeas(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok().body(ApiResponse.success(ideas, "Ideas retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<?> createIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @RequestBody IdeaCreateRequest ideaCreateRequest) {
        ideaService.createIdea(studioId, customOAuth2User.getUserId(), ideaCreateRequest);
        return ResponseEntity.ok().body(ApiResponse.success("Idea created successfully"));
    }

    @GetMapping("/{ideaId}")
    public ResponseEntity<?> viewIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long ideaId) {
        IdeaResponse ideaResponse = ideaService.viewIdea(studioId, customOAuth2User.getUserId(), ideaId);
        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse, "Idea view successfully"));
    }

    @PutMapping("/{ideaId}")
    public ResponseEntity<?>  updateIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long ideaId, @RequestBody IdeaUpdateRequest ideaUpdateRequest) {
        // 이름 변경, 설명 변경 내역들 제대로 받아오는지 로그
        IdeaResponse ideaResponse = ideaService.updateIdea(studioId, customOAuth2User.getUserId(), ideaId, ideaUpdateRequest);
        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse, "Idea updated successfully"));
    }

    @DeleteMapping("/{ideaId}")
    public ResponseEntity<?>  deleteIdea(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long ideaId) {
        ideaService.deleteIdea(studioId, customOAuth2User.getUserId(), ideaId);
        return ResponseEntity.ok().body(ApiResponse.success("Idea deleted successfully"));
    }
}

