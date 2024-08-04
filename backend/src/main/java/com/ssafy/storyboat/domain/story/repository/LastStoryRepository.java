package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.entity.LastStory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LastStoryRepository extends MongoRepository<LastStory, String> {
    Optional<LastStory> findLastStoryByStudioStoryId(Long studioStoryId);
}
