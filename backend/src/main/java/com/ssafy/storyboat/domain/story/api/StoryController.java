package com.ssafy.storyboat.domain.story.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.story.application.StoryService;
import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.Story;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/studios/{studioId}/stories")
public class StoryController {

    private final StoryService storyService;

    // 스튜디오의 스토리 목록 조회
    @GetMapping()
    private ResponseEntity<?> findAllStories(@PathVariable final Long studioId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        List<StoryFindAllResponse> list = storyService.findByStudioId(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok(ApiResponse.success(list, "Stories Find Success"));
    }

    // 스튜디오에 스토리 생성
    @PostMapping()
    private ResponseEntity<?> createStory(@PathVariable final Long studioId, @RequestBody Map<String, Object> payload, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        storyService.makeStory(studioId, customOAuth2User.getUserId(), (String)payload.get("title"));
        return ResponseEntity.ok(ApiResponse.success("Stories Create Success"));
    }

    // 스토리 삭제
    @DeleteMapping("/{studioStoryId}")
    private ResponseEntity<?> deleteStory(@PathVariable final Long studioId, @PathVariable final Long studioStoryId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        storyService.deleteStory(userId, studioId, studioStoryId);
        return ResponseEntity.ok(ApiResponse.success("Stories Delete Success"));
    }

    // 스토리 세부 조회(마지막 저장)
    @GetMapping("/{studioStoryId}") ResponseEntity<?> findStory(@PathVariable final Long studioId, @PathVariable final Long studioStoryId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        Story story = storyService.findStory(studioStoryId, userId);
        return ResponseEntity.ok(ApiResponse.success(story.getStoryData(), "Stories Find Success"));
    }

    // 스토리 수정(저장)
    @PutMapping("/{studioStoryId}") ResponseEntity<?> saveStory(@PathVariable final Long studioId, @PathVariable final Long studioStoryId, @RequestBody String storyData, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        storyService.saveStory(studioId, userId, studioStoryId, storyData);

        return ResponseEntity.ok(ApiResponse.success("Save Success"));

    }

    // 스토리 업로드
    @PostMapping("/{studioStoryId}/{toStudioId}") ResponseEntity<?> uploadStory(@PathVariable final Long studioId, @PathVariable final Long toStudioId, @PathVariable final Long studioStoryId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        Story story = storyService.findStory(studioStoryId, userId);
        storyService.uploadStory(story, toStudioId, userId);

        return ResponseEntity.ok(ApiResponse.success("Upload Success"));
    }

    // 스토리 수정 History 조회
    @GetMapping("/{studioStoryId}/histories") ResponseEntity<?> findHistories(@PathVariable final Long studioId, @PathVariable final Long studioStoryId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        return null;
    }

    // 해당 버전 스토리 조회(미리보기)
    @GetMapping("/{studioStoryId}/histories/{storyId}") ResponseEntity<?> findHistory(@PathVariable final Long studioId, @PathVariable final Long storyId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        return null;
    }

    // 스토리 롤백
    @PutMapping("/{studioStoryId}/histories/{storyId}") ResponseEntity<?> rollbackStory (@PathVariable final Long studioId, @PathVariable final Long storyId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        return null;
    }
}
