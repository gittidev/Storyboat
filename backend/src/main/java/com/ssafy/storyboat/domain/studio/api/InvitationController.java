package com.ssafy.storyboat.domain.studio.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.PageResponse;
import com.ssafy.storyboat.domain.studio.application.InvitationService;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.dto.Invitation.InvitationFindAllResponse;
import com.ssafy.storyboat.domain.studio.dto.Invitation.InvitationFindOneResponse;
import com.ssafy.storyboat.domain.studio.dto.Invitation.InvitationSaveRequest;
import com.ssafy.storyboat.domain.studio.entity.Invitation;
import com.ssafy.storyboat.domain.studio.entity.InvitationCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/invitations")
@RequiredArgsConstructor
@Slf4j
public class InvitationController {

    private final InvitationService invitationService;

    /**
     * Studio 모집글 전체 조회
     * 페이징 필요??
     * @return
     */
    @GetMapping
    public ResponseEntity<?> findAllInvitations(Pageable pageable) {
        Page<Invitation> invitations = invitationService.findAll(pageable);

        List<InvitationFindAllResponse> responseList = invitations.stream()
                .map(InvitationFindAllResponse::new)
                .collect(Collectors.toList());
        //Page<InvitationFindAllResponse> result = new PageImpl<>(responseList, pageable, invitations.getTotalElements());
        Page<InvitationFindAllResponse> pages = new PageImpl<>(responseList, pageable, invitations.getTotalElements());
        PageResponse result = new PageResponse(pages);

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
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    @PostMapping("/{studioId}")
    public ResponseEntity<?> createInvitation(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId, @RequestBody InvitationSaveRequest invitationSaveRequest) {
        Long userId = user.getUserId();
        Invitation invitation = Invitation.builder()
                .title(invitationSaveRequest.getTitle())
                .description(invitationSaveRequest.getDescription())
                .invitationTags(new ArrayList<>())
                .build();

        InvitationFindAllResponse result = invitationService.InvitationSave(studioId, userId, invitation, invitationSaveRequest.getTags());
        return ResponseEntity.ok().body(ApiResponse.success(result, "모집글 생성 성공"));
    }

    /**
     * Studio 모집글 수정
     * @param user
     * @param studioId
     * @param invitationSaveRequest
     * @return
     */
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    @PutMapping("/{studioId}")
    public ResponseEntity<?> updateInvitation(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId, @RequestBody InvitationSaveRequest invitationSaveRequest) {
        Long userId = user.getUserId();
        Invitation invitation = Invitation.builder()
                .title(invitationSaveRequest.getTitle())
                .description(invitationSaveRequest.getDescription())
                .build();

        InvitationFindAllResponse result = invitationService.updateInvitation(studioId, userId, invitation, invitationSaveRequest.getTags());
        return ResponseEntity.ok().body(ApiResponse.success(result, "모집글 수정 성공"));
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

    @PostMapping("/code/{studioId}")
    public ResponseEntity<?> makeInvitationCode(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId) {
        Long userId = user.getUserId();
        String code = invitationService.makeInvitationCode(studioId, userId);
        return ResponseEntity.ok(ApiResponse.success("https://i11c107.p.ssafy.io/api/invitations/code/join/" + code, "모집 코드 생성 성공"));
    }

    @GetMapping("/code/{studioId}")
    public ResponseEntity<?> showInvitationCode(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId) {
        Long userId = user.getUserId();
        InvitationCode invitationCode = invitationService.findInvitationCode(studioId, userId);
        if (invitationCode == null) {
            return ResponseEntity.ok(ApiResponse.success("코드가 없습니다."));
        }
        return ResponseEntity.ok(ApiResponse.success("https://i11c107.p.ssafy.io/api/invitations/code/join/" + invitationCode.getCode(), "모집 코드 조회 성공"));
    }

    @DeleteMapping("/code/{studioId}")
    public ResponseEntity<?> deleteInvitationCode(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable Long studioId) {
        Long userId = user.getUserId();
        InvitationCode invitationCode = invitationService.findInvitationCode(studioId, userId);
        log.info("invitationCodeID={}", invitationCode.getInvitationCodeId());
        invitationService.deleteInvitationCode(studioId, userId, invitationCode.getInvitationCodeId());
        return ResponseEntity.ok(ApiResponse.success("초대 코드 삭제 성공"));
    }

    @GetMapping("/code/join/{invitationCode}")
    public ResponseEntity<?> joinByCode(@AuthenticationPrincipal final CustomOAuth2User user, @PathVariable String invitationCode) {

        log.info("들어옴");

        if (user == null) {
            // 처리 필요
            return ResponseEntity.ok(ApiResponse.success("Asdfadsf"));
        }

        Long userId = user.getUserId();
        invitationService.joinByCode(userId, invitationCode);
        return ResponseEntity.ok(ApiResponse.success("초대 코드로 가입 성공"));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String category, @RequestParam String keyword, Pageable pageable) {
        // category = studioName or title // or tag
        Page<Invitation> invitations = invitationService.searchInvitation(category, keyword, pageable);

        List<InvitationFindAllResponse> responseList = invitations.stream()
                .map(InvitationFindAllResponse::new)
                .collect(Collectors.toList());
        Page<InvitationFindAllResponse> pages = new PageImpl<>(responseList, pageable, invitations.getTotalElements());
        PageResponse result = new PageResponse(pages);

        return ResponseEntity.ok(ApiResponse.success(result, "모집글 검색 성공"));
    }
}
