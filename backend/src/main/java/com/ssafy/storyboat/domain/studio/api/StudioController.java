package com.ssafy.storyboat.domain.studio.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.dto.StudioCreateRequest;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.dto.StudioUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.ssafy.storyboat.domain.studio.dto.*;
import com.ssafy.storyboat.domain.user.entity.Profile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Transactional
@RequestMapping("/studios")
@Tag(name = "Studio API", description = "스튜디오 관리 API")
public class StudioController {

    private final StudioService studioService;

    @PostMapping
    @Operation(
            summary = "스튜디오 생성",
            description = "새로운 스튜디오를 생성합니다."
    )
    public ResponseEntity<?> createStudio(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody StudioCreateRequest studioCreateRequest) {
        studioService.createStudio(customOAuth2User, studioCreateRequest.getName(), studioCreateRequest.getDescription());
        return ResponseEntity.ok().body(ApiResponse.success("Studio created successfully"));
    }

    @GetMapping
    @Operation(
            summary = "스튜디오 목록 조회",
            description = "사용자가 소속된 모든 스튜디오를 조회합니다."
    )
    public ResponseEntity<?> getStudios(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        List<StudioResponse> studios = studioService.getStudios(customOAuth2User);
        return ResponseEntity.ok().body(ApiResponse.success(studios, "Studios retrieved successfully"));
    }

    @PutMapping("/{studioId}")
    @Operation(
            summary = "스튜디오 수정",
            description = "특정 스튜디오의 정보를 수정합니다."
    )
    public ResponseEntity<?> updateStudio(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable("studioId") Long studioId,
            @RequestBody StudioUpdateRequest studioUpdateRequest) {
        StudioResponse studioResponse = studioService.updateStudio(studioId, customOAuth2User.getUserId(), studioUpdateRequest.getName(), studioUpdateRequest.getDescription());
        return ResponseEntity.ok().body(ApiResponse.success(studioResponse, "Studio updated successfully"));
    }

    @GetMapping("/{studioId}/members")
    public ResponseEntity<?> getStudioMembers(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable("studioId") Long studioId) {
        Long userId = customOAuth2User.getUserId();
        List<StudioMemberFindAllResponse> result = studioService.findStudioUserDTO(studioId, userId);
        return ResponseEntity.ok(ApiResponse.success(result, "Find Studio Members Success"));
    }

    @DeleteMapping("/{studioId}")
    public ResponseEntity<?> deleteStudio(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        studioService.deleteStudio(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok().body(ApiResponse.success("Studio deleted successfully"));
    }

    // 테스트 필요

    /**
     * Studio 에서의 Member 권한 변경 (OWNER 만)
     *
     * @param customOAuth2User
     * @param studioId
     * @param memberId
     * @param roleUpdateRequest
     * @return
     */
    @PutMapping("{studioId}/members/{memberId}/roles")
    public ResponseEntity<?> updateMemberRole(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long memberId, @RequestBody RoleUpdateRequest roleUpdateRequest) {
        Long userId = customOAuth2User.getUserId();
        studioService.updateMemberRole(studioId, userId, memberId, roleUpdateRequest.getRole());
        return ResponseEntity.ok().body(ApiResponse.success("Member Role updated successfully"));
    }

    @DeleteMapping("/{studioId}/members/{memberId}")
    public ResponseEntity<?> deleteMember(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long memberId) {
        Long userId = customOAuth2User.getUserId();
        studioService.deleteMember(studioId, userId, memberId);
        return ResponseEntity.ok().body(ApiResponse.success("Member deleted successfully"));
    }

    @PostMapping("/{studioId}/join-requests")
    public ResponseEntity<?> joinRequests(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        Long userId = customOAuth2User.getUserId();
        studioService.joinRequest(studioId, userId);
        return ResponseEntity.ok(ApiResponse.success("스튜디오 참여 신청 완료"));
    }

    @PutMapping("/{studioId}/join-requests/{memberId}")
    public ResponseEntity<?> acceptJoinRequest(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long memberId, @RequestBody JoinRequestAcceptRequest request) {
        Long userId = customOAuth2User.getUserId();
        boolean result = false;
        if (request.equals("accept")) {
            result = true;
        }
        studioService.acceptRequest(studioId, userId, memberId, result);
        return ResponseEntity.ok(ApiResponse.success("스튜디오 참여 요청 " + (result ? "수락" : "거절")));
    }
}
