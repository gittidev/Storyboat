package com.ssafy.storyboat.domain.user.dto;

import com.ssafy.storyboat.domain.tag.dto.UpdateProfileTagDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class UpdateProfileRequestDTO {
    private String penName;
    private String introduction;
    private String imageUrl;
    private List<UpdateProfileTagDTO> tags;
}
