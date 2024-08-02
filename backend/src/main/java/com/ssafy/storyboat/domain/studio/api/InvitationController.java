package com.ssafy.storyboat.domain.studio.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.auth.dto.CustomUserDetails;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.studio.application.InvitationService;
import com.ssafy.storyboat.domain.studio.dto.InvitationFindAllResponse;
import com.ssafy.storyboat.domain.studio.dto.InvitationFindOneResponse;
import com.ssafy.storyboat.domain.studio.dto.InvitationSaveRequest;
import com.ssafy.storyboat.domain.studio.entity.Invitation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    /**
     * Studio 모집글 전체 조회
     * 페이징 필요??
     * @return
     */
    @GetMapping
    public ResponseEntity<?> findAllInvitations() {
        List<Invitation> invitations = invitationService.findAll();
        List<InvitationFindAllResponse> result = invitations.stream()
                .map(InvitationFindAllResponse::new)
                .toList();
        return ResponseEntity.ok().body(ApiResponse.success(result, "모집글 전체 조회"));
    }

    /**
     * Studio 모집글 상세 조회
     * @param studioId
     * @return
     */
    @GetMapping("/{studioId}")
    public ResponseEntity<?> findOneInvitation(@PathVariable Long studioId) {
        Invitation invitation = invitationService.findByStudioId(studioId);
        return ResponseEntity.ok().body(ApiResponse.success(new InvitationFindOneResponse(invitation), "모집글 상세 조회"));
    }

    /**
     * Studio 모집글 작성
     * @param user
     * @param studioId
     * @return
     */
    @PostMapping("/{studioId}")
    public ResponseEntity<?> createInvitation(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId, @RequestBody InvitationSaveRequest invitationSaveRequest) {
        Long userId = user.getUserId();
        Invitation invitation = Invitation.builder()
                .title(invitationSaveRequest.getTitle())
                .description(invitationSaveRequest.getDescription())
                .build();

        invitationService.InvitationSave(studioId, userId, invitation);
        return ResponseEntity.ok().body(ApiResponse.success("모집글 생성 성공"));
    }

    /**
     * Studio 모집글 수정
     * @param user
     * @param studioId
     * @param invitationSaveRequest
     * @return
     */
    @PutMapping("/{studioId}")
    public ResponseEntity<?> updateInvitation(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId, @RequestBody InvitationSaveRequest invitationSaveRequest) {
        Long userId = user.getUserId();
        Invitation invitation = Invitation.builder()
                .title(invitationSaveRequest.getTitle())
                .description(invitationSaveRequest.getDescription())
                .build();

        invitationService.updateInvitation(studioId, userId, invitation);
        return ResponseEntity.ok().body(ApiResponse.success("모집글 수정 성공"));
    }

    /**
     * Studio 모집글 삭제
     * @param user
     * @param studioId
     * @return
     */
    @DeleteMapping("/{studioId}")
    public ResponseEntity<?> deleteInvitation(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId) {
        Long userId = user.getUserId();
        invitationService.deleteInvitation(studioId, userId);
        return ResponseEntity.ok().body(ApiResponse.success("모집글 삭제 성공"));
    }
}
