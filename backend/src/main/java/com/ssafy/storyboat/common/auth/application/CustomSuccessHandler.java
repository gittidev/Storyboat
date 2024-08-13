package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.RefreshTokenRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String userName = customUserDetails.getUsername();
        String role = customUserDetails.getAuthorities().iterator().next().getAuthority();
        // Refresh Token 생성
        String refreshToken = jwtUtil.createJwt("refresh", userName, role, 7 * 24 * 60 * 60 * 1000L); // 7일 유효
        // RefreshToken 저장
        saveRefreshToken(userName, refreshToken);

        // Access Token과 Refresh Token을 쿠키에 추가
        response.addCookie(createCookie("refresh", refreshToken));

        // 로그인/회원가입 성공 시 리다이렉트
        response.addHeader("SignupState",customUserDetails.getJoinStatus() + "");
        response.sendRedirect("https://i11c107.p.ssafy.io/login/loading");
    }

    @Transactional
    protected void saveRefreshToken(String userName, String refreshToken) {

        String[] providers = userName.split(" ");
        User user = userRepository.findByProviderIdAndProvider(providers[0], providers[1]);

        if (user == null) {
            log.error("SuccessHandler User not found");
            return;
        }
        RefreshToken token = RefreshToken.builder()
                    .refreshToken(refreshToken)
                    .user(user)
                    .build();

        refreshTokenRepository.save(token);

    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(7 * 24 * 60 * 60); // 쿠키의 유효 기간 (7일)
        cookie.setPath("/");
        cookie.setSecure(true); // 이 속성과
        cookie.setAttribute("SameSite", "None"); // 이 속성 추가
        cookie.setHttpOnly(true);
        return cookie;
    }
}
