package com.ssafy.storyboat.domain.story.dto;

import com.ssafy.storyboat.domain.story.entity.Story;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
public class StoryHistoryFindAllResponse {
    private String storyId;
    private LocalDateTime dateTime;
    private String penName;
    private String imageUrl;
}
