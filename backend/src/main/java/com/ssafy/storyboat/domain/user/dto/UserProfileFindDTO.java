package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.tag.dto.TagRequest;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserProfileFindDTO {
    private Long userId;
    private String email;
    private Boolean isDelete;
    private String penName;
    private String introduction;
    private String imageUrl;
    private List<TagRequest> tags = new ArrayList<>();

    public UserProfileFindDTO(Long userId, String email, Boolean isDelete, String penName, String introduction, String imageUrl) {
        this.userId = userId;
        this.email = email;
        this.isDelete = isDelete;
        this.penName = penName;
        this.introduction = introduction;
        this.imageUrl = imageUrl;
    }
}
