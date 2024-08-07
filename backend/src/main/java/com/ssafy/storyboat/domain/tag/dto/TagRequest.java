package com.ssafy.storyboat.domain.tag.dto;

import com.ssafy.storyboat.domain.tag.entity.Tag;
import lombok.Data;

@Data
public class TagRequest {
    private Long tagId;
    private String name;
    private String color;

    public TagRequest (Tag tag) {
        this.tagId = tag.getId();
        this.color = tag.getColor();
        this.name = tag.getName();
    }
}
