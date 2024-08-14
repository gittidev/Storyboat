package com.ssafy.storyboat.domain.story.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.PageResponse;
import com.ssafy.storyboat.domain.story.application.StoryTextService;
import com.ssafy.storyboat.domain.story.entity.LastText;
import com.ssafy.storyboat.domain.story.entity.Text;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/studios/{studioId}/stories/{storyId}/text")
public class StoryTextController {

    private final StoryTextService storyTextService;

    @GetMapping
    public ResponseEntity<?> findLastText(
            @PathVariable Long studioId,
            @PathVariable Long storyId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        Long userId = customOAuth2User.getUserId();
        LastText lastText = storyTextService.getLastText(studioId, userId, storyId);
        return ResponseEntity.ok(ApiResponse.success(lastText == null ?  null : lastText.getTextData(), "원고 최신 버전 조회 성공"));
    }

    @PutMapping
    public ResponseEntity<?> saveTest(
            @PathVariable Long studioId,
            @PathVariable Long storyId,
            @RequestBody String data,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        Long userId = customOAuth2User.getUserId();
        LastText lastText = storyTextService.saveLastText(studioId, userId, storyId, data);
        return ResponseEntity.ok(ApiResponse.success(lastText.getTextData(), "원고 저장 성공"));
    }

    @GetMapping("/histories")
    public ResponseEntity<?> findHistories(
            @PathVariable Long studioId,
            @PathVariable Long storyId,
            @RequestParam(required = false) Pageable pageable,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        Long userId = customOAuth2User.getUserId();
        PageResponse response = storyTextService.getTexts(studioId, userId, storyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "원고 저장 내역 조회 성공"));
    }

    @GetMapping("/{textId}")
    public ResponseEntity<?> findText(
            @PathVariable Long studioId,
            @PathVariable Long storyId,
            @PathVariable String textId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        Long userId = customOAuth2User.getUserId();
        Text text = storyTextService.findTextById(studioId, userId, textId);
        return ResponseEntity.ok(ApiResponse.success(text.getTextData(), "원고 해당 버전 조회 성공"));
    }
}
