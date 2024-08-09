package com.ssafy.storyboat.domain.idea.application;

import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.idea.dto.IdeaCreateRequest;
import com.ssafy.storyboat.domain.idea.dto.IdeaResponse;
import com.ssafy.storyboat.domain.idea.dto.IdeaUpdateRequest;
import com.ssafy.storyboat.domain.idea.entity.StudioIdea;
import com.ssafy.storyboat.domain.idea.repository.StudioIdeaRepository;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioWriteAuthorization;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class IdeaService {

    private final StudioRepository studioRepository;
    private final StudioIdeaRepository studioIdeaRepository;

    @StudioReadAuthorization
    public List<?> getIdeas(Long studioId, Long userId) {
        return studioIdeaRepository.findByStudioId(studioId);
    }

    @StudioWriteAuthorization
    public IdeaResponse createIdea(Long studioId, Long userId, IdeaCreateRequest ideaCreateRequest) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio 없음"));
        StudioIdea studioIdea = StudioIdea.builder()
                .studio(studio)
                .title(ideaCreateRequest.getTitle())
                .content(ideaCreateRequest.getContent())
                .build();
        studioIdeaRepository.save(studioIdea);
        return new IdeaResponse(studioIdea.getStudioIdeaId(), studioIdea.getTitle(), studioIdea.getContent());
    }

    @StudioWriteAuthorization
    public IdeaResponse updateIdea(Long studioId, Long userId, Long ideaId, IdeaUpdateRequest ideaUpdateRequest) {
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("아이디어 존재하지 않음"));
        studioIdea.update(ideaUpdateRequest.getTitle(), ideaUpdateRequest.getContent());
        studioIdeaRepository.save(studioIdea);

        return new IdeaResponse(studioIdea.getStudioIdeaId(), studioIdea.getTitle(), studioIdea.getContent());
    }

    @StudioWriteAuthorization
    public void deleteIdea(Long studioId, Long userId, Long ideaId) {
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("아이디어 존재하지 않음"));
        studioIdeaRepository.delete(studioIdea);
    }
}
