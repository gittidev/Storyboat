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
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class IdeaService {

    private final UserService userService;
    private final StudioRepository studioRepository;
    private final StudioUserRepository studioUserRepository;
    private final UserRepository userRepository;
    private final StudioIdeaRepository studioIdeaRepository;

    private StudioUser checkAccessRole(CustomOAuth2User customOAuth2User, Long studioId) {

        Long userId = userService.findUserId(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
        //studioId랑 userId를 로그 찍기
        log.info("studioId: {}, userId: {}", studioId, userId);
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ForbiddenException("접근할 수 없는 경로입니다."));
        if (studioUser.getRole() == Role.ROLE_REQUESTER) {
            throw new UnauthorizedException("해당 스튜디오에 가입되어 있지 않습니다.");
        }
        return studioUser;
    }

    private void checkWriteRole(CustomOAuth2User customOAuth2User, Long studioId) {
        StudioUser studioUser = checkAccessRole(customOAuth2User, studioId);
        if (studioUser.getRole() == Role.ROLE_VIEWER) {
            throw new UnauthorizedException("쓰기/생성 권한이 없는 유저입니다.");
        }
    }

    public List<?> getIdeas(CustomOAuth2User customOAuth2User, Long studioId) {
        checkAccessRole(customOAuth2User, studioId);
        return studioIdeaRepository.findByStudioId(studioId);
    }

    public void createIdea(CustomOAuth2User customOAuth2User, Long studioId, IdeaCreateRequest ideaCreateRequest) {
        checkWriteRole(customOAuth2User, studioId);
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ForbiddenException("없는 스튜디오 입니다."));
        StudioIdea studioIdea = StudioIdea.builder()
                .studio(studio)
                .title(ideaCreateRequest.getTitle())
                .content(ideaCreateRequest.getContent())
                .build();
        studioIdeaRepository.save(studioIdea);
    }

    public IdeaResponse viewIdea(CustomOAuth2User customOAuth2User, Long studioId, Long ideaId) {
        checkAccessRole(customOAuth2User, studioId);
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("없는 아이디어 입니다."));
        return new IdeaResponse(studioIdea.getStudioIdeaId(), studioIdea.getTitle(), studioIdea.getContent());
    }

    public IdeaResponse updateIdea(CustomOAuth2User customOAuth2User, Long studioId, Long ideaId, IdeaUpdateRequest ideaUpdateRequest) {
        checkWriteRole(customOAuth2User, studioId);
        StudioIdea studioIdea = studioIdeaRepository.findById(ideaId)
                .orElseThrow(() -> new ForbiddenException("없는 아이디어 입니다."));
        studioIdea.update(ideaUpdateRequest.getTitle(), ideaUpdateRequest.getContent());
        studioIdeaRepository.save(studioIdea);

        return new IdeaResponse(studioIdea.getStudioIdeaId(), studioIdea.getTitle(), studioIdea.getContent());
    }
}
