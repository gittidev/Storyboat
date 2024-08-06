package com.ssafy.storyboat.domain.studio.application;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 캐릭터 내보내기 권한 조회
 * studioId, userID 순 Parameter
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CharacterSendAuthorization {
    String[] roles() default {};
}
