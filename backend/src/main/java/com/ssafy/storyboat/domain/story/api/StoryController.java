package com.ssafy.storyboat.domain.story.api;

import com.ssafy.storyboat.common.api.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.story.application.DeleteResult;
import com.ssafy.storyboat.domain.story.application.StoryService;
import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private ResponseEntity<ApiResponse<List<StoryFindAllResponse>>> findAllStories(@PathVariable final Long studioId) {
        List<StoryFindAllResponse> list = storyService.findByStudioId(studioId);
        return ResponseEntity.ok(ApiResponse.success(list, "Stories Find Success"));
    }

    // 스튜디오에 스토리 생성
    @PostMapping()
    private ResponseEntity<ApiResponse<Void>> createStory(@PathVariable final Long studioId, @RequestBody Map<String, Object> payload) {
        storyService.makeStory(studioId, (String)payload.get("title"));
        return ResponseEntity.ok(ApiResponse.success("Stories Create Success"));
    }

    // 스토리 삭제
    @DeleteMapping("/{studioStoryId}")
    private ResponseEntity<ApiResponse<Void>> deleteStory(@PathVariable final Long studioId, @PathVariable final Long studioStoryId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();

        DeleteResult result = storyService.deleteStory(userId, studioId, studioStoryId);

        if (result == DeleteResult.SUCCESS) {
            return ResponseEntity.ok(ApiResponse.success("Delete Success"));
        } else if (result == DeleteResult.UNAUTHORIZED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("권한 없음"));
        } else if (result == DeleteResult.NOT_FOUND) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("이미 삭제됨"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("서버 오류"));
        }
    }

    // 스토리 세부 조회
    @GetMapping("/{studioStoryId}") ResponseEntity<ApiResponse<Void>> findStory(@PathVariable final Long studioId, @PathVariable final Long studioStoryId) {

        return null;
    }

    // 스토리 수정(저장)
    @PutMapping("/{studioStoryId}") ResponseEntity<ApiResponse<Void>> saveStory(@PathVariable final Long studioId, @PathVariable final Long studioStoryId, @RequestBody String storyData) {

        boolean result = storyService.saveStory(studioId, studioStoryId, storyData);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("Save Success"));
        }
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Save Error"));
        }
    }

    // 스토리 업로드
    @PostMapping("/{studioStoryId}/{toStudioId}") ResponseEntity<ApiResponse<Void>> uploadStory(@PathVariable final Long studioId, @PathVariable final Long toStudioId, @PathVariable final Long studioStoryId) {

        return null;
    }

    // 스토리 수정 History 조회
    @GetMapping("/{studioStoryId}/histories") ResponseEntity<ApiResponse<Void>> findHistories(@PathVariable final Long studioId, @PathVariable final Long studioStoryId) {

        return null;
    }

    // 해당 버전 스토리 조회(미리보기)
    @GetMapping("/{studioStoryId}/histories/{histudioStoryId}") ResponseEntity<ApiResponse<Void>> findHistory(@PathVariable final Long studioId, @PathVariable final Long histudioStoryId) {

        return null;
    }

    // 스토리 롤백
    @PutMapping("/{studioStoryId}/histories/{histudioStoryId}") ResponseEntity<ApiResponse<Void>> rollbackStory (@PathVariable final Long studioId, @PathVariable final Long histudioStoryId) {

        return null;
    }
}
