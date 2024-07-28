package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.user.entity.Profile;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FetchSingleProfileDto {
    private String penName;
    private String introduction;
    private String imageUrl;

    public void setDTO(Profile profile) {
        this.penName = profile.getPenName();
        this.introduction = profile.getIntroduction();
        this.imageUrl = profile.getImageUrl();
    }
}
