package com.ssafy.storyboat.domain.tag.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.tag.application.TagService;
import com.ssafy.storyboat.domain.tag.dto.TagRequest;
import com.ssafy.storyboat.domain.tag.entity.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<?> findAllTags() {
        List<Tag> tags = tagService.findAllTags();

        List<TagRequest> tagRequests = tags.stream()
                .map(TagRequest::new)
                .collect(Collectors.toList());

        // 변환된 리스트를 응답으로 반환
        return ResponseEntity.ok(ApiResponse.success(tagRequests, "태그 목록 조회 성공"));
    }

    @GetMapping("/{tagId}")
    public ResponseEntity<?> findTagById(@PathVariable Long tagId) {
        Tag tag = tagService.findTagById(tagId);
        TagRequest tagRequest = new TagRequest(tag);
        return ResponseEntity.ok(ApiResponse.success(tagRequest, "태그 조회 성공"));
    }
}
