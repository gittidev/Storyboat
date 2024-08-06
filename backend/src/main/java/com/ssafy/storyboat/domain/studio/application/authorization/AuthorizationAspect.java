package com.ssafy.storyboat.domain.studio.application.authorization;

import com.ssafy.storyboat.domain.studio.application.CharacterSendAuthorization;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthorizationAspect {

    private final StudioService studioService;

    public AuthorizationAspect(StudioService studioService) {
        this.studioService = studioService;
    }

    @Before("@annotation(studioReadAuthorization) && args(studioId, userId, ..)")
    public void studioReadAuthorization(StudioReadAuthorization studioReadAuthorization, Long studioId, Long userId) {
        studioService.isReadAuthorized(studioId, userId);
    }

    @Before("@annotation(studioWriteAuthorization) && args(studioId, userId, ..)")
    public void studioWriteAuthorization(StudioWriteAuthorization studioWriteAuthorization, Long studioId, Long userId) {
        studioService.isWriteAuthorized(studioId, userId);
    }

    @Before("@annotation(studioOwnerAuthorization) && args(studioId, userId, ..)")
    public void studioOwnerAuthorization(StudioOwnerAuthorization studioOwnerAuthorization, Long studioId, Long userId) {
        studioService.isOwnerAuthorized(studioId, userId);
    }

    @Before("@annotation(characterSendAuthorization) && args(studioId, userId, targetStudioId, ..)")
    public void studioPrivateAuthorization(CharacterSendAuthorization characterSendAuthorization, Long studioId, Long userId, Long targetStudioId) {
        studioService.isCharacterSendAuthorized(studioId, userId, targetStudioId);
    }

}
