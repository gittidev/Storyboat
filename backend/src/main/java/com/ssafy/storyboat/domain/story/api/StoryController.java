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
    @DeleteMapping("/{storyId}")
    private ResponseEntity<ApiResponse<Void>> deleteStory(@PathVariable final Long studioId, @PathVariable final Long storyId, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();

        DeleteResult result = storyService.deleteStory(userId, studioId, storyId);

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
    @GetMapping("/{storyId}") ResponseEntity<ApiResponse<Void>> findStory(@PathVariable final Long studioId, @PathVariable final Long storyId) {

        return null;
    }

    // 스토리 수정(저장)
    @PutMapping("/{storyId}") ResponseEntity<ApiResponse<Void>> saveStory(@PathVariable final Long studioId, @PathVariable final Long storyId) {

        return null;
    }

    // 스토리 업로드
    @PostMapping("/{storyId}/{toStudioId}") ResponseEntity<ApiResponse<Void>> uploadStory(@PathVariable final Long studioId, @PathVariable final Long toStudioId, @PathVariable final Long storyId) {

        return null;
    }

    // 스토리 수정 History 조회
    @GetMapping("/{storyId}/histories") ResponseEntity<ApiResponse<Void>> findHistories(@PathVariable final Long studioId, @PathVariable final Long storyId) {

        return null;
    }

    // 해당 버전 스토리 조회(미리보기)
    @GetMapping("/{storyId}/histories/{historyId}") ResponseEntity<ApiResponse<Void>> findHistory(@PathVariable final Long studioId, @PathVariable final Long historyId) {

        return null;
    }

    // 스토리 롤백
    @PutMapping("/{storyId}/histories/{historyId}") ResponseEntity<ApiResponse<Void>> rollbackStory (@PathVariable final Long studioId, @PathVariable final Long historyId) {

        return null;
    }
}
