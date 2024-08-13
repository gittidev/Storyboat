package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    List<RefreshToken> findByUser_UserId(Long userId);
}
