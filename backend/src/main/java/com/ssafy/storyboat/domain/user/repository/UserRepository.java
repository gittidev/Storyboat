package com.ssafy.storyboat.domain.user.repository;

import com.ssafy.storyboat.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByProviderIdAndProvider(String providerId, String provider);
    @Query("select u from User u join fetch u.profile where u.isDeleted = :userId")
    User findByUserId(Long userId);
}

