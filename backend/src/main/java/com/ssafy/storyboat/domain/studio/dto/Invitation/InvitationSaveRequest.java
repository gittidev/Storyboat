package com.ssafy.storyboat.domain.studio.dto.Invitation;

import lombok.Data;

import java.util.List;

@Data
public class InvitationSaveRequest {
    private String title;
    private String description;
    private List<Long> tagIds;
}
