package com.ssafy.storyboat.domain.studio.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StudioResponse {
    private Long studioId;
    private String name;
    private String description;

    public StudioResponse(Long studioId, String name, String description) {
        this.studioId = studioId;
        this.name = name;
        this.description = description;
    }
}
