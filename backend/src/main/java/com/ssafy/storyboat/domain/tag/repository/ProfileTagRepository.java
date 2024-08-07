package com.ssafy.storyboat.domain.tag.repository;

import com.ssafy.storyboat.domain.tag.entity.ProfileTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProfileTagRepository extends JpaRepository<ProfileTag, Long> {

    @Modifying
    @Query("DELETE FROM ProfileTag pt WHERE pt.profile.profileId = :profileId")
    void deleteByProfileId(@Param("profileId") Long profileId);
}
