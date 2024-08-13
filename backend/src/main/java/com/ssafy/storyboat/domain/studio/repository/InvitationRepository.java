package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByStudio_studioId(Long studio_Id);
    Page<Invitation> findByTitleContains(String title, Pageable pageable);
    Page<Invitation> findByStudio_NameContains(String name, Pageable pageable);

//    @Query("SELECT i FROM Invitation i LEFT JOIN FETCH i.invitationTags WHERE i.studio.studioId = :studioId")
//    Optional<Invitation> findByStudio_studioId(@Param("studioId") Long studioId);
//
//    @Query("SELECT i FROM Invitation i LEFT JOIN FETCH i.invitationTags WHERE i.title LIKE %:title%")
//    Page<Invitation> findByTitleContains(@Param("title") String title, Pageable pageable);
//
//    @Query("SELECT i FROM Invitation i LEFT JOIN FETCH i.invitationTags JOIN i.studio s WHERE s.name LIKE %:name%")
//    Page<Invitation> findByStudio_NameContains(@Param("name") String name, Pageable pageable);
//
//    @Query("SELECT i FROM Invitation i LEFT JOIN FETCH i.invitationTags")
//    Page<Invitation> findAllWithInvitationTags(Pageable pageable);
}
