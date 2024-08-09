package com.ssafy.storyboat.common.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import com.ssafy.storyboat.domain.user.entity.User;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Iterator;

@RequiredArgsConstructor
@Slf4j
public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final EntityManagerFactory entityManagerFactory;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // path and method verify
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("/api/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get refresh token from cookies
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                    break;
                }
            }
        }

        // Refresh token null check
        if (refresh == null) {
            setErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Refresh token is missing");
            return;
        }

        // Expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            setErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Refresh token is expired");
            return;
        }

        // Check if token is refresh
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            setErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid token category");
            return;
        }

//        log.info("로그아웃 로직");
        String userName = jwtUtil.getUsername(refresh);
        String[] providers = userName.split(" ");

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            // 사용자 조회
            User queriedUser = entityManager.createQuery("select u from User u where u.providerId = :providerId and u.provider = :provider", User.class)
                    .setParameter("providerId", providers[0])
                    .setParameter("provider", providers[1])
                    .getSingleResult();

//            log.info("User found: {}", queriedUser);

            boolean tokenFound = removeExpiredOrMatchingTokens(queriedUser, refresh);

            if (!tokenFound) {
                setErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Refresh token not found");
                return;
            }

            entityManager.flush();  // 변경 사항을 데이터베이스에 반영
            entityManager.getTransaction().commit();  // 트랜잭션 커밋

        } catch (NoResultException e) {
            setErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "User not found");
            return;
        } catch (PersistenceException e) {
//            log.error("Persistence error: " + e.getMessage());
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();  // 트랜잭션 롤백
            }
            setErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Persistence error");
            return;
        } catch (Exception e) {
//            log.error("Unexpected error: " + e.getMessage());
            setErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unexpected error");
            return;
        } finally {
            // 엔티티 매니저 닫기
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }

        // Invalidate refresh token cookie
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        // 성공 응답
        setSuccessResponse(response, "Logout successful");
    }

    //@Transactional
    public boolean removeExpiredOrMatchingTokens(User queriedUser, String refresh) {
        Iterator<RefreshToken> iterator = queriedUser.getRefreshTokens().iterator();

        boolean result = false;

        while (iterator.hasNext()) {
            RefreshToken token = iterator.next();
//            log.info("Comparing token: {}", token.getRefreshToken());

            if (token.getRefreshToken().equals(refresh)) {
//                log.info("Deleting RefreshToken");
//                log.info("tokenID: {}, token: {}, user: {}", token.getRefreshTokenId(), token.getRefreshToken(), token.getUser());

                iterator.remove(); // 부모 엔티티의 컬렉션에서 제거
                result = true;
            } else if (jwtUtil.isExpired(token.getRefreshToken())) {
//                log.info("Removing expired RefreshToken");
                iterator.remove(); // 부모 엔티티의 컬렉션에서 제거
            }
        }
        return result;
        // entityManager.remove(token); 호출할 필요 없음
        // 부모 엔티티의 컬렉션에서 제거하면 orphanRemoval=true 설정에 의해 자식 엔티티가 자동으로 삭제됨
    }

    private void setErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        ApiResponse<Object> errorResponse = ApiResponse.error(message);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        response.getWriter().flush();
    }

    private void setSuccessResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        ApiResponse<Object> successResponse = ApiResponse.success(message);
        response.getWriter().write(objectMapper.writeValueAsString(successResponse));
        response.getWriter().flush();
    }
}
