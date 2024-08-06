package com.ssafy.storyboat.domain.user.application;

import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ConflictException;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.tag.application.TagService;
import com.ssafy.storyboat.domain.tag.dto.ProfileTagUpdateRequest;
import com.ssafy.storyboat.domain.tag.dto.TagRequest;
import com.ssafy.storyboat.domain.tag.entity.ProfileTag;
import com.ssafy.storyboat.domain.tag.entity.Tag;
import com.ssafy.storyboat.domain.tag.repository.ProfileTagRepository;
import com.ssafy.storyboat.domain.tag.repository.TagRepository;
import com.ssafy.storyboat.domain.user.dto.ProfileUpdateRequest;
import com.ssafy.storyboat.domain.user.dto.UserProfileFindDTO;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.ProfileRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileTagRepository profileTagRepository;
    private final TagRepository tagRepository;
    private final StudioUserRepository studioUserRepository;
    private final TagService tagService;

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

    @Transactional(readOnly = true)
    public StudioResponse fetchPrivateStudio(Long userId) {
        return studioUserRepository.findPrivateStudioByUserIdAndRole(userId, Role.ROLE_PRIVATE)
                .orElse(null);  // 유저에게 ROLE_PRIVATE 스튜디오가 없을 경우 null 반환
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
        ;

        // 3. PenName 중복 확인
        if (!profile.getPenName().equals(profileUpdateRequest.getPenName())) {
            if (profileRepository.findByPenName(profileUpdateRequest.getPenName()) != null) {
                throw new ConflictException("PenName already exists");
            }
        }

        // 5. 새로운 태그 추가
        List<ProfileTag> tagList = new ArrayList<>();
        List<Tag> tags = tagRepository.findAll();
        HashMap<Long, Tag> tagMap = new HashMap<>();
        for (Tag tag : tags) {
            tagMap.put(tag.getId(), tag);
        }

        for (ProfileTagUpdateRequest newTag : profileUpdateRequest.getTags()) {
            Tag tag = tagMap.get(newTag.getTagId());
            ProfileTag profileTag = ProfileTag.builder()
                    .tag(tag)
                    .profile(profile)
                    .build();
            tagList.add(profileTag);
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

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.deleteById(userId);
    }

    @Transactional(readOnly = true)
    public UserProfileFindDTO findUser(Long userId) {
        UserProfileFindDTO result = userRepository.findUserProfileByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (result.getIsDelete()) {
            throw new ConflictException("User is deleted");
        }

        Profile profile = profileRepository.findByUser_userId(userId);
        result.setTags(findTags(profile.getProfileId()));
        return result;
    }

    @Transactional(readOnly = true)
    public List<TagRequest> findTags(Long profileId) {
        return tagService.findTagByProfileId(profileId).stream()
                .map(TagRequest::new)
                .collect(Collectors.toList());
    }
}
