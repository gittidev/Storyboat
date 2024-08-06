package com.ssafy.storyboat.domain.studio.dto.Invitation;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import lombok.Data;

@Data
public class InvitationFindOneResponse {
    private Long invitationId;
    private Long studioId;
    private String title;
    private String description;

    public InvitationFindOneResponse(Invitation invitation) {
        this.invitationId = invitation.getInvitationId();
        this.studioId = invitation.getStudio().getStudioId();
        this.title = invitation.getTitle();
        this.description = invitation.getDescription();
    }
}
