package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.dto.StudioUpdateResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

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

    @Transactional
    public void createStudio(CustomOAuth2User customOAuth2User, String name, String description) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();

        ApiResponse<?> response = null;
        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            // 1. 유저 조회
            Long userId = userService.findUserId(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
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
                    .role("ROLE_LEADER")
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
    public List<StudioResponse> getStudios(String providerId, String provider) {
        Long userId = userService.findUserId(providerId, provider);
        return studioRepository.findAllDTOByUserId(userId);
    }

    @Transactional
    public StudioResponse updateStudio(CustomOAuth2User customOAuth2User, Long studioId, String name, String description) {
        // 1. 유저 조회
        Long userId = userService.findUserId(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 2. 스튜디오 사용자 조회
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new IllegalArgumentException("StudioUser not found"));

        // 사용자가 소유하지 않는 스튜디오거나, 권한이 팀장이 아니거나 개인 스튜디오가 아닌 경우 예외 발생
        if (!studioUser.getRole().equals("ROLE_LEADER") && !studioUser.getRole().equals("ROLE_PRIVATE")) {
            throw new UnauthorizedException("Unauthorized");
        }

        // 3. 스튜디오 조회 및 수정
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ForbiddenException("Studio not found"));

        studio.updateStudioName(name);
        studio.updateStudioDescription(description);

        return new StudioResponse(studio.getStudioId(), studio.getName(), studio.getDescription());
    }
}
