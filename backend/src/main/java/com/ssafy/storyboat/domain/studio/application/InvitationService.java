package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioOwnerAuthorization;
import com.ssafy.storyboat.domain.studio.entity.Invitation;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final StudioService studioService;

    /**
     * Studio 모집글 목록 조회
     * @return
     */
    @Transactional(readOnly = true)
    public List<Invitation> findAll() {
        return invitationRepository.findAll();
    }

    /**
     * Studio 모집글 상세 조회
     * @param studioId
     * @return
     */
    @Transactional(readOnly = true)
    public Invitation findByStudioId(Long studioId) {
        return invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 모집글 존재하지 않음"));
    }

    /**
     * 모집글 작성
     * @param studioId
     * @param userId
     * @param invitation
     */
    @StudioOwnerAuthorization
    public void InvitationSave(Long studioId, Long userId, Invitation invitation) {
        Studio studio = studioService.findByStudioId(studioId);
        invitation.updateStudio(studio);
        invitationRepository.save(invitation);
    }

    /**
     * 모집글 수정
     * @param studioId
     * @param userId
     * @param invitation
     */

    @StudioOwnerAuthorization
    public void updateInvitation(Long studioId, Long userId, Invitation invitation) {
        Invitation oldInvitation = invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("수정할 모집글 없음"));

        oldInvitation.updateTitle(invitation.getTitle());
        oldInvitation.updateDescription(invitation.getDescription());
        
        invitationRepository.save(oldInvitation);
    }

    /**
     * 모집글 삭제
     * @param studioId
     * @param userId
     */
    @StudioOwnerAuthorization
    public void deleteInvitation(Long studioId, Long userId) {
        Invitation invitation = invitationRepository.findByStudio_studioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("삭제할 모집글 없음"));
        
        invitationRepository.delete(invitation);
    }
}