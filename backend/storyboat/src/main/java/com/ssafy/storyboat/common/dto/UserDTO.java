package com.ssafy.storyboat.common.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class UserDTO {
    private String role;
    private String name;
    private String username;
}
