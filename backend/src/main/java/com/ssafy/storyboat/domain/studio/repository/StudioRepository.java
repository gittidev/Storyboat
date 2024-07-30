package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioRepository extends JpaRepository<Studio, Long> {
}
