package com.ssafy.storyboat.common.auth.application;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        // 실패 원인 로깅
        log.error("OAuth2 Authentication failed: {}", exception.getMessage());

        // 실패 응답 설정
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // 실패 메시지
        String errorMessage = "OAuth2 Authentication failed. Please try again.";

        // JSON 형식으로 실패 메시지 응답
        response.getWriter().write("{\"error\":\"" + errorMessage + "\"}");
    }
}