package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.entity.LastText;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LastTextRepository extends MongoRepository<LastText, String> {
    Optional<LastText> findLastTextByStudioStoryId(Long studioStoryId);
}
