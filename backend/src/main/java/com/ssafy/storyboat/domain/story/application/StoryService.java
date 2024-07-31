package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.Story;
import com.ssafy.storyboat.domain.story.entity.StoryLog;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import com.ssafy.storyboat.domain.story.repository.StoryLogRepository;
import com.ssafy.storyboat.domain.story.repository.StoryRepository;
import com.ssafy.storyboat.domain.story.repository.StudioStoryRepository;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.User;
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
    private final StoryLogRepository storyLogRepository;
    private final StudioRepository studioRepository;
    private final StudioUserRepository studioUserRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<StoryFindAllResponse> findByStudioId(Long studioId) {
        return studioStoryRepository.findDTOByStudioId(studioId);
    }

    public void makeStory(Long studioId, String title) {
        Studio studio = studioRepository.findById(studioId).get();
        StudioStory studioStory = StudioStory.builder()
                .studio(studio)
                .title(title)
                .build();
        studioStoryRepository.save(studioStory);
    }

    public DeleteResult deleteStory(Long userId, Long studioId , Long studioStoryId) {
        // Story 삭제도 Studio 의 Admin 만 삭제 가능!
        StudioUser studioUser = studioUserRepository.findByUser_UserIdAndStudio_StudioId(userId, studioId);
        if (studioUser == null || !studioUser.getRole().equals("ROLE_ADMIN")) {
            return DeleteResult.UNAUTHORIZED;
        }
        // 우선 삭제로 등록
        Optional<StudioStory> optional = studioStoryRepository.findById(studioStoryId);
        if (optional.isPresent()) {
            studioStoryRepository.delete(optional.get());
            return DeleteResult.SUCCESS;
        }
        return DeleteResult.NOT_FOUND;
    }

    public boolean findStory(Long studioStoryId) {
        Optional<StudioStory> studioStory = studioStoryRepository.findById(studioStoryId);
        studioStory.get().getStoryLogs()

    }

    public boolean saveStory(Long studioStoryId, Long userId, String storyData) {
        try {
            // MongoDB에 저장
            Story story = Story.builder()
                    .studioStoryId(studioStoryId)
                    .date(LocalDateTime.now())
                    .StoryData(storyData)
                    .build();

            storyRepository.save(story);

            // RDB story_log에 저장
            Optional<StudioStory> studioStoryOpt = studioStoryRepository.findById(studioStoryId);
            Optional<User> userOpt = userRepository.findById(userId);

            if (studioStoryOpt.isPresent() && userOpt.isPresent()) {
                StudioStory studioStory = studioStoryOpt.get();
                User user = userOpt.get();

                StoryLog storyLog = StoryLog.builder()
                        .user(user)
                        .studioStory(studioStory)
                        .key(story.getStudioStoryId())
                        .build();

                storyLogRepository.save(storyLog);
            } else {
                // 적절한 예외 처리
                throw new RuntimeException("StudioStory or User not found");
            }

            return true;
        } catch (Exception e) {
            // 예외 처리
            e.printStackTrace();
            return false;
        }
    }
}
