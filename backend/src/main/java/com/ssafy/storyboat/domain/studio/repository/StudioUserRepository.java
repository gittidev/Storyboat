package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudioUserRepository extends JpaRepository<StudioUser, Long> {
    StudioUser findByUserAndRole(User user, String role);
    Optional<StudioUser> findByStudio_StudioIdAndUser_UserId(Long studioId, Long userId);

    @Query("SELECT p FROM StudioUser s JOIN Profile p ON s.user = p.user WHERE s.studio.studioId = :studioId")
    List<Profile> findAllProfiles(@Param("studioId") Long studioId);
}
