package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.tag.dto.ProfileTagUpdateRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class ProfileUpdateRequest {
    private String penName;
    private String introduction;
    private List<ProfileTagUpdateRequest> tags = new ArrayList<>();
}
