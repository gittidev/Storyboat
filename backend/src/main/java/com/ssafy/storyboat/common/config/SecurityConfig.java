package com.ssafy.storyboat.common.config;

import com.ssafy.storyboat.common.auth.application.CustomFailureHandler;
import com.ssafy.storyboat.common.auth.application.CustomOAuth2UserService;
import com.ssafy.storyboat.common.auth.application.CustomSuccessHandler;
import com.ssafy.storyboat.common.auth.filter.CustomLogoutFilter;
import com.ssafy.storyboat.common.auth.filter.JWTFilter;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

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
    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                // CSRF 및 기타 기본 보안 설정 비활성
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable())
                .cors(withDefaults());  // .cors() 추가하여 CORS 설정 활성화;

        //JWTFilter 추가
        http
                .addFilterBefore(new JWTFilter(jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class);
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
                        .requestMatchers("/login", "/").permitAll()
                        .requestMatchers("/reissue").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/**").permitAll()
                        .requestMatchers("/signaling").permitAll()
                        .requestMatchers("/invitations/code/join/*").permitAll()
                        .anyRequest().authenticated()
                )

                .addFilterBefore(new CustomLogoutFilter(jwtUtil, entityManagerFactory), LogoutFilter.class)

                // 세션 관리 설정 (무상태)
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 기본 로그인 화면 비활성화
                .exceptionHandling((exceptions) -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                );

        return http.build();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedOrigin("http://localhost:8080");
        configuration.addAllowedOrigin("https://localhost:5173");
        configuration.addAllowedOrigin("https://i11c107.p.ssafy.io");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization", "x-xsrf-token", "Access-Control-Allow-Headers", "Origin", "Accept", "X-Requested-With", "Content-Type", "Access-Control-Request-Method", "Access-Control-Request-Headers"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
