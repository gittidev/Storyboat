package com.ssafy.storyboat.common.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
public class OAuth2UserDTO {
    private String role;
    private String name;
    private String username;
    private Boolean joinStatus;
}

