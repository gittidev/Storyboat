package com.ssafy.storyboat.domain.studio.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudioMemberFindAllResponse {
    private Long userId;
    private String penName;
    private String imageUrl;
    private String role;
}
