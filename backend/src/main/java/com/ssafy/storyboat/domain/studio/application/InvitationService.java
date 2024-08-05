package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.auth.dto.OAuth2UserDTO;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioOwnerAuthorization;
import com.ssafy.storyboat.domain.studio.entity.Invitation;
import com.ssafy.storyboat.domain.studio.entity.InvitationCode;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.InvitationCodeRepository;
import com.ssafy.storyboat.domain.studio.repository.InvitationRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final StudioService studioService;
    private final InvitationCodeUtil invitationCodeUtil;
    private final InvitationCodeRepository invitationCodeRepository;
    private final StudioRepository studioRepository;
    private final UserService userService;
    private final StudioUserRepository studioUserRepository;
    private final EntityManager entityManager;

    /**
     * Studio 모집글 목록 조회
     * @return
     */
    @Transactional(readOnly = true)
    public List<Invitation> findAll() {
        return invitationRepository.findAll();
    }

    /**
     * Studio 모집글 상세 조회
     * @param studioId
     * @return
     */
    @Transactional(readOnly = true)
    public Invitation findByStudioId(Long studioId) {
        return invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 모집글 존재하지 않음"));
    }

    /**
     * 모집글 작성
     * @param studioId
     * @param userId
     * @param invitation
     */
    @StudioOwnerAuthorization
    public void InvitationSave(Long studioId, Long userId, Invitation invitation) {
        Optional<Invitation> savedInvitation = invitationRepository.findByStudio_studioId(studioId);

        if (savedInvitation.isPresent()) {
            throw new IllegalArgumentException("초대글 이미 존재함");
        }

        Studio studio = studioService.findByStudioId(studioId);

        if (studio.getName().equals("private")) {
            throw new IllegalArgumentException("개인 스튜디오 모집글 작성 X");
        }

        invitation.updateStudio(studio);
        invitationRepository.save(invitation);
    }

    /**
     * 모집글 수정
     * @param studioId
     * @param userId
     * @param invitation
     */

    @StudioOwnerAuthorization
    public void updateInvitation(Long studioId, Long userId, Invitation invitation) {
        Invitation oldInvitation = invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("수정할 모집글 없음"));

        oldInvitation.updateTitle(invitation.getTitle());
        oldInvitation.updateDescription(invitation.getDescription());
        
        invitationRepository.save(oldInvitation);
    }

    /**
     * 모집글 삭제
     * @param studioId
     * @param userId
     */
    @StudioOwnerAuthorization
    public void deleteInvitation(Long studioId, Long userId) {
        Invitation invitation = invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("삭제할 모집글 없음"));
        
        invitationRepository.delete(invitation);
    }

    /**
     * InvitationCode 생성, DB 저장
     * @param studioId
     * @param userId
     * @return InvitationCode
     */
    @StudioOwnerAuthorization
    public String makeInvitationCode(Long studioId, Long userId) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디고 가입 X"));
        if (studioUser.getRole().equals(Role.ROLE_PRIVATE)) {
            throw new IllegalArgumentException("개인 스튜디오에 초디 불가");
        }

        String code = invitationCodeUtil.createCode(studioId, 1000 * 60 * 60 * 7L); // 7일
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new IllegalArgumentException("Studio not found"));
        InvitationCode invitationCode = InvitationCode.builder()
                .studio(studio)
                .code(code)
                .expirationDate(LocalDateTime.now().plusDays(7))
                .build();

        invitationCodeRepository.save(invitationCode);
        return code;
    }

    @StudioOwnerAuthorization
    public InvitationCode findInvitationCode(Long studioId, Long userId) {
        Optional<InvitationCode> code = invitationCodeRepository.findByStudio_StudioId(studioId);
        if (code.isPresent()) {
            InvitationCode invitationCode = code.get();
            if (invitationCode.getExpirationDate().isBefore(LocalDateTime.now())) {
                invitationCodeRepository.delete(invitationCode);
                return null;
            }
            return invitationCode;
        }
        return null;
    }

    @StudioOwnerAuthorization
    @Transactional
    public void deleteInvitationCode(Long studioId, Long userId, Long invitationCodeId) {
        // JPQL을 사용한 삭제
        invitationCodeRepository.deleteByInvitationCodeId(invitationCodeId);
        log.info("InvitationCode 삭제 성공");
    }

    // 해당 코드 조회해 가입시키기...?
    public void joinByCode(Long userId, String invitationCode) {
        // 코드 조회해 검증 로직
        Long studioId = invitationCodeUtil.getStudioId(invitationCode);
        InvitationCode code = invitationCodeRepository.findByStudio_StudioId(studioId)
                .orElseThrow(() -> new IllegalArgumentException("해당 코드 존재 X"));

        log.info("DB 조회 성공");
        if (code.getExpirationDate().isBefore(LocalDateTime.now())) {
            invitationCodeRepository.delete(code);
            throw new IllegalArgumentException("해당 코드 만료");
        }
        log.info("만료 X");
        // 스튜디오에 해당 유저 가입 (Member 로) -> Studio_User Entity 생성하기
        User user = userService.findUserById(userId);

        StudioUser studioUser = StudioUser.builder()
                .studio(studioService.findByStudioId(studioId))
                .user(user)
                .role(Role.ROLE_MEMBER)
                .createdAt(LocalDateTime.now())
                .build();

        studioUserRepository.save(studioUser);
    }

}