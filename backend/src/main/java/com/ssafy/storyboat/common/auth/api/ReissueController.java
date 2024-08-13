package com.ssafy.storyboat.common.auth.api;

import com.ssafy.storyboat.common.auth.dto.AccessTokenResponse;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.exception.ConflictException;
import com.ssafy.storyboat.domain.user.entity.RefreshToken;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.RefreshTokenRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ReissueController {

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

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

        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        User user = getUser(providers);
        ResponseEntity<String> BAD_REQUEST = getStringResponseEntity(user, refreshToken);
        if (BAD_REQUEST != null) return BAD_REQUEST;

        String username = jwtUtil.getUsername(refreshToken);
        String role = jwtUtil.getRole(refreshToken);

        // make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L * 1000 * 1000);
        // response
        response.addHeader("Authorization", "Bearer " + newAccess);
        AccessTokenResponse accessToken = new AccessTokenResponse();
        accessToken.setAccessToken("Bearer " + newAccess);
        return ResponseEntity.ok(ApiResponse.success(accessToken, "Access Token 발급"));
    }

    @Transactional
    protected ResponseEntity<String> getStringResponseEntity(User user, String refreshToken) {
        List<RefreshToken> refreshTokens = refreshTokenRepository.findByUser_UserId(user.getUserId());
        RefreshToken findRefreshToken = null;

        // 유저 찾았을 경우, Token 지연로딩으로 찾아가며 토큰 찾기
        for (RefreshToken token : refreshTokens) {
            if (token.getRefreshToken().equals(refreshToken)) {
                findRefreshToken = token;
            } else if (jwtUtil.isExpired(token.getRefreshToken())) {
                refreshTokenRepository.delete(token);
            }
        }

        if (findRefreshToken == null) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        return null;
    }

    @Transactional(readOnly = true)
    protected User getUser(String[] providers) {
        User user = userRepository.findByProviderIdAndProvider(providers[0], providers[1]);
        if (user == null) {
            throw new ConflictException("해당 유저 없음");
        }
        return user;
    }
}
