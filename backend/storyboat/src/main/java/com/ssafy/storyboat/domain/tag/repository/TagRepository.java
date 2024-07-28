package com.ssafy.storyboat.domain.tag.repository;

import com.ssafy.storyboat.domain.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
}
