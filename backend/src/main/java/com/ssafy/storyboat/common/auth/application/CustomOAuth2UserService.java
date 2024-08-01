package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.auth.dto.*;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final EntityManagerFactory entityManagerFactory;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {


        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("OAuth2User : {}", oAuth2User);

        OAuth2Response oAuth2Response = null;
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            log.info("registrationID 에서 막힘 = {}", registrationId);
            return null;
        }

        String providerId = oAuth2Response.getProviderId();
        String provider = oAuth2Response.getProvider();
        String email = oAuth2Response.getEmail();
        String name = oAuth2Response.getName();
        String currentTime = String.valueOf(Instant.now().getEpochSecond());

        EntityManager entityManager = entityManagerFactory.createEntityManager();

        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            log.info("providerId={} and provider={} and email={}", providerId, provider, email);

            User queriedUser = entityManager.createQuery("select m from User m where m.providerId = :providerId and m.provider = :provider", User.class)
                    .setParameter("providerId", providerId)
                    .setParameter("provider", provider)
                    .getSingleResult();

            log.info(queriedUser.toString());

            // 로그인 로직 (사용자 정보 처리 등)
            OAuth2UserDTO userDTO = new OAuth2UserDTO();
            userDTO.setName(name);
            userDTO.setUsername(providerId + " " + provider);
            userDTO.setRole("ROLE_USER");
            userDTO.setJoinStatus(false);
            log.info("로그인={}", userDTO);

            entityManager.getTransaction().commit();

            return new CustomOAuth2User(userDTO);

        // 회원가입 로직 -> 조회시 반환값 없을때
        } catch (NoResultException e) {

            try {
                UUID customUUID = generateUUIDFromString(currentTime + name);

                // 1. User 생성해 persist
                User joinUser = User.builder()
                        .email(email)
                        .providerId(providerId)
                        .provider(provider)
                        .studioUsers(new ArrayList<>())
                        .build();

                entityManager.persist(joinUser);

                // 2. profile 생성해 persist
                String DEFAULT_PEN_NAME = "익명의 작가";
                Profile joinUserProfile = Profile.builder()
                        .penName(DEFAULT_PEN_NAME + "_" + customUUID)
                        .imageUrl("")
                        .introduction("")
                        .user(joinUser)  // 양방향 관계 설정
                        .build();

                entityManager.persist(joinUserProfile);

                // 3. 개인 스튜디오 생성해 영속
                Studio studio = Studio.builder()
                        .name("private")
                        .description("private")
                        .studioUsers(new ArrayList<>())
                        .build();

                entityManager.persist(studio);

                // 4. StudioUser 생성해 persist
                StudioUser studioUser = StudioUser.builder()
                        .user(joinUser)
                        .studio(studio)
                        .role(Role.ROLE_PRIVATE)
                        .createdAt(LocalDateTime.now())
                        .build();


                entityManager.persist(studioUser);

                // Repository 생성해서 User-Repository 추가하기!

//                // 1. StudioUser Entity 생성
//                StudioUser studioUser = StudioUser.builder()
//                        .user(joinUser)
//                        .role("ROLE_PRIVATE")
//                        .build();


                entityManager.getTransaction().commit();  // 트랜잭션 커밋

                OAuth2UserDTO userDTO = new OAuth2UserDTO();
                userDTO.setName(name);
                userDTO.setUsername(providerId + " " + provider);
                userDTO.setJoinStatus(true);
                userDTO.setRole("ROLE_USER");

                log.info("회원가입={}", joinUser.getEmail());

                return new CustomOAuth2User(userDTO);

            } catch (PersistenceException e2) {
                // 예외 처리: 트랜잭션 롤백 및 오류 로그 기록
                if (entityManager.getTransaction().isActive()) {
                    entityManager.getTransaction().rollback();
                }
                // 예외를 재던지거나 적절한 처리
                log.info(e2.getMessage());
                throw new RuntimeException("Error during user registration", e2);
            }

        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("Unexpected error", e);
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();  // EntityManager 닫기
            }
        }
    }

    private static UUID generateUUIDFromString(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));

            long mostSigBits = 0;
            long leastSigBits = 0;
            for (int i = 0; i < 8; i++) {
                mostSigBits = (mostSigBits << 8) | (hashBytes[i] & 0xff);
            }
            for (int i = 8; i < 16; i++) {
                leastSigBits = (leastSigBits << 8) | (hashBytes[i] & 0xff);
            }

            return new UUID(mostSigBits, leastSigBits);

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-1 algorithm not found", e);
        }
    }
}
