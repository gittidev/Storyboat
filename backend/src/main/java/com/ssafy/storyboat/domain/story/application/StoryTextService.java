package com.ssafy.storyboat.domain.story.application;

import com.ssafy.storyboat.common.dto.PageResponse;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.story.dto.StoryHistoryFindAllResponse;
import com.ssafy.storyboat.domain.story.dto.TextHistoryFindAllResponse;
import com.ssafy.storyboat.domain.story.entity.LastStory;
import com.ssafy.storyboat.domain.story.entity.LastText;
import com.ssafy.storyboat.domain.story.entity.Story;
import com.ssafy.storyboat.domain.story.entity.Text;
import com.ssafy.storyboat.domain.story.repository.LastTextRepository;
import com.ssafy.storyboat.domain.story.repository.TextRepository;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioWriteAuthorization;
import com.ssafy.storyboat.domain.user.entity.Profile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StoryTextService {

    private final LastTextRepository lastTextRepository;
    private final TextRepository textRepository;
    private final StudioService studioService;

    @Transactional(readOnly = true)
    @StudioReadAuthorization
    public LastText getLastText(Long studioId, Long userId, Long studioStoryId) {
        return lastTextRepository.findLastTextByStudioStoryId(studioStoryId)
                .orElse(null);
    }

    @StudioWriteAuthorization
    public LastText saveLastText(Long studioId, Long userId, Long studioStoryId, String data) {
        Optional<LastText> oldLastText = lastTextRepository.findLastTextByStudioStoryId(studioStoryId);
        if (oldLastText.isPresent()) {
            Text text = new Text(oldLastText.get());
            textRepository.save(text);
            lastTextRepository.delete(oldLastText.get());
        }
        LastText newLastText = LastText.builder()
                .studioStoryId(studioStoryId)
                .userId(userId)
                .textData(data)
                .date(LocalDateTime.now())
                .build();

        lastTextRepository.save(newLastText);
        return newLastText;
    }

    @StudioReadAuthorization
    public PageResponse getTexts(Long studioId, Long userId, Long studioStoryId, Pageable pageable) {
        List<Profile> profiles = studioService.findStudioUser(studioId, userId);
        Page<Text> texts = textRepository.findByStudioStoryIdOrderByDateDesc(studioStoryId, pageable);
        HashMap<Long, Profile> profileMap = new HashMap<>();

        for (Profile profile : profiles) {
            profileMap.put(profile.getUser().getUserId(), profile);
        }
        List<TextHistoryFindAllResponse> responses = new ArrayList<>();
        for (Text text : texts.getContent()) {
            Profile profile = profileMap.get(text.getUserId());
            TextHistoryFindAllResponse tmp = TextHistoryFindAllResponse.builder()
                    .textId(text.getTextId())
                    .penName(profile.getPenName())
                    .dateTime(text.getDate())
                    .imageUrl(profile.getImageUrl())
                    .build();
            responses.add(tmp);
        }
        PageResponse result = new PageResponse();
        result.setContent(responses);
        result.setSize(texts.getSize());
        result.setTotalElements(texts.getTotalElements());
        result.setTotalPages(texts.getTotalPages());
        return result;
    }

    @StudioWriteAuthorization
    public Text findTextById(Long studioId, Long userId, String textId) {
        return textRepository.findById(textId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 원고 없음"));
    }
}
