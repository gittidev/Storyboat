package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Profile findByUser(User user);
    Profile findByPenName(String penName);
    Profile findByUser_userId(Long userId);
}
