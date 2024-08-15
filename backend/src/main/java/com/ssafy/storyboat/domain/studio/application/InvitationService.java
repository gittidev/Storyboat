package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ConflictException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioOwnerAuthorization;
import com.ssafy.storyboat.domain.studio.dto.Invitation.InvitationFindAllResponse;
import com.ssafy.storyboat.domain.studio.entity.*;
import com.ssafy.storyboat.domain.studio.repository.InvitationCodeRepository;
import com.ssafy.storyboat.domain.studio.repository.InvitationRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.tag.dto.ProfileTagUpdateRequest;
import com.ssafy.storyboat.domain.tag.entity.Tag;
import com.ssafy.storyboat.domain.tag.repository.InvitationTagRepository;
import com.ssafy.storyboat.domain.tag.repository.TagRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    private final TagRepository tagRepository;
    private final InvitationTagRepository invitationTagRepository;

    /**
     * Studio 모집글 목록 조회
     * @return
     */
    @Transactional(readOnly = true)
    public Page<Invitation> findAll(Pageable pageable) {
//        return invitationRepository.findAllWithInvitationTags(pageable);
        return invitationRepository.findAll(pageable);
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
    public InvitationFindAllResponse InvitationSave(Long studioId, Long userId, Invitation invitation, List<ProfileTagUpdateRequest> tagRequests) {
        Optional<Invitation> savedInvitation = invitationRepository.findByStudio_studioId(studioId);

        if (savedInvitation.isPresent()) {
            throw new ConflictException("초대글 이미 존재함");
        }

        Studio studio = studioService.findByStudioId(studioId);

        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재 X"));
        if (studioUser.getRole().equals(Role.ROLE_PRIVATE)) {
            throw new ConflictException("개인 스튜디오에 초대 불가");
        }

        invitation.updateStudio(studio);
        List<InvitationTag> tags = new ArrayList<>();

        // 중복된 태그 제거
        Set<Long> uniqueTagIds = tagRequests.stream()
                .map(ProfileTagUpdateRequest::getTagId)
                .collect(Collectors.toSet());

        for (Long tagId : uniqueTagIds) {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new ResourceNotFoundException("태그가 존재하지 않음"));
            InvitationTag invitationTag = InvitationTag.builder()
                    .tag(tag)
                    .invitation(invitation)
                    .build();
            tags.add(invitationTag);
        }
        invitation.setInvitationTags(tags);
        invitationRepository.save(invitation);

        return new InvitationFindAllResponse(invitation);
    }

    /**
     * 모집글 수정
     * @param studioId
     * @param userId
     * @param invitation
     */
    @Transactional
    @StudioOwnerAuthorization
    public InvitationFindAllResponse updateInvitation(Long studioId, Long userId, Invitation invitation, List<ProfileTagUpdateRequest> tagRequests) {
        Invitation oldInvitation = invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("수정할 모집글 없음"));

        oldInvitation.updateTitle(invitation.getTitle());
        oldInvitation.updateDescription(invitation.getDescription());

        // 새로운 태그 추가 (중복 제거)
        Set<Long> uniqueTagIds = tagRequests.stream()
                .map(ProfileTagUpdateRequest::getTagId)
                .collect(Collectors.toSet());

        List<InvitationTag> tags = new ArrayList<>();

        for (Long tagId : uniqueTagIds) {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new ResourceNotFoundException("태그가 존재하지 않음"));

            InvitationTag invitationTag = InvitationTag.builder()
                    .tag(tag)
                    .invitation(oldInvitation)
                    .build();

            tags.add(invitationTag);
        }

        oldInvitation.setInvitationTags(tags);

        invitationRepository.save(oldInvitation);
        return new InvitationFindAllResponse(oldInvitation);
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
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 가입 X"));
        if (studioUser.getRole().equals(Role.ROLE_PRIVATE)) {
            throw new ConflictException("개인 스튜디오에 초대 불가");
        }

//        Optional<InvitationCode> oldCode = invitationCodeRepository.findByStudio_StudioId(studioId);
//        // 코드 존재 여부 확인
//        if (oldCode.isPresent()) {
//            InvitationCode invitationCode = oldCode.get();
//            // 코드 만료 여부 확인
//            if (invitationCode.getExpirationDate().isBefore(LocalDateTime.now())) {
//                invitationCodeRepository.delete(invitationCode);
//            }
//            else {
//                throw new ConflictException("해당 스튜디오 초대코드 존재");
//            }
//        }

        String code = invitationCodeUtil.createCode(studioId, 1000 * 60 * 60 * 7L); // 7일
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재 X"));
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
        log.info("모집 코드 삭제 성공");
    }

    // 해당 코드 조회해 가입시키기...?
    public void joinByCode(Long userId, String invitationCode) {
        // 코드 조회해 검증 로직
        Long studioId = invitationCodeUtil.getStudioId(invitationCode);
        InvitationCode code = invitationCodeRepository.findByStudio_StudioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 코드 존재 X"));

        log.info("DB 조회 성공");
        if (code.getExpirationDate().isBefore(LocalDateTime.now())) {
            invitationCodeRepository.delete(code);
            throw new ResourceNotFoundException("해당 코드 만료");
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
    
    @Transactional(readOnly = true)
    public Page<Invitation> searchInvitation(String category, String keyword, Pageable pageable) {
        Page<Invitation> invitations;
        if (category.equals("studioName")) {
            invitations = invitationRepository.findByStudio_NameContains(keyword, pageable);
        } else if (category.equals("title")) {
            invitations = invitationRepository.findByTitleContains(keyword, pageable);
        }
        // 음.. 태그 검색은 추후 추가
//        else if (category.equals("tag")) {
//
//        }
        else {
            throw new ConflictException("검색 조건 없음");
        }
        return invitations;
    }
}