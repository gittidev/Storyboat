package com.ssafy.storyboat.domain.studio.dto.Invitation;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import com.ssafy.storyboat.domain.tag.dto.TagRequest;
import lombok.Data;

import java.util.List;

@Data
public class InvitationFindOneResponse {
    private Long invitationId;
    private Long studioId;
    private String title;
    private String description;
    private List<TagRequest> tags;

    public InvitationFindOneResponse(Invitation invitation) {
        this.invitationId = invitation.getInvitationId();
        this.studioId = invitation.getStudio().getStudioId();
        this.title = invitation.getTitle();
        this.description = invitation.getDescription();
        this.tags = invitation.getInvitationTags().stream()
                .map(tag -> new TagRequest(tag.getTag()))
                .collect(java.util.stream.Collectors.toList());
    }
}
