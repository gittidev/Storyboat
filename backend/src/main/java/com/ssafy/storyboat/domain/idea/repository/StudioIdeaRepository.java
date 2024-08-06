package com.ssafy.storyboat.domain.idea.repository;

import com.ssafy.storyboat.domain.idea.dto.IdeaResponse;
import com.ssafy.storyboat.domain.idea.entity.StudioIdea;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudioIdeaRepository extends JpaRepository<StudioIdea, Long> {
    @Query("SELECT new com.ssafy.storyboat.domain.idea.dto.IdeaResponse(si.studioIdeaId, si.title, si.content) " +
            "FROM StudioIdea si WHERE si.studio.studioId = :studioId")
    List<IdeaResponse> findByStudioId(Long studioId);
}
