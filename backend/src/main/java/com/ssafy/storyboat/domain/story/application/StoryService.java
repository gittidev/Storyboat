package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import com.ssafy.storyboat.domain.story.repository.StoryLogRepository;
import com.ssafy.storyboat.domain.story.repository.StudioStoryRepository;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class StoryService {

    private final UserService userService;
    private final StudioStoryRepository studioStoryRepository;
    private final StoryLogRepository storyLogRepository;
    private final StudioRepository studioRepository;
    private final StudioUserRepository studioUserRepository;

    @Transactional(readOnly = true)
    public Long getUserId(String providerId, String provider) {
        return userService.findUserId(providerId, provider);
    }

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

    public DeleteResult deleteStory(Long userId, Long studioId , Long storyId) {
        // Story 삭제도 Studio 의 Admin 만 삭제 가능!
        StudioUser studioUser = studioUserRepository.findByUser_UserIdAndStudio_StudioId(userId, studioId);
        if (studioUser == null || !studioUser.getRole().equals("ROLE_ADMIN")) {
            return DeleteResult.UNAUTHORIZED;
        }
        // 우선 삭제로 등록
        Optional<StudioStory> optional = studioStoryRepository.findById(storyId);
        if (optional.isPresent()) {
            studioStoryRepository.delete(optional.get());
            return DeleteResult.SUCCESS;
        }
        return DeleteResult.NOT_FOUND;
    }
}
