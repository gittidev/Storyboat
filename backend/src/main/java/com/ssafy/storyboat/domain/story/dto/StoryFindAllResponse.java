package com.ssafy.storyboat.domain.story.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StoryFindAllResponse {
    private Long storyId;
    private String title;

    public StoryFindAllResponse(Long storyId, String title) {
        this.storyId = storyId;
        this.title = title;
    }
}
