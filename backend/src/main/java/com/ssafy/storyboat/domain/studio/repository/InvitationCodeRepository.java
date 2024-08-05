package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.application.InvitationCodeUtil;
import com.ssafy.storyboat.domain.studio.entity.InvitationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InvitationCodeRepository extends JpaRepository<InvitationCode, Long> {
    Optional<InvitationCode> findByStudio_StudioId(Long studioId);

    @Modifying
    @Query("DELETE FROM InvitationCode ic WHERE ic.invitationCodeId = :invitationCodeId")
    void deleteByInvitationCodeId(@Param("invitationCodeId") Long invitationCodeId);
}
