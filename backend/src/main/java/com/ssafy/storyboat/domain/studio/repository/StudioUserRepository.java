package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioUserRepository extends JpaRepository<StudioUser, Long> {
    StudioUser findByUserAndRole(User user, String role);
    StudioUser findByUser_UserIdAndStudio_StudioId(Long userId, Long studioId);
}
