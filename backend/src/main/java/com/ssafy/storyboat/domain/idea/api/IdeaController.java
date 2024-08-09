package com.ssafy.storyboat.domain.idea.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.idea.application.IdeaService;
import com.ssafy.storyboat.domain.idea.dto.IdeaCreateRequest;
import com.ssafy.storyboat.domain.idea.dto.IdeaResponse;
import com.ssafy.storyboat.domain.idea.dto.IdeaUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Idea API", description = "아이디어 관리 API")
public class IdeaController {

    private final IdeaService ideaService;

    @GetMapping
    @Operation(
            summary = "아이디어 목록 조회",
            description = "특정 스튜디오에 대한 모든 아이디어를 조회합니다."
    )
    public ResponseEntity<?> getIdeas(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId) {
        List<?> ideas = ideaService.getIdeas(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok().body(ApiResponse.success(ideas, "아이디어 목록 조회 성공"));
    }

    @PostMapping
    @Operation(
            summary = "아이디어 생성",
            description = "특정 스튜디오에 새로운 아이디어를 생성합니다."
    )
    public ResponseEntity<?> createIdea(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            @RequestBody IdeaCreateRequest ideaCreateRequest) {

        IdeaResponse ideaResponse = ideaService.createIdea(studioId, customOAuth2User.getUserId(), ideaCreateRequest);
        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse, "아이디어 생성 성공"));
    }

//    @GetMapping("/{ideaId}")
//    @Operation(
//            summary = "아이디어 조회",
//            description = "특정 아이디어의 세부 정보를 조회합니다."
//    )
//    public ResponseEntity<?> viewIdea(
//            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
//            @PathVariable Long studioId,
//            @PathVariable Long ideaId) {
//        IdeaResponse ideaResponse = ideaService.viewIdea(studioId, customOAuth2User.getUserId(), ideaId);
//        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse, "아이디어 조회 성공"));
//    }

    @PutMapping("/{ideaId}")
    @Operation(
            summary = "아이디어 수정",
            description = "특정 아이디어의 정보를 수정합니다."
    )
    public ResponseEntity<?> updateIdea(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            @PathVariable Long ideaId,
            @RequestBody IdeaUpdateRequest ideaUpdateRequest) {
        IdeaResponse ideaResponse = ideaService.updateIdea(studioId, customOAuth2User.getUserId(), ideaId, ideaUpdateRequest);
        return ResponseEntity.ok().body(ApiResponse.success(ideaResponse, "아이디어 수정 성공"));
    }

    @DeleteMapping("/{ideaId}")
    @Operation(
            summary = "아이디어 삭제",
            description = "특정 아이디어를 삭제합니다."
    )
    public ResponseEntity<?> deleteIdea(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            @PathVariable Long ideaId) {
        ideaService.deleteIdea(studioId, customOAuth2User.getUserId(), ideaId);
        return ResponseEntity.ok().body(ApiResponse.success("아이디어 삭제 성공"));
    }
}
