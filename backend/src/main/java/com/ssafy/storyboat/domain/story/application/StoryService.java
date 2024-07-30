package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import com.ssafy.storyboat.domain.story.repository.StoryLogRepository;
import com.ssafy.storyboat.domain.story.repository.StudioStoryRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class StoryService {

    private final UserService userService;
    private final StudioStoryRepository studioStoryRepository;
    private final StoryLogRepository storyLogRepository;

    @Transactional(readOnly = true)
    public Long getUserId(String providerId, String provider) {
        return userService.findUserId(providerId, provider);
    }

    @Transactional(readOnly = true)
    public List<StoryFindAllResponse> findByStudioId(Long studioId) {
        return studioStoryRepository.findDTOByStudioId(studioId);
    }

    public void makeStory(Long studioId, String title) {
        StudioStory studioStory = StudioStory.builder()
                //.studio()
                .title(title)
                .build();

    }
}
