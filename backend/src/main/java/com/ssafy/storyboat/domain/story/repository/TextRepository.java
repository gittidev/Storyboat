package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.entity.Text;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TextRepository extends MongoRepository<Text, String> {
    Page<Text> findByStudioStoryIdOrderByDateDesc(Long studioStoryId, Pageable pageable);
}
