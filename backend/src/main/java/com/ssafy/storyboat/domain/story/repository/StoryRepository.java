package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.entity.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StoryRepository extends MongoRepository<Story, String> {
    // studioStudioStoryId로 조회하며, date를 기준으로 내림차순 정렬
    Page<Story> findByStudioStoryIdOrderByDateDesc(Long studioStoryId, Pageable pageable);
}
