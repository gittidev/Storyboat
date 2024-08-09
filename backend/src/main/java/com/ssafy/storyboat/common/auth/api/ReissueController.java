package com.ssafy.storyboat.common.auth.api;

import com.ssafy.storyboat.common.auth.dto.AccessTokenResponse;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import com.ssafy.storyboat.domain.user.entity.User;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final EntityManagerFactory entityManagerFactory;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        log.info("Reissue request received");

        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // RefreshToken 존재 여부 확인
        if (refreshToken == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // RefreshToken 만료 여부 확인
        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 RefreshToken 인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refreshToken);
        String userName = jwtUtil.getUsername(refreshToken);
        String[] providers = userName.split(" ");

//        log.info("category: {}, providerId: {}, provider: {}", category, providers[0], providers[1]);

        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // DB에 저장되어 있는지 확인
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            entityManager.getTransaction().begin();  // 트랜잭션 시작

            User queriedUser = entityManager.createQuery("select m from User m where m.providerId = :providerId and m.provider = :provider", User.class)
                    .setParameter("providerId", providers[0])
                    .setParameter("provider", providers[1])
                    .getSingleResult();

            log.info(queriedUser.toString());

            boolean tokenFound = false;

            // 유저 찾았을 경우, Token 지연로딩으로 찾아가며 토큰 찾기
            for (RefreshToken token : queriedUser.getRefreshTokens()) {
                if (token.getRefreshToken().equals(refreshToken)) {
                    tokenFound = true;
                    String username = jwtUtil.getUsername(refreshToken);
                    String role = jwtUtil.getRole(refreshToken);

                    // make new JWT
                    String newAccess = jwtUtil.createJwt("access", username, role, 600000L * 1000 * 1000);
                    // response
                    response.addHeader("Authorization", "Bearer " + newAccess);
                    AccessTokenResponse accessToken = new AccessTokenResponse();
                    accessToken.setAccessToken("Bearer " + newAccess);
                    return ResponseEntity.ok(ApiResponse.success(accessToken, "Access Token 발급"));

                } else if (jwtUtil.isExpired(token.getRefreshToken())) {
                    entityManager.remove(token);
                }
            }

            if (!tokenFound) {
//                log.info("refresh token can not find");
                return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
            }

            entityManager.getTransaction().commit();  // 트랜잭션 커밋
        } catch (NoResultException e) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        } catch (PersistenceException e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
//            log.error("Persistence error: " + e.getMessage());
            return new ResponseEntity<>("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
//            log.error("Unexpected error: " + e.getMessage());
            return new ResponseEntity<>("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }

        return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
    }
}
