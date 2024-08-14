package com.ssafy.storyboat.domain.story.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TextHistoryFindAllResponse {
    private String textId;
    private LocalDateTime dateTime;
    private String penName;
    private String imageUrl;
}
