package com.ssafy.storyboat.domain.story.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class StoryCreateResponse {
    private Long storyId;
    private String title;
    private LocalDate lastModified;

    public StoryCreateResponse() {}
}
