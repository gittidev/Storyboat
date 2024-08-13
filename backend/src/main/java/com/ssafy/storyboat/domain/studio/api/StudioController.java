package com.ssafy.storyboat.domain.studio.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.Role;
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
        return ResponseEntity.ok().body(ApiResponse.success("스튜디오 생성 성공"));
    }

    @GetMapping
    @Operation(
            summary = "스튜디오 목록 조회",
            description = "사용자가 소속된 모든 스튜디오를 조회합니다."
    )
    public ResponseEntity<?> getStudios(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        List<StudioResponse> studios = studioService.getStudios(customOAuth2User);
        return ResponseEntity.ok().body(ApiResponse.success(studios, "참여 스튜디오 목록 조회 성공"));
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
        return ResponseEntity.ok().body(ApiResponse.success(studioResponse, "스튜디오 설정 변경 성공"));
    }

    @GetMapping("/{studioId}")
    @Operation(
            summary = "스튜디오 상세 조회",
            description = "스튜디오 ID로 특정 스튜디오를 조회합니다."
    )
    public ResponseEntity<?> getStudio(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        StudioResponse studio = studioService.getStudio(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok().body(ApiResponse.success(studio, "스튜디오 상세 조회 성공"));
    }

    @GetMapping("/{studioId}/members")
    public ResponseEntity<?> getStudioMembers(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable("studioId") Long studioId) {
        Long userId = customOAuth2User.getUserId();
        List<StudioMemberFindAllResponse> result = studioService.findStudioUserDTO(studioId, userId);
        return ResponseEntity.ok(ApiResponse.success(result, "팀원 목록 조회 성공"));
    }

    @DeleteMapping("/{studioId}")
    public ResponseEntity<?> deleteStudio(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        studioService.deleteStudio(studioId, customOAuth2User.getUserId());
        return ResponseEntity.ok().body(ApiResponse.success("스튜디오 삭제 성공"));
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
        log.info("Role: {}", roleUpdateRequest.getRole());
        Long userId = customOAuth2User.getUserId();
        studioService.updateMemberRole(studioId, userId, memberId, roleUpdateRequest.getRole());
        return ResponseEntity.ok().body(ApiResponse.success("팀원 권한 설정 변경 성공"));
    }

    @DeleteMapping("/{studioId}/members/{memberId}")
    public ResponseEntity<?> deleteMember(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId, @PathVariable Long memberId) {
        Long userId = customOAuth2User.getUserId();
        studioService.deleteMember(studioId, userId, memberId);
        return ResponseEntity.ok().body(ApiResponse.success("팀원 추방 성공"));
    }

    @DeleteMapping("/{studioId}/members")
    public ResponseEntity<?> leaveStudio(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        studioService.leaveStudio(studioId,  customOAuth2User.getUserId());
        return ResponseEntity.ok().body(ApiResponse.success("스튜디오 탈퇴 성공"));
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
        boolean result = request.getDecision().equals("accept");
        studioService.acceptRequest(studioId, userId, memberId, result);
        return ResponseEntity.ok(ApiResponse.success("스튜디오 참여 요청 " + (result ? "수락" : "거절")));
    }

    @GetMapping("/{studioId}/my")
    public ResponseEntity<?> findMyRole(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        Long userId = customOAuth2User.getUserId();
        Role role = studioService.findMYRole(studioId, userId);
        return ResponseEntity.ok(ApiResponse.success(role, "유저 권한 조회 성공"));
    }
}
