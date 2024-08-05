package com.ssafy.storyboat.domain.tag.application;

import com.ssafy.storyboat.domain.tag.entity.Tag;
import com.ssafy.storyboat.domain.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<Tag> findTagByProfileId(Long profileId) {
        return tagRepository.findTagsByProfileId(profileId);
    }
}
