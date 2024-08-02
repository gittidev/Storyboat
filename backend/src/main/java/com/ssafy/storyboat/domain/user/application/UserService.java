package com.ssafy.storyboat.domain.user.application;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.exception.ConflictException;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
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
import org.springframework.data.crossstore.ChangeSetPersister;
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
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public void searchPenName(String penName) {
        log.info("Searching for penName: {}", penName);
        Profile profile = profileRepository.findByPenName(penName);
        if (profile != null) {
            throw new ConflictException("PenName already exists");
        }
    }

    @Transactional(readOnly = true)
    public Profile fetchSingleProfile(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new UnauthorizedException("User not found");
        }
        Profile profile = profileRepository.findByUser(user.get());
        if (profile == null) {
            throw new ForbiddenException("Profile not found");
        }
        return profile;
    }

    @Transactional
    public void updateUserProfile(Long userId, ProfileUpdateRequest profileUpdateRequest) {
        // 1. 사용자 조회 및 존재 여부 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. 프로필 조회
        Profile profile = profileRepository.findByUser(user);
        if (profile == null) {
            throw new ResourceNotFoundException("Profile not found");
        }

        // 3. PenName 중복 확인
        if (!profile.getPenName().equals(profileUpdateRequest.getPenName())) {
            if (profileRepository.findByPenName(profileUpdateRequest.getPenName()) != null) {
                throw new ConflictException("PenName already exists");
            }
        }

        // 4. 기존 태그 삭제
        profileTagRepository.deleteByProfileId(profile.getProfileId());

        // 5. 새로운 태그 추가
        List<ProfileTag> tagList = new ArrayList<>();
        List<Tag> tags = tagRepository.findAllByOrderByIdDesc();

        for (ProfileTag profileTag : profile.getProfileTags()) {
            if (profileTag.getId() >= 1 && profileTag.getId() <= tags.size()) {
                Tag tag = tags.get(profileTag.getId().intValue() - 1);
                ProfileTag newProfileTag = ProfileTag.builder()
                        .profile(profile)
                        .tag(tag)
                        .build();
                tagList.add(newProfileTag);
            }
        }

        // 6. 프로필 업데이트
        profile.updatePenName(profileUpdateRequest.getPenName());
        profile.updateIntroduction(profileUpdateRequest.getIntroduction());
        profile.updateImageUrl(profileUpdateRequest.getImageUrl());
        profile.updateProfileTags(tagList);

        profileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

}
