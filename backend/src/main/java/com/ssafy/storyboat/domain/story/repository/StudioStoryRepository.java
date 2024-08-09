package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudioStoryRepository extends JpaRepository<StudioStory, Long> {

    @Query("SELECT new com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse(s.studioStoryId, s.title, s.lastModifiedDate) FROM StudioStory s WHERE s.studio.studioId = :studioId")
    Page<StoryFindAllResponse> findDTOByStudioId(@Param("studioId") Long studioId, Pageable pageable);
}
