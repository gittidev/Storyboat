package com.ssafy.storyboat.domain.idea.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class IdeaResponse {
    private Long ideaId;
    private String title;
    private String content;

    public IdeaResponse(Long ideaId, String title, String content) {
        this.ideaId = ideaId;
        this.title = title;
        this.content = content;
    }
}
