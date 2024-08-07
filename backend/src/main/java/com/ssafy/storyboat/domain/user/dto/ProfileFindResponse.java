package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.tag.dto.TagRequest;
import com.ssafy.storyboat.domain.user.entity.Profile;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class ProfileFindResponse {
    private String penName;
    private String introduction;
    private String imageUrl;
    private StudioResponse privateStudio;
    private List<TagRequest> tags = new ArrayList<>();

    public void setDTO(Profile profile) {
        this.penName = profile.getPenName();
        this.introduction = profile.getIntroduction();
        this.imageUrl = profile.getImageUrl();
    }

    public void setStudio(StudioResponse privateStudio) {
        this.privateStudio = privateStudio;
    }
}
