package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.auth.dto.*;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.s3.Bucket;
import com.ssafy.storyboat.common.s3.S3Repository;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.character.repository.CharacterRepository;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.ProfileRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
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

    private final UserRepository userRepository;
    private final StudioUserRepository studioUserRepository;
    private final CharacterRepository studioCharacterRepository;
    private final StudioRepository studioRepository;

    private final S3Repository s3Repository;

    @Override
    @Transactional(readOnly = true)
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

        User queriedUser = userRepository.findByProviderIdAndProvider(providerId, provider);

        // 로그인 로직
        if (queriedUser != null) {
            return new CustomOAuth2User(getoAuth2UserDTO(queriedUser, name, providerId, provider));
        }
        // 회원가입 로직 -> 조회시 반환값 없을때
        else {

            User joinUser = getJoinUser(currentTime, name, email, providerId, provider);
            extracted(joinUser);

            OAuth2UserDTO userDTO = new OAuth2UserDTO();
            userDTO.setName(name);
            userDTO.setUsername(providerId + " " + provider);
            userDTO.setJoinStatus(CustomJoinStatus.JOINED);
            userDTO.setRole("ROLE_USER");

            log.info("회원가입={}", joinUser.getEmail());

            return new CustomOAuth2User(userDTO);
        }
    }

    // 스튜디오, 캐릭터, 스튜디오 유저 관계 테이블 생성
    @Transactional
    protected void extracted(User joinUser) {
        // 3. 개인 스튜디오 생성해 영속
        Studio studio = Studio.builder()
                .name("private")
                .description("private")
                .studioUsers(new ArrayList<>())
                .studioCharacters(new ArrayList<>())
                .build();

        // Studio 저장
        Studio savedStudio = studioRepository.save(studio); // Studio를 먼저 저장

        // 4. StudioUser 생성해 persist
        StudioUser studioUser = StudioUser.builder()
                .user(joinUser)
                .studio(savedStudio) // 저장된 Studio를 설정
                .role(Role.ROLE_PRIVATE)
                .createdAt(LocalDateTime.now())
                .build();

        // StudioUser 저장
        studioUserRepository.save(studioUser);

        // 5. 기본 캐릭터 생성해 영속
        StudioCharacter studioCharacter = makeDefaultCharacter(savedStudio);
        studioCharacter.updateStudio(savedStudio); // Studio를 업데이트 (필요 시)

        // StudioCharacter 저장
        // Assuming you have a repository for StudioCharacter
        studioCharacterRepository.save(studioCharacter);
    }


    @Transactional
    protected User getJoinUser(String currentTime, String name, String email, String providerId, String provider) {
        UUID customUUID = generateUUIDFromString(currentTime + name);

        // 1. User 생성
        User joinUser = User.builder()
                .email(email)
                .providerId(providerId)
                .provider(provider)
                .isDeleted(false)
                .studioUsers(new ArrayList<>())
                .profile(null) // profile은 일단 null로 설정
                .build();

        // 2. Profile 생성
        String defaultProfileImageUrl = s3Repository.uploadDefaultProfileImage(Bucket.PROFILE);
        String DEFAULT_PEN_NAME = "익명의 작가";
        Profile joinUserProfile = Profile.builder()
                .penName(DEFAULT_PEN_NAME + "_" + customUUID)
                .imageUrl(defaultProfileImageUrl)
                .introduction("")
                .user(joinUser) // Profile에 User 설정
                .build();

        // 3. User에 Profile 설정
        joinUser.updateProfile(joinUserProfile);

        // 4. User 저장
        userRepository.save(joinUser);

        return joinUser;
    }


    // 로그인, 유저 복구시 유저 세팅 메서드
    @Transactional
    protected OAuth2UserDTO getoAuth2UserDTO(User queriedUser, String name, String providerId, String provider) {
        log.info(queriedUser.toString());
        OAuth2UserDTO userDTO = new OAuth2UserDTO();
        ;
        userDTO.setName(name);
        userDTO.setUsername(providerId + " " + provider);
        userDTO.setRole("ROLE_USER");
        if (queriedUser.getIsDeleted()) {
            queriedUser.revokeUser();
            userRepository.save(queriedUser);
            userDTO.setJoinStatus(CustomJoinStatus.REVOKED);
            log.info("유저 복구={}", userDTO);
        } else {
            // 로그인 로직 (사용자 정보 처리 등)
            userDTO.setJoinStatus(CustomJoinStatus.JOINED);
            log.info("로그인={}", userDTO);
        }
        return userDTO;
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
            throw new InternalServerErrorException("SHA-1 algorithm not found");
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
