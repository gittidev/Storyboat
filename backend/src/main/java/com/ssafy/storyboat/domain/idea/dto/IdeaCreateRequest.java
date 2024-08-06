package com.ssafy.storyboat.domain.idea.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdeaCreateRequest {
    private String title;
    private String content;

    public IdeaCreateRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
