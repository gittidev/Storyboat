package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.user.entity.User;
import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class FetchSingleUserDTO {
    private Long Id;
    private String penName;

}
