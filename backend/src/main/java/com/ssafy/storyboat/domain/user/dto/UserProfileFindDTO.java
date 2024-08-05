package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.tag.entity.Tag;
import lombok.Data;

import java.util.List;

@Data
public class UserProfileFindDTO {
    private String userId;
    private String email;
    private Boolean isDelete;
    private String penName;
    private String introduction;
    private String imageUrl;
    private List<Tag> tags;
}
