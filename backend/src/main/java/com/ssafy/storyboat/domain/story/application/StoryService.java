package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.common.dto.PageResponse;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.dto.StoryHistoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.LastStory;
import com.ssafy.storyboat.domain.story.entity.Story;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import com.ssafy.storyboat.domain.story.repository.LastStoryRepository;
import com.ssafy.storyboat.domain.story.repository.StoryRepository;
import com.ssafy.storyboat.domain.story.repository.StudioStoryRepository;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioWriteAuthorization;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.entity.Profile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final LastStoryRepository lastStoryRepository;

    @Transactional(readOnly = true)
    @StudioReadAuthorization
    public Page<StoryFindAllResponse> findByStudioId(Long studioId, Long userId, Pageable pageable) {
        return studioStoryRepository.findDTOByStudioId(studioId, pageable);
    }

    @StudioWriteAuthorization
    public StudioStory makeStory(Long studioId, Long userId, String title) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("스튜디오 찾을 수 없음"));
        StudioStory studioStory = StudioStory.builder()
                .studio(studio)
                .title(title)
                .lastModifiedDate(LocalDateTime.now())
                .build();

        studioStoryRepository.save(studioStory);
        return studioStory;
    }

    @StudioWriteAuthorization
    public void deleteStory(Long studioId, Long userId, Long studioStoryId) {
        // Story 삭제도 Studio 의 Admin 만 삭제 가능!
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("스튜디오 찾을 수 없음"));

        if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("권한 없음");
        }

        // 우선 삭제로 등록
        StudioStory studioStory = studioStoryRepository.findById(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("스토리 찾을 수 없음"));

        studioStoryRepository.delete(studioStory);
    }

    @StudioWriteAuthorization
    public void saveStory(Long studioId, Long userId, Long studioStoryId, String storyData) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("스튜디오 찾을 수 없음"));
        if (!(studioUser.getRole().equals(Role.ROLE_OWNER) || studioUser.getRole().equals(Role.ROLE_MEMBER) || studioUser.getRole().equals(Role.ROLE_PRIVATE))) {
            throw new ForbiddenException("권한 없음");
        }

        StudioStory studioStory = studioStoryRepository.findById(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스토리 없음"));

        studioStory.updateLastModified(LocalDateTime.now());
        studioStoryRepository.save(studioStory);

        // 1. LastStory 조회
        Optional<LastStory> lastStory = lastStoryRepository.findLastStoryByStudioStoryId(studioStoryId);

        try {
            // 최신 수정본이 존재한다면 해당 최신 수정본 TTL 적용
            log.info("최신 수정본을 조회하고 있다면 삭제");
            if (lastStory.isPresent()) {
                Story savedStory = Story.builder()
                        .studioStoryId(studioStoryId) // 스튜디오 매핑
                        .userId(lastStory.get().getUserId()) // user 매핑
                        .date(lastStory.get().getDate()) // 등록일 (TTL 7일)
                        .storyData(lastStory.get().getStoryData()) // Json 데이터
                        .build();
                lastStoryRepository.delete(lastStory.get());
                storyRepository.save(savedStory);
            }

            // 3. 현재 수정본 MongoDB에 저장
            LastStory newStory = LastStory.builder()
                    .studioStoryId(studioStoryId)
                    .userId(userId)
                    .date(LocalDateTime.now())
                    .storyData(storyData)
                    .build();
            lastStoryRepository.save(newStory);

        } catch (Exception e) {
            // 예외 처리
            throw new InternalServerErrorException("MongoDB 저장 오류");
        }
    }

    @StudioWriteAuthorization
    public void uploadStory(Long toStudioId, Long userId, LastStory story, Long studioStoryId) {

        StudioStory studioStory = studioStoryRepository.findById(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("스토리 찾을 수 없음"));

        Studio studio = studioRepository.findById(toStudioId)
                .orElseThrow(() -> new ResourceNotFoundException("스튜디오 찾을 수 없음"));

        StudioStory saveStudioStory = StudioStory.builder()
                .studio(studio)
                .lastModifiedDate(LocalDateTime.now())
                .title(studioStory.getTitle())
                .build();

        studioStoryRepository.save(saveStudioStory);

        LastStory copyStory = LastStory.builder()
                .studioStoryId(saveStudioStory.getStudioStoryId())
                .userId(userId)
                .date(LocalDateTime.now())
                .storyData(story.getStoryData())
                .build();
        try {
            // MongoDB에 저장
            lastStoryRepository.save(copyStory);
        } catch (Exception e) {
            // 예외 처리
            throw new InternalServerErrorException("MongoDB 저장 오류");
        }
    }

    @StudioReadAuthorization
    public Page<Story> findStoryHistory(Long studioId, Long userId, Long studioStoryId, Pageable pageable) {
        return storyRepository.findByStudioStoryIdOrderByDateDesc(studioStoryId, pageable);
    }

    @StudioReadAuthorization
    public PageResponse findAllHistoryDTO(Long studioId, Long userId, Page<Story> stories) {
        List<Profile> profiles = studioService.findStudioUser(studioId, userId);
        HashMap<Long, Profile> profileMap = new HashMap<>();
        for (Profile profile : profiles) {
            profileMap.put(profile.getUser().getUserId(), profile);
        }
        List<StoryHistoryFindAllResponse> responses = new ArrayList<>();
        for (Story story : stories.getContent()) {
            Profile profile = profileMap.get(story.getUserId());
            StoryHistoryFindAllResponse tmp = StoryHistoryFindAllResponse.builder()
                    .storyId(story.getStoryId())
                    .dateTime(story.getDate())
                    .penName(profile.getPenName())
                    .imageUrl(profile.getImageUrl())
                    .build();
            responses.add(tmp);
        }
        PageResponse result = new PageResponse();
        result.setContent(responses);
        result.setSize(stories.getSize());
        result.setTotalElements(stories.getTotalElements());
        result.setTotalPages(stories.getTotalPages());
        return result;
    }

    @StudioReadAuthorization
    @Transactional(readOnly = true)
    public Story findStory(Long studioId, Long userId,  String storyId) {
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("스토리를 찾을 수 없음"));

    }

    @StudioReadAuthorization
    @Transactional(readOnly = true)
    public LastStory findLastStory(Long studioId, Long userId,  Long studioStoryId) {
        return lastStoryRepository.findLastStoryByStudioStoryId(studioStoryId).orElse(null);
    }

}
