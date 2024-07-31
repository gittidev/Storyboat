package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.entity.StoryLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryLogRepository extends JpaRepository<StoryLog, Long> {
    StoryLog findTop1ByStudioStory_studioStoryIdOrderByDateDesc(Long studioStoryId);
}
