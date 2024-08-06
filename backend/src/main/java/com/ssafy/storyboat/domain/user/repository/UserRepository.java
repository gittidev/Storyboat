package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.dto.UserProfileFindDTO;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByProviderIdAndProvider(String providerId, String provider);

    @Query("select new com.ssafy.storyboat.domain.user.dto.UserProfileFindDTO(" +
            "u.userId, u.email, u.isDeleted, p.penName, p.introduction, p.imageUrl)" +
            "from User u " +
            "join u.profile p " +
            "where u.userId = :userId")
    Optional<UserProfileFindDTO> findUserProfileByUserId(@Param("userId") Long userId);
}

