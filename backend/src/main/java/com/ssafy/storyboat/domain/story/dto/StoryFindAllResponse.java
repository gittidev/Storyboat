package com.ssafy.storyboat.domain.story.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class StoryFindAllResponse {
    private Long storyId;
    private String title;
    private LocalDateTime lastModified;

    public StoryFindAllResponse(Long storyId, String title, LocalDateTime lastModified) {
        this.storyId = storyId;
        this.title = title;
        this.lastModified = lastModified;
    }

    public StoryFindAllResponse() {}
}
