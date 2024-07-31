package com.ssafy.storyboat.domain.story.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collation = "story")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class Story {

    @Id
    private Long storyId;

    private Long studioStoryId;

    private String StoryData;

    @Indexed(expireAfterSeconds = 7 * 24 * 60 * 60) // 7일 후 자동 삭제
    private LocalDateTime date;
}
