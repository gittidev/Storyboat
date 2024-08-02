package com.ssafy.storyboat.domain.studio.dto;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import lombok.Data;

@Data
public class InvitationFindAllResponse {
    private Long studioId;
    private String title;

    public InvitationFindAllResponse() {}

    public InvitationFindAllResponse(Invitation invitation) {
        this.studioId = invitation.getStudio().getStudioId();
        this.title = invitation.getTitle();
    }
}
