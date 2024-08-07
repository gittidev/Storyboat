package com.ssafy.storyboat.domain.studio.dto.Invitation;

import com.ssafy.storyboat.domain.tag.dto.ProfileTagUpdateRequest;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class InvitationSaveRequest {
    private String title;
    private String description;
    private List<ProfileTagUpdateRequest> tags = new ArrayList<>();

}
