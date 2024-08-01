package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.Story;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import com.ssafy.storyboat.domain.story.repository.StoryRepository;
import com.ssafy.storyboat.domain.story.repository.StudioStoryRepository;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    public void deleteStory(Long userId, Long studioId , Long studioStoryId) {
        // Story 삭제도 Studio 의 Admin 만 삭제 가능!
        StudioUser studioUser = studioUserRepository.findByUser_UserIdAndStudio_StudioId(userId, studioId);
        if (studioUser == null) {
            throw new ResourceNotFoundException("Studio not found");
        }
        else if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("권한 없음");
        }
        // 우선 삭제로 등록
        StudioStory studioStory = studioStoryRepository.findById(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio story not found"));

        studioStoryRepository.delete(studioStory);
    }

    @Transactional(readOnly = true)
    @CheckAuthorization
    public Story findStory(Long studioStoryId, Long userId) {

        return storyRepository.findTopByStudioStoryIdOrderByDateDesc(studioStoryId)
                .orElseThrow(() -> new ResourceNotFoundException("스토리 조회 실패"));
    }

    @CheckAuthorization
    public void saveStory(Long studioId, Long userId, Long studioStoryId, String storyData) {
        StudioUser studioUser = studioUserRepository.findByUser_UserIdAndStudio_StudioId(userId, studioId);
        if (studioUser == null) {
            throw new ResourceNotFoundException("StudioUser not found");
        }
        else if (!(studioUser.getRole().equals(Role.ROLE_OWNER) || studioUser.getRole().equals(Role.ROLE_MEMBER) || studioUser.getRole().equals(Role.ROLE_PRIVATE))) {
            throw new ForbiddenException("권한 없음");
        }

        try {
            // MongoDB에 저장
            Story story = Story.builder()
                    .studioStoryId(studioStoryId) // 스튜디오 매핑
                    .userId(userId) // user 매핑
                    .date(LocalDateTime.now()) // 등록일 (TTL 7일)
                    .StoryData(storyData) // Json 데이터
                    .build();

            storyRepository.save(story);
        } catch (Exception e) {
            // 예외 처리
            throw new InternalServerErrorException("MongoDB 저장 오류");
        }
    }

    @CheckAuthorization
    public void uploadStory(Story story, Long studioId, Long userId) {
        Story copyStory = Story.builder()
                .studioStoryId(studioId)
                .userId(userId)
                .date(LocalDateTime.now())
                .StoryData(story.getStoryData())
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
    public List<Story> findStoryHistory(Long userId, Long studioId) {
        return storyRepository.findByStudioStoryIdOrderByDateDesc(studioId);
    }
}
