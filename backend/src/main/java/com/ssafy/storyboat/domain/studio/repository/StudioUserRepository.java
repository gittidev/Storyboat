package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudioUserRepository extends JpaRepository<StudioUser, Long> {
    StudioUser findByUserAndRole(User user, String role);
    Optional<StudioUser> findByStudio_StudioIdAndUser_UserId(Long studioId, Long userId);

}
