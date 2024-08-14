package com.ssafy.storyboat.domain.story.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "lastText") // 컬렉션 이름 수정
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class LastText {

    @Id
    private String lastTextId; // MongoDB의 기본 _id는 보통 String 타입입니다.

    private Long studioStoryId;

    private Long userId;

    //@Indexed(expireAfterSeconds = 7 * 24 * 60 * 60) // 7일 후 자동 삭제
    private LocalDateTime date;

    private String textData; // 변수 이름 수정
}