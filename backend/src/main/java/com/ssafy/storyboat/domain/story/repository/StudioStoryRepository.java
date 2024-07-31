package com.ssafy.storyboat.domain.story.repository;

import com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudioStoryRepository extends JpaRepository<StudioStory, Long> {

    @Query("SELECT new com.ssafy.storyboat.domain.story.dto.StoryFindAllResponse(s.id, s.title) FROM StudioStory s WHERE s.studio.id = :studioId")
    List<StoryFindAllResponse> findDTOByStudioId(@Param("studioId") Long studioId);


}
