package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.common.dto.CustomOAuth2User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j

public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        log.info("onAuthenticationSuccess");

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        String role = customUserDetails.getAttribute("role");

        log.info("username={} role={}", username, role);
        // Refresh Token 생성
        String refreshToken = jwtUtil.createJwt("refresh", username, role, 7 * 24 * 60 * 60 * 1000L); // 7일 유효

        log.info("Refresh Token: {}", refreshToken);

        // Access Token과 Refresh Token을 쿠키에 추가
        response.addCookie(createCookie("RefreshToken", refreshToken));

        // 성공 후 리디렉션
        response.sendRedirect("http://localhost:3000/");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 60 * 60); // 쿠키의 유효 기간 (60시간)
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // 쿠키를 보안적으로 안전하게 설정하려면 SSL이 활성화된 경우에만 사용해야 함
        //cookie.setSecure(true);
        return cookie;
    }

}