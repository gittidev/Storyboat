package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
