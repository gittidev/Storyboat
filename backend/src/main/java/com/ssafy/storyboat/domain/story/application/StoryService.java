package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.dto.StoryHistoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.Story;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import com.ssafy.storyboat.domain.story.repository.StoryRepository;
import com.ssafy.storyboat.domain.story.repository.StudioStoryRepository;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class StoryService {

    private final StudioStoryRepository studioStoryRepository;
    private final StudioRepository studioRepository;
    private final StudioUserRepository studioUserRepository;
    private final StoryRepository storyRepository;
    private final StudioService studioService;
    private final UserRepository userRepository;


    @Transactional(readOnly = true)
    @CheckAuthorization
    public List<StoryFindAllResponse> findByStudioId(Long studioId, Long userId) {
        return studioStoryRepository.findDTOByStudioId(studioId);
    }

    @CheckAuthorization
    public void makeStory(Long studioId, Long userId, String title) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio not found"));
        StudioStory studioStory = StudioStory.builder()
                .studio(studio)
                .title(title)
                .build();
        studioStoryRepository.save(studioStory);
    }

    @CheckAuthorization
    public void deleteStory(Long studioId, Long userId, Long studioStoryId) {
        // Story 삭제도 Studio 의 Admin 만 삭제 가능!
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio not found"));

        if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("권한 없음");
        }

        // 우선 삭제로 등록
        StudioStory studioStory = studioStoryRepository.findById(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio story not found"));

        studioStoryRepository.delete(studioStory);
    }

    @Transactional(readOnly = true)
    @CheckAuthorization
    public Story findStories(Long studioId, Long userId, Long studioStoryId) {
        return storyRepository.findTopByStudioStoryIdOrderByDateDesc(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("스토리 조회 실패"));
    }

    @CheckAuthorization
    public void saveStory(Long studioId, Long userId, Long studioStoryId, String storyData) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio not found"));
        if (!(studioUser.getRole().equals(Role.ROLE_OWNER) || studioUser.getRole().equals(Role.ROLE_MEMBER) || studioUser.getRole().equals(Role.ROLE_PRIVATE))) {
            throw new ForbiddenException("권한 없음");
        }

        try {
            // MongoDB에 저장
            Story story = Story.builder()
                    .studioStoryId(studioStoryId) // 스튜디오 매핑
                    .userId(userId) // user 매핑
                    .date(LocalDateTime.now()) // 등록일 (TTL 7일)
                    .storyData(storyData) // Json 데이터
                    .build();

            storyRepository.save(story);
        } catch (Exception e) {
            // 예외 처리
            throw new InternalServerErrorException("MongoDB 저장 오류");
        }
    }

    @CheckAuthorization
    public void uploadStory(Long userId, Story story, Long toStudioId, Long studioStoryId) {

        StudioStory studioStory = studioStoryRepository.findById(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio_Story not found"));

        Studio studio = studioRepository.findById(toStudioId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio not found"));

        StudioStory saveStudioStory = StudioStory.builder()
                .studio(studio)
                .title(studioStory.getTitle())
                .build();

        studioStoryRepository.save(saveStudioStory);

        Story copyStory = Story.builder()
                .studioStoryId(toStudioId)
                .userId(userId)
                .date(LocalDateTime.now())
                .storyData(story.getStoryData())
                .build();
        try {
            // MongoDB에 저장
            storyRepository.save(copyStory);
        } catch (Exception e) {
            // 예외 처리
            throw new InternalServerErrorException("MongoDB 저장 오류");
        }
    }

    @CheckAuthorization
    public List<Story> findStoryHistory(Long studioId, Long userId, Long studioStoryId) {
        return storyRepository.findByStudioStoryIdOrderByDateDesc(studioStoryId);
    }

    @CheckAuthorization
    public List<StoryHistoryFindAllResponse> findAllHistoryDTO(Long studioId, Long userId, List<Story> stories) {
        List<Profile> profiles = studioService.findStudioUser(studioId, userId);
        HashMap<Long, Profile> profileMap = new HashMap<>();
        for (Profile profile : profiles) {
            log.info("id={}, profile.penName: {}", profile.getUser().getUserId(), profile.getPenName());
            profileMap.put(profile.getUser().getUserId(), profile);
        }
        List<StoryHistoryFindAllResponse> responses = new ArrayList<>();
        for (Story story : stories) {
            log.info("story.id={}, story.userId={}", story.getStoryId(), story.getUserId());
            Profile profile = profileMap.get(story.getUserId());
            log.info("profile.penName={}", profile.getPenName());
            StoryHistoryFindAllResponse tmp = StoryHistoryFindAllResponse.builder()
                    .storyId(story.getStoryId())
                    .dateTime(story.getDate())
                    .penName(profile.getPenName())
                    .imageUrl(profile.getImageUrl())
                    .build();
            responses.add(tmp);
        }
        return responses;
    }

    @CheckAuthorization
    @Transactional(readOnly = true)
    public Story findStory(Long studioId, Long userId,  String storyId) {
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

    }
}
