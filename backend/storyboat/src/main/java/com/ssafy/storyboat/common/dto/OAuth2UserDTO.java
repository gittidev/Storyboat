package com.ssafy.storyboat.common.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter
@Setter
@ToString
public class OAuth2UserDTO {
    private String role;
    private String name;
    private String username;
}
