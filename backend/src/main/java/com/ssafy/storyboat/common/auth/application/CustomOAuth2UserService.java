package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.auth.dto.*;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.s3.Bucket;
import com.ssafy.storyboat.common.s3.S3Repository;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
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
    private final S3Repository s3Repository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
//        log.info("OAuth2User : {}", oAuth2User);

        OAuth2Response oAuth2Response = null;
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
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

//            log.info("providerId={} and provider={} and email={}", providerId, provider, email);

            User queriedUser = entityManager.createQuery("select m from User m where m.providerId = :providerId and m.provider = :provider", User.class)
                    .setParameter("providerId", providerId)
                    .setParameter("provider", provider)
                    .getSingleResult();

            log.info(queriedUser.toString());
            OAuth2UserDTO userDTO = new OAuth2UserDTO();;
            userDTO.setName(name);
            userDTO.setUsername(providerId + " " + provider);
            userDTO.setRole("ROLE_USER");
            if (queriedUser.getIsDeleted()) {
                queriedUser.revokeUser();
                userDTO.setJoinStatus(CustomJoinStatus.REVOKED);
                log.info("유저 복구={}", userDTO);
            } else {
                // 로그인 로직 (사용자 정보 처리 등)
                userDTO.setJoinStatus(CustomJoinStatus.JOINED);
                log.info("로그인={}", userDTO);
            }
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
                        .isDeleted(false)
                        .studioUsers(new ArrayList<>())
                        .build();

                entityManager.persist(joinUser);

                // 1.5
                String defaultProfileImageUrl = s3Repository.uploadDefaultProfileImage(Bucket.PROFILE);
                // 2. profile 생성해 persist
                String DEFAULT_PEN_NAME = "익명의 작가";
                Profile joinUserProfile = Profile.builder()
                        .penName(DEFAULT_PEN_NAME + "_" + customUUID)
                        .imageUrl(defaultProfileImageUrl)
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

                // 5. 기본 캐릭터 생성해 영속
                StudioCharacter studioCharacter = makeDefaultCharacter(studio);
                entityManager.persist(studioCharacter);
                entityManager.persist(studioUser);

                entityManager.getTransaction().commit();  // 트랜잭션 커밋

                OAuth2UserDTO userDTO = new OAuth2UserDTO();
                userDTO.setName(name);
                userDTO.setUsername(providerId + " " + provider);
                userDTO.setJoinStatus(CustomJoinStatus.JOINED);
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

    private StudioCharacter makeDefaultCharacter(Studio studio) {
        return StudioCharacter.builder()
                .name("히카리")
                .description("히카리는 순수한 마음을 가진 초등학생으로, 피아노 연주를 사랑하는 소녀입니다. " +
                        "음악에 대한 깊은 애정과 천부적인 재능을 가지고 있습니다. 그녀는 연주로 사람들의 마음을 감동시킵니다. " +
                        "성격은 밝고 친절하며, 친구들과의 관계를 소중히 여기고 있습니다. 히카리는 매일 연습을 통해 더욱 뛰어난 피아니스트가 되기를 꿈꾸며, " +
                        "그녀의 음악은 듣는 이들에게 평화와 행복을 가져다줍니다. 그녀의 순수함과 열정은 주변 사람들에게 긍정적인 영향을 미칩니다.")
                .tags("피아노, 순수, 음악")
                .imageUrl("https://storyboat-character.s3.ap-northeast-2.amazonaws.com/img1.jpg")
                .studio(studio)
                .build();
    }
}
