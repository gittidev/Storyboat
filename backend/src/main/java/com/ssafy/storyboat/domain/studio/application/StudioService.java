package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class StudioService {

    private final UserService userService;
    private final StudioRepository studioRepository;
    private final EntityManagerFactory entityManagerFactory;
    private final UserRepository userRepository;
    private final StudioUserRepository studioUserRepository;


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

    @Transactional
    @StudioReadAuthorization
    public List<Profile> findStudioUser(Long studioId, Long userId) {
        return studioUserRepository.findAllProfiles(studioId);
    }
}
