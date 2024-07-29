package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
}
