package com.ssafy.storyboat.domain.user.application;

import com.ssafy.storyboat.domain.tag.entity.ProfileTag;
import com.ssafy.storyboat.domain.tag.entity.Tag;
import com.ssafy.storyboat.domain.tag.repository.ProfileTagRepository;
import com.ssafy.storyboat.domain.tag.repository.TagRepository;
import com.ssafy.storyboat.domain.user.dto.ProfileFindResponse;
import com.ssafy.storyboat.domain.user.dto.UserFindResponse;
import com.ssafy.storyboat.domain.user.dto.ProfileUpdateRequest;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.ProfileRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileTagRepository profileTagRepository;
    private final TagRepository tagRepository;

    @Transactional
    public UserFindResponse fetchSingleUser(String providerId, String provider) {

        log.info("provider = " + provider + " providerId = " + providerId);
        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);

        return new UserFindResponse(user.getUserId(), profile.getPenName());
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
    public ProfileFindResponse fetchSingleProfile(String providerId, String provider) {
        //log.info("provider = " + provider + " providerId = " + providerId);
        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);

        ProfileFindResponse profileFindResponse = new ProfileFindResponse();
        profileFindResponse.setPenName(profile.getPenName());

        return profileFindResponse;
    }

    @Transactional
    public boolean updateUserProfile(String providerId, String provider, ProfileUpdateRequest profileUpdateRequest) {

        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);
        // 1. 해당 유저의 PenName 이 변경됬는지 확인
        if (!profile.getPenName().equals(profileUpdateRequest.getPenName())) {
            // 1.5 . 변경됬다면 PenName 이 중복되는지 확인 -> 중복시 false
            if (profileRepository.findByPenName(profileUpdateRequest.getPenName()) != null) {
                return false;
            }
        }
        // 2. 기존 Tag 모두 삭제
        profileTagRepository.deleteByProfileId(profile.getProfileId());

        // 3. 새로운 태그 추가
        List<ProfileTag> tagList = new ArrayList<>();

        // 4. 태그들 조회해 생성할 Profile Entity 와 연관관계 맺기!
        List<Tag> tags = tagRepository.findAllByOrderByIdDesc();

        for (ProfileTag profileTag : profile.getProfileTags()) {
            Tag tag = tags.get(profileTag.getId().intValue() - 1);
            ProfileTag profileTag1 = ProfileTag.builder()
                    .profile(profile)
                    .tag(tag)
                    .build();

            tagList.add(profileTag1);
        }

        //
        Profile updatedProfile = Profile.builder()
                .user(user)
                .profileId(profile.getProfileId())
                .penName(profileUpdateRequest.getPenName())
                .introduction(profileUpdateRequest.getIntroduction())
                .imageUrl(profileUpdateRequest.getImageUrl())
                .profileTags(tagList)
                .build();

        profileRepository.save(updatedProfile);
        return true;
    }
}
