package com.ssafy.storyboat.domain.studio.dto;

import com.ssafy.storyboat.common.dto.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StudioMemberFindAllResponse {
    private Long userId;
    private String penName;
    private String imageUrl;
    private Role role;
    private LocalDateTime regDate;

    public StudioMemberFindAllResponse(Long userId, String penName, String imageUrl, Role role, LocalDateTime regDate) {
        this.userId = userId;
        this.penName = penName;
        this.imageUrl = imageUrl;
        this.role = role;
        this.regDate = regDate;
    }
}
