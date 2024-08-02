package com.ssafy.storyboat.domain.studio.application.authorization;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Studio 쓰기 권한 조회
 * studioId, userID 순 Parameter
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface StudioWriteAuthorization {
    String[] roles() default {};
}
