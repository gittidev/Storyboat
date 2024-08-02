package com.ssafy.storyboat.domain.story.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.story.application.StoryService;
import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.dto.StoryHistoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.Story;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Story API", description = "스토리 관리 API")
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    @Operation(
            summary = "스토리 목록 조회",
            description = "특정 스튜디오의 모든 스토리를 조회합니다."
    )
    public ResponseEntity<?> findAllStories(
            @PathVariable final Long studioId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        List<StoryFindAllResponse> list = storyService.findByStudioId(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok(ApiResponse.success(list, "Stories Find Success"));
    }

    @PostMapping
    @Operation(
            summary = "스토리 생성",
            description = "특정 스튜디오에 새로운 스토리를 생성합니다."
    )
    public ResponseEntity<?> createStory(
            @PathVariable final Long studioId,
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        storyService.makeStory(studioId, customOAuth2User.getUserId(), (String) payload.get("title"));
        return ResponseEntity.ok(ApiResponse.success("Stories Create Success"));
    }

    @DeleteMapping("/{studioStoryId}")
    @Operation(
            summary = "스토리 삭제",
            description = "특정 스튜디오의 스토리를 삭제합니다."
    )
    public ResponseEntity<?> deleteStory(
            @PathVariable final Long studioId,
            @PathVariable final Long studioStoryId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        storyService.deleteStory(studioId, userId, studioStoryId);
        return ResponseEntity.ok(ApiResponse.success("Stories Delete Success"));
    }

    @GetMapping("/{studioStoryId}")
    @Operation(
            summary = "스토리 세부 조회",
            description = "특정 스토리의 세부 정보를 조회합니다."
    )
    public ResponseEntity<?> findStory(
            @PathVariable final Long studioId,
            @PathVariable final Long studioStoryId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        Story story = storyService.findStories(studioId, userId, studioStoryId);
        return ResponseEntity.ok(ApiResponse.success(story.getStoryData(), "Stories Find Success"));
    }

    @PutMapping("/{studioStoryId}")
    @Operation(
            summary = "스토리 수정",
            description = "특정 스토리의 내용을 수정합니다."
    )
    public ResponseEntity<?> saveStory(
            @PathVariable final Long studioId,
            @PathVariable final Long studioStoryId,
            @RequestBody String storyData,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        storyService.saveStory(studioId, userId, studioStoryId, storyData);
        return ResponseEntity.ok(ApiResponse.success("Save Success"));
    }

    @PostMapping("/{studioStoryId}/upload/{toStudioId}")
    @Operation(
            summary = "스토리 업로드",
            description = "특정 스토리를 다른 스튜디오에 업로드합니다."
    )
    public ResponseEntity<?> uploadStory(
            @PathVariable final Long studioId,
            @PathVariable final Long toStudioId,
            @PathVariable final Long studioStoryId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        Story story = storyService.findStories(studioId, userId, studioStoryId);
        storyService.uploadStory(userId, story, toStudioId, studioStoryId);
        return ResponseEntity.ok(ApiResponse.success("Upload Success"));
    }

    @GetMapping("/{studioStoryId}/histories")
    @Operation(
            summary = "스토리 수정 이력 조회",
            description = "특정 스토리의 수정 이력을 조회합니다."
    )
    public ResponseEntity<?> findHistories(
            @PathVariable final Long studioId,
            @PathVariable final Long studioStoryId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        List<Story> stories = storyService.findStoryHistory(studioId, userId, studioStoryId);
        List<StoryHistoryFindAllResponse> result = storyService.findAllHistoryDTO(studioId, userId, stories);
        return ResponseEntity.ok(ApiResponse.success(result, "Histories Find Success"));
    }

    @GetMapping("/{studioStoryId}/histories/{storyId}")
    @Operation(
            summary = "특정 버전 스토리 조회",
            description = "특정 버전의 스토리 데이터를 조회합니다."
    )
    public ResponseEntity<?> findHistory(
            @PathVariable final Long studioId,
            @PathVariable final String storyId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        Story story = storyService.findStory(studioId, userId, storyId);
        return ResponseEntity.ok(ApiResponse.success(story.getStoryData(), "Histories Find Success"));
    }

    @PutMapping("/{studioStoryId}/histories/{storyId}")
    @Operation(
            summary = "스토리 롤백",
            description = "특정 버전의 스토리로 롤백합니다."
    )
    public ResponseEntity<?> rollbackStory(
            @PathVariable final Long studioId,
            @PathVariable final Long studioStoryId,
            @PathVariable final String storyId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        log.info("storyId:{}", storyId);
        Story story = storyService.findStory(studioId, userId, storyId);
        storyService.saveStory(studioId, userId, studioStoryId, story.getStoryData());
        return ResponseEntity.ok(ApiResponse.success("Rollback Success"));
    }
}
