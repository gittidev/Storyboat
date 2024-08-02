package com.ssafy.storyboat.domain.character.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class CharacterUpdateRequest {
    private String name;
    private String description;

    public CharacterUpdateRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }
}

