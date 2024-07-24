package com.ssafy.storyboat.config;

import com.ssafy.storyboat.common.auth.application.CustomFailureHandler;
import com.ssafy.storyboat.common.auth.application.CustomOAuth2UserService;
import com.ssafy.storyboat.common.auth.application.CustomSuccessHandler;
import com.ssafy.storyboat.common.auth.filter.JWTFilter;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    //private final RefreshRepository refreshRepository;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final CustomFailureHandler customFailureHandler;

    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                // CSRF 및 기타 기본 보안 설정 비활성화
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable())

                // OAuth2 로그인 설정
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler)
                        .failureHandler(customFailureHandler)
                )

                // 권한 설정
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/login", "/", "/join", "/oauth2/**").permitAll()
                        .requestMatchers("/reissue").permitAll()
                        .anyRequest().authenticated()
                )

                // JWT 필터 추가
                .addFilterBefore(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class)

                // 세션 관리 설정 (무상태)
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));



        return http.build();

    }
}
