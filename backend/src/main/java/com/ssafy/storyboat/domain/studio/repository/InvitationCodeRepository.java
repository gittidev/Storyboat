package com.ssafy.storyboat.domain.studio.repository;

import com.ssafy.storyboat.domain.studio.application.InvitationCodeUtil;
import com.ssafy.storyboat.domain.studio.entity.InvitationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvitationCodeRepository extends JpaRepository<InvitationCode, Long> {
    Optional<InvitationCode> findByStudio_StudioId(Long studioId);
}
