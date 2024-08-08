package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.*;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioOwnerAuthorization;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.dto.StudioMemberFindAllResponse;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
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

    private final StudioRepository studioRepository;
    private final EntityManagerFactory entityManagerFactory;
    private final StudioUserRepository studioUserRepository;
    private final UserService userService;


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
        if (studioUser.getRole() == Role.ROLE_VIEWER) {
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
                throw new UnauthorizedException("로그인 유저 정보 조회 실패");
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
            throw new InternalServerErrorException("DB 저장 실패");
        }
    }

    @Transactional
    public List<StudioResponse> getStudios(CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        return studioRepository.findAllDTOByUserId(userId);
    }

    @Transactional
    @StudioReadAuthorization
    public StudioResponse getStudio(Long studioId, Long userId) {
        return studioRepository.findDTOByStudioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재하지 않음"));
    }

    @Transactional
    @StudioOwnerAuthorization
    public StudioResponse updateStudio(Long studioId, Long userId, String name, String description) {

        // 1. 스튜디오 조회 및 수정
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재하지 않음"));

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
            throw new ForbiddenException("설정할 수 없는 권한: " + role);
        }

        // 2. 해당 유저의 ROLE 세팅
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 유저 Studio 에 존재하지 않음"));

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
                .orElseThrow(() -> new ResourceNotFoundException("해당 유저 Studio 에 존재하지 않음"));

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
//        List<StudioCharacter> characters = characterRepository.findByStudioId(studioId);
//        for (StudioCharacter character : characters) {
//            if (character.getImageUrl() != null) {
//                String imageKey = character.getImageUrl().substring(character.getImageUrl().lastIndexOf('/') + 1);
//                amazonS3.deleteObject(new DeleteObjectRequest(bucket, imageKey));
//            }
//            characterRepository.delete(character);
//        }
        studioRepository.deleteById(studioId);  // 관련된 모든 엔티티가 하드 딜리트
    }

    // 스튜디오 가입 신청 로직
    public void joinRequest(Long studioId, Long userId) {
        User user = userService.findUserById(userId);

        Studio studio = findByStudioId(studioId);

        if (studio.getName().equals("private")) {
            throw new ConflictException("개인 스튜디오 가입 불가");
        }

        Optional<StudioUser> pastStudioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId);
        if (pastStudioUser.isPresent()) {
            throw new ConflictException("이미 가입된 스튜디오");
        }

        StudioUser studioUser = StudioUser.builder()
                .createdAt(LocalDateTime.now())
                .user(user)
                .studio(studio)
                .role(Role.ROLE_REQUESTER)
                .build();

        studioUserRepository.save(studioUser);
    }

    // 스튜디오 가입신청 수락 로직
    @StudioOwnerAuthorization
    public void acceptRequest(Long studioId, Long userId, Long memberId, boolean result) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("회원 가입 신청 내역 없음"));

        if (!studioUser.getRole().equals(Role.ROLE_REQUESTER)) {
            throw new ResourceNotFoundException("회원 가입 신청 내역 없음");
        }
        if (result) {
            studioUser.updateRole(Role.ROLE_MEMBER);
            studioUserRepository.save(studioUser);
        } else {
            // 삭제 연산...
            studioUserRepository.delete(studioUser);
        }

    }

    public void leaveStudio(Long studioId, Long userId) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 유저 Studio 에 존재하지 않음"));

        if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("OWNER 권한은 탈퇴할 수 없음");
        }

        // 2. Member 추방
        studioUserRepository.delete(studioUser);
    }

    public Role findMYRole(Long studioId, Long userID) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userID)
                .orElseThrow(() -> new ForbiddenException("스튜디오 가입되지 않은 유저"));

        return studioUser.getRole();
    }
}