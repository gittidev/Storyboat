package com.ssafy.storyboat.domain.user.repository;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProfileRepository {

    private final EntityManagerFactory entityManagerFactory;

    

}
