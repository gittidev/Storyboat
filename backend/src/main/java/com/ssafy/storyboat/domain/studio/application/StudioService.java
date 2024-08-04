package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ConflictException;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioOwnerAuthorization;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.dto.StudioMemberFindAllResponse;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Invitation;
import com.ssafy.storyboat.domain.studio.entity.InvitationCode;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.InvitationCodeRepository;
import com.ssafy.storyboat.domain.studio.repository.InvitationRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudioService {

    private final UserService userService;
    private final StudioRepository studioRepository;
    private final EntityManagerFactory entityManagerFactory;
    private final UserRepository userRepository;
    private final StudioUserRepository studioUserRepository;
    private final InvitationCodeUtil invitationCodeUtil;
    private final InvitationRepository invitationRepository;
    private final InvitationCodeRepository invitationCodeRepository;


    @Transactional(readOnly = true)
    public StudioUser isCharacterSendAuthorized(Long studioId, Long userId, Long targetStudioId) {
        StudioUser targetStudioUser = isWriteAuthorized(targetStudioId, userId);
        StudioUser thisStudioUser = isOwnerAuthorized(studioId, userId);

        if (thisStudioUser.getRole() != Role.ROLE_PRIVATE) {
            throw new ForbiddenException("캐릭터 전송 권한 없음");
        }
        return targetStudioUser;
    }


    @Transactional(readOnly = true)
    public StudioUser isOwnerAuthorized(Long studioId, Long userId) {
        StudioUser studioUser = isWriteAuthorized(studioId, userId);
        if (studioUser.getRole() != Role.ROLE_OWNER && studioUser.getRole() != Role.ROLE_PRIVATE) {
            throw new ForbiddenException("Studio 관리 권한 없음");
        }
        return studioUser;
    }

    @Transactional(readOnly = true)
    public StudioUser isReadAuthorized(Long studioId, Long userId) {
        log.info("studioId: " + studioId + ", userId: " + userId);
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio 접근 권한 없음"));
        if (studioUser.getRole() == Role.ROLE_REQUESTER) {
            throw new ForbiddenException("Studio 접근 권한 없음");
        }
        return studioUser;
    }

    @Transactional(readOnly = true)
    public StudioUser isWriteAuthorized(Long studioId, Long userId) {
        StudioUser studioUser = isReadAuthorized(studioId, userId);
        if (studioUser.getRole() == Role.ROLE_REQUESTER) {
            throw new ForbiddenException("Studio 수정 권한 없음");
        }
        return studioUser;
    }

    @Transactional
    public void createStudio(CustomOAuth2User customOAuth2User, String name, String description) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();

        ApiResponse<?> response = null;
        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            // 1. 유저 조회
            Long userId = customOAuth2User.getUserId();
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                throw new UnauthorizedException("User not found");
            }

            // 2. 개인 스튜디오 생성해 영속
            Studio studio = Studio.builder()
                    .name(name)
                    // description은 null이 입력된다면 ""으로 초기화
                    .description(description == null ? "" : description)
                    .studioUsers(new ArrayList<>())
                    .build();

            entityManager.persist(studio);

            // 3. StudioUser 생성해 persist
            StudioUser studioUser = StudioUser.builder()
                    .user(user)
                    .studio(studio)
                    .role(Role.ROLE_OWNER)
                    .createdAt(LocalDateTime.now())
                    .build();

            entityManager.persist(studioUser);

            entityManager.getTransaction().commit();  // 트랜잭션 커밋
        } catch (PersistenceException e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
        }
    }

    @Transactional
    public List<StudioResponse> getStudios(CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        return studioRepository.findAllDTOByUserId(userId);
    }

    @Transactional
    @StudioOwnerAuthorization
    public StudioResponse updateStudio(Long studioId, Long userId, String name, String description) {

        // 1. 스튜디오 조회 및 수정
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ForbiddenException("Studio not found"));

        studio.updateStudioName(name);
        studio.updateStudioDescription(description);

        return new StudioResponse(studio.getStudioId(), studio.getName(), studio.getDescription());
    }

    @Transactional(readOnly = true)
    @StudioReadAuthorization
    public List<Profile> findStudioUser(Long studioId, Long userId) {
        return studioUserRepository.findAllProfiles(studioId);
    }

    @Transactional(readOnly = true)
    @StudioReadAuthorization
    public List<StudioMemberFindAllResponse> findStudioUserDTO(Long studioId, Long userId) {
        return studioUserRepository.findAllProfileDTOS(studioId);

    }

    /**
     * Studio 에서 Member 의 권한 설정
     * @param studioId
     * @param userId
     * @param memberId
     * @param role
     */
    @StudioOwnerAuthorization
    public void updateMemberRole(Long studioId, Long userId, Long memberId, Role role) {
        // 1. ROLE 조회 (ROLE_OWNER or ROLE_VIEWER or ROLE_MEMBER)
        if (!(Role.ROLE_OWNER.equals(role) || Role.ROLE_MEMBER.equals(role) || Role.ROLE_VIEWER.equals(role))) {
            throw new IllegalArgumentException("설정할 수 없는 권한: " + role);
        }

        // 2. 해당 유저의 ROLE 세팅
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new ConflictException("해당 유저 Studio 에 존재하지 않음"));

        studioUser.updateRole(role);
        studioUserRepository.save(studioUser);
    }

    /**
     * Studio 에서 Member 추방
     * @param studioId
     * @param userId
     * @param memberId
     */
    @StudioOwnerAuthorization
    public void deleteMember(Long studioId, Long userId, Long memberId) {
        // 1. Member 가 OWNER 인지 확인
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저 Studio 에 존재하지 않음"));

        if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("OWNER 사용자는 추방할 수 없음");
        }

        // 2. Member 추방
        studioUserRepository.delete(studioUser);
    }

    @Transactional(readOnly = true)
    public Studio findByStudioId(Long studioId) {
        return studioRepository.findById(studioId)
                .orElseThrow(() -> new IllegalArgumentException("Studio not found"));
    }

    @StudioOwnerAuthorization
    public void deleteStudio(Long studioId, Long userId) {
        studioRepository.deleteById(studioId);  // 관련된 모든 엔티티가 하드 딜리트
    }

    /**
     * InvitationCode 생성, DB 저장
     * @param studioId
     * @param userId
     * @return InvitationCode
     */
    @StudioOwnerAuthorization
    public String makeInvitationCode(Long studioId, Long userId) {
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
    public void deleteInvitationCode(Long studioId, Long userId, Long invitationCodeId) {
        invitationCodeRepository.deleteById(invitationCodeId);
    }

    // 해당 코드 조회해 가입시키기...?
    public void joinByCode(Long userId, String invitationCode) {
        // 코드 조회해 검증 로직
        Long studioId = invitationCodeUtil.getStudioId(invitationCode);
        InvitationCode code = invitationCodeRepository.findByStudio_StudioId(studioId)
                .orElseThrow(() -> new IllegalArgumentException("해당 코드 존재 X"));

        if (code.getExpirationDate().isBefore(LocalDateTime.now())) {
            invitationCodeRepository.delete(code);
            throw new IllegalArgumentException("해당 코드 만료");
        }

        // 스튜디오에 해당 유저 가입 (Member 로) -> Studio_User Entity 생성하기
        User user = userService.findUserById(userId);

        StudioUser studioUser = StudioUser.builder()
                .user(user)
                .role(Role.ROLE_MEMBER)
                .createdAt(LocalDateTime.now())
                .build();

        studioUserRepository.save(studioUser);
    }

}
