package com.ssafy.storyboat.domain.user.dto;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class UserFindResponse {
    private Long Id;
    private String penName;
    private Long studioId;
}
