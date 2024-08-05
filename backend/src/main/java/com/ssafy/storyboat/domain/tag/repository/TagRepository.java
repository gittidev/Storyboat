package com.ssafy.storyboat.domain.tag.repository;

import com.ssafy.storyboat.domain.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findAllByOrderByIdDesc();

    @Query("SELECT t FROM Tag t JOIN FETCH ProfileTag pt ON t.id = pt.tag.id WHERE pt.profile.profileId = :profileId")
    List<Tag> findTagsByProfileId(@Param("profileId") Long profileId);
}
