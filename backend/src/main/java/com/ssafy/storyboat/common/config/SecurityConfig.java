package com.ssafy.storyboat.common.config;

import com.ssafy.storyboat.common.auth.application.CustomFailureHandler;
import com.ssafy.storyboat.common.auth.application.CustomOAuth2UserService;
import com.ssafy.storyboat.common.auth.application.CustomSuccessHandler;
import com.ssafy.storyboat.common.auth.filter.CustomLogoutFilter;
import com.ssafy.storyboat.common.auth.filter.JWTFilter;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import jakarta.persistence.EntityManagerFactory;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final EntityManagerFactory entityManagerFactory;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final CustomFailureHandler customFailureHandler;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                // CSRF 및 기타 기본 보안 설정 비활성화
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable());

                // OAuth2 로그인 설정
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler)
                        .failureHandler(customFailureHandler)
                )

                // 권한 설정
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/login", "/", "/oauth2/authorization/**").permitAll()
                        .requestMatchers("/reissue").permitAll()
                        .anyRequest().authenticated()
                )

                // JWT 필터 추가
                .addFilterBefore(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class)
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, entityManagerFactory), LogoutFilter.class)

                // 세션 관리 설정 (무상태)
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))


                // 기본 로그인 화면 비활성화
                .exceptionHandling((exceptions) -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                );



        ;



        return http.build();

    }
}
