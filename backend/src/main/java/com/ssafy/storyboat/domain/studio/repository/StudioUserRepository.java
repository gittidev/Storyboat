package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.domain.studio.dto.StudioMemberFindAllResponse;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
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

    @Query("SELECT new com.ssafy.storyboat.domain.studio.dto.StudioMemberFindAllResponse(p.user.userId, p.penName, p.imageUrl, s.role, s.createdAt)" +
            "FROM StudioUser s JOIN Profile p ON s.user.userId = p.user.userId " +
            "WHERE s.studio.studioId = :studioId")
    List<StudioMemberFindAllResponse> findAllProfileDTOS(@Param("studioId") Long studioId);

    // 유저의 PRIVATE 스튜디오를 찾는 쿼리
    @Query("SELECT new com.ssafy.storyboat.domain.studio.dto.StudioResponse(su.studio.studioId, su.studio.name, su.studio.description) " +
            "FROM StudioUser su WHERE su.user.userId = :userId AND su.role = :role")
    Optional<StudioResponse> findPrivateStudioByUserIdAndRole(@Param("userId") Long userId, @Param("role") Role role);
}
