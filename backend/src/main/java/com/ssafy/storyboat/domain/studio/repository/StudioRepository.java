package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudioRepository extends JpaRepository<Studio, Long> {
    @Query("select new com.ssafy.storyboat.domain.studio.dto.StudioResponse(s.studioId, s.name, s.description) from Studio s join StudioUser su on s.studioId = su.studio.studioId where su.user.userId = :userId")
    List<StudioResponse> findAllDTOByUserId(@Param("userId") Long userId);

}
