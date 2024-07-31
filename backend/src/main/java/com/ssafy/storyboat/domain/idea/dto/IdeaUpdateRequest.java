package com.ssafy.storyboat.domain.idea.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdeaUpdateRequest {
    private String title;
    private String content;

    public IdeaUpdateRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
