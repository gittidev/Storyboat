package com.ssafy.storyboat.domain.user.application;

import com.ssafy.storyboat.domain.tag.entity.ProfileTag;
import com.ssafy.storyboat.domain.tag.repository.ProfileTagRepository;
import com.ssafy.storyboat.domain.user.dto.SingleProfileResponseDTO;
import com.ssafy.storyboat.domain.user.dto.FetchSingleUserResponseDTO;
import com.ssafy.storyboat.domain.user.dto.UpdateProfileRequestDTO;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.ProfileRepository;
import com.ssafy.storyboat.domain.user.repository.RefreshTokenRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileTagRepository profileTagRepository;

    @Transactional
    public FetchSingleUserResponseDTO fetchSingleUser(String providerId, String provider) {

        log.info("provider = " + provider + " providerId = " + providerId);
        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);

        return new FetchSingleUserResponseDTO(user.getUserId(), profile.getPenName());
    }

    @Transactional(readOnly = true)
    public boolean searchPenName(String penName) {
        log.info("Searching for penName: {}", penName);
        Profile profile = profileRepository.findByPenName(penName);
        if (profile != null) {
            log.info("Found penName: {}", profile.getPenName());
            return true;
        } else {
            log.info("PenName not found: {}", penName);
            return false;
        }
    }

    @Transactional(readOnly = true)
    public SingleProfileResponseDTO fetchSingleProfile(String providerId, String provider) {
        //log.info("provider = " + provider + " providerId = " + providerId);
        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);

        SingleProfileResponseDTO singleProfileResponseDto = new SingleProfileResponseDTO();
        singleProfileResponseDto.setPenName(profile.getPenName());

        return singleProfileResponseDto;
    }

    @Transactional
    public boolean updateUserProfile(String providerId, String provider, UpdateProfileRequestDTO updateProfileRequestDTO) {

        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);
        // 1. 해당 유저의 PenName 이 변경됬는지 확인
        if (!profile.getPenName().equals(updateProfileRequestDTO.getPenName())) {
            // 1.5 . 변경됬다면 PenName 이 중복되는지 확인 -> 중복시 false
            if (profileRepository.findByPenName(updateProfileRequestDTO.getPenName()) != null) {
                return false;
            }
        }
        // 2. 기존 Tag 모두 삭제
        profileTagRepository.deleteByProfileId(profile.getProfileId());

        // 3. 새로운 태그 추가
        List<ProfileTag> tagList = new ArrayList<>();
        for (ProfileTag profileTag : profile.getProfileTags()) {
            Optional<ProfileTag> optionalTag = profileTagRepository.findById(profileTag.getId());
            optionalTag.ifPresent(tagList::add); // 값이 존재할 때만 리스트에 추가
        }

        // 4. 태그들 조회해 생성할 Profile Entity 와 연관관계 맺기!
        Profile updatedProfile = Profile.builder()
                .user(user)
                .profileId(profile.getProfileId())
                .penName(updateProfileRequestDTO.getPenName())
                .introduction(updateProfileRequestDTO.getIntroduction())
                .imageUrl(updateProfileRequestDTO.getImageUrl())
                .profileTags(tagList)
                .build();

        profileRepository.save(updatedProfile);
        return true;
    }
}
