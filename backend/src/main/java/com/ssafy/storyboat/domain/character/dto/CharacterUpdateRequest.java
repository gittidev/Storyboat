package com.ssafy.storyboat.domain.character.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "캐릭터 이름", example = "John Doe")
    private String name;

    @Schema(description = "캐릭터 설명", example = "A brave warrior")
    private String description;

    @Schema(description = "캐릭터 태그", example = "warrior, brave")
    private String tags;

    public CharacterUpdateRequest(String name, String description, String tags) {
        this.name = name;
        this.description = description;
        this.tags = tags;
    }
}

