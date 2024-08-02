package com.ssafy.storyboat.domain.idea.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.idea.dto.IdeaCreateRequest;
import com.ssafy.storyboat.domain.idea.dto.IdeaResponse;
import com.ssafy.storyboat.domain.idea.dto.IdeaUpdateRequest;
import com.ssafy.storyboat.domain.idea.entity.StudioIdea;
import com.ssafy.storyboat.domain.idea.repository.StudioIdeaRepository;
import com.ssafy.storyboat.domain.studio.application.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.application.StudioWriteAuthorization;
import com.ssafy.storyboat.domain.studio.dto.StudioUpdateRequest;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
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
    public void createIdea(Long studioId, Long userId, IdeaCreateRequest ideaCreateRequest) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ForbiddenException("없는 스튜디오 입니다."));
        StudioIdea studioIdea = StudioIdea.builder()
                .studio(studio)
                .title(ideaCreateRequest.getTitle())
                .content(ideaCreateRequest.getContent())
                .build();
        studioIdeaRepository.save(studioIdea);
    }

    @StudioReadAuthorization
    public IdeaResponse viewIdea(Long studioId, Long userId, Long ideaId) {
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("없는 아이디어 입니다."));
        return new IdeaResponse(studioIdea.getStudioIdeaId(), studioIdea.getTitle(), studioIdea.getContent());
    }

    @StudioWriteAuthorization
    public IdeaResponse updateIdea(Long studioId, Long userId, Long ideaId, IdeaUpdateRequest ideaUpdateRequest) {
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("없는 아이디어 입니다."));
        studioIdea.update(ideaUpdateRequest.getTitle(), ideaUpdateRequest.getContent());
        studioIdeaRepository.save(studioIdea);

        return new IdeaResponse(studioIdea.getStudioIdeaId(), studioIdea.getTitle(), studioIdea.getContent());
    }

    @StudioWriteAuthorization
    public void deleteIdea(Long studioId, Long userId, Long ideaId) {
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("없는 아이디어 입니다."));
        studioIdeaRepository.delete(studioIdea);
    }
}
