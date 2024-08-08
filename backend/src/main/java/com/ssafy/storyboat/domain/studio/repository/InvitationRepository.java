package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByStudio_studioId(Long studio_Id);
    Page<Invitation> findByTitleContains(String title, Pageable pageable);
    Page<Invitation> findByStudio_NameContains(String name, Pageable pageable);
}