package com.ssafy.storyboat.domain.studio.dto.Invitation;

import com.ssafy.storyboat.domain.studio.entity.Invitation;
import com.ssafy.storyboat.domain.tag.dto.TagRequest;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class InvitationFindAllResponse {
    private Long studioId;
    private String title;
    private List<TagRequest> tags;

    public InvitationFindAllResponse() {}

    public InvitationFindAllResponse(Invitation invitation) {
        this.studioId = invitation.getStudio().getStudioId();
        this.title = invitation.getTitle();
        if (invitation.getInvitationTags() != null) {
            this.tags = invitation.getInvitationTags().stream()
                    .map(tag -> new TagRequest(tag.getTag()))
                    .collect(Collectors.toList());
        } else {
            this.tags = new ArrayList<>();
        }
    }
}
