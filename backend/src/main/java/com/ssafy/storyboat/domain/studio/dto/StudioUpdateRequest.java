package com.ssafy.storyboat.domain.studio.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
public class StudioUpdateRequest {
    private String name;
    private String description;
}
