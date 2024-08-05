package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByProviderIdAndProvider(String providerId, String provider);

    @Query("select u.profile from User u join fetch u.profile where u.isDeleted = false and u.userId = :userId")
    Optional<Profile> findByUserId(Long userId);
}

