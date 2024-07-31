package com.ssafy.storyboat.domain.story.application;

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

    @Before("@annotation(checkAuthorization) && args(studioId, userId, ..)")
    public void checkAuthorization(CheckAuthorization checkAuthorization, Long studioId, Long userId) {
        studioService.isAuthorized(studioId, userId);
    }
}
