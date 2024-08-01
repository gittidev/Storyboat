package com.ssafy.storyboat.domain.character.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class CharacterCreateRequest {
    private String name;
    private String description;

    public CharacterCreateRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
