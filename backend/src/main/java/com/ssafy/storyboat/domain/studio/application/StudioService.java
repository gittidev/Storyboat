package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    public Long findUserId(String providerId, String provider) {
        log.info("provider = " + provider + " providerId = " + providerId);
        return userService.findUserId(providerId, provider);
    }

    @Transactional
    public void createStudio(CustomOAuth2User customOAuth2User, String name, String description) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();

        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            // 1. 유저 조회
            Long userId = findUserId(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                throw new IllegalArgumentException("User not found");
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
            log.error("Error during studio creation", e);
            throw new RuntimeException("Error during studio creation", e);
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
    }

    @Transactional
    public List<StudioResponse> getStudios(String providerId, String provider) {
        Long userId = findUserId(providerId, provider);
        return studioRepository.findAllDTOByUserId(userId);
    }
}
