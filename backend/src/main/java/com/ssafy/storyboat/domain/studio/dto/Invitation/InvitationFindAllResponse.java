package com.ssafy.storyboat.domain.studio.dto.Invitation;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import lombok.Data;

import java.util.List;

@Data
public class InvitationFindAllResponse {
    private Long studioId;
    private String title;
    private List<Long> tags;

    public InvitationFindAllResponse() {}

    public InvitationFindAllResponse(Invitation invitation) {
        this.studioId = invitation.getStudio().getStudioId();
        this.title = invitation.getTitle();
    }
}
