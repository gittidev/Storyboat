package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import com.ssafy.storyboat.domain.user.entity.User;
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

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final EntityManagerFactory entityManagerFactory;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String userName = customUserDetails.getUsername();
        String role = customUserDetails.getAuthorities().iterator().next().getAuthority();

        log.info("username={} role={}", userName, role);

        // Refresh Token 생성
        String refreshToken = jwtUtil.createJwt("refresh", userName, role, 7 * 24 * 60 * 60 * 1000L); // 7일 유효
        log.info("Refresh Token: {}", refreshToken);

        // RefreshToken 저장
        saveRefreshToken(userName, refreshToken);

        // Access Token과 Refresh Token을 쿠키에 추가
        response.addCookie(createCookie("refresh", refreshToken));

        // 성공 후 리디렉션
        if (customUserDetails.getJoinStatus()) {
            // 회원 가입시 보낼 경로
            response.sendRedirect("http://localhost:5173/login/loading");
        } else {
            // 로그인 시 보낼 경로
            response.sendRedirect("http://localhost:5173/login/loading");
        }

    }

    private void saveRefreshToken(String userName, String refreshToken) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            String[] providers = userName.split(" ");
            User queriedUser = entityManager.createQuery("select m from User m where m.providerId = :providerId and m.provider = :provider", User.class)
                    .setParameter("providerId", providers[0])
                    .setParameter("provider", providers[1])
                    .getSingleResult();

            log.info("user={}", queriedUser);

            RefreshToken token = RefreshToken.builder()
                    .refreshToken(refreshToken)
                    .user(queriedUser)
                    .build();

            entityManager.persist(token);
            entityManager.getTransaction().commit();
        } catch (PersistenceException e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            log.error("Persistence error: {}", e.getMessage());
            throw new RuntimeException("Error during user registration", e);
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage());
            throw new RuntimeException("Unexpected error", e);
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
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
