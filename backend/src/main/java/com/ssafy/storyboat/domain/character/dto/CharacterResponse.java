package com.ssafy.storyboat.domain.character.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class CharacterResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private List<String> tags;

    public CharacterResponse(Long id, String name, String description, String imageUrl, List<String> tags) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.tags = tags;
    }
}
