package com.ssafy.storyboat.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.storyboat.common.webrtc.SessionRepository;
import com.ssafy.storyboat.common.webrtc.SignalingHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final SessionRepository sessionRepository;
    private final ObjectMapper objectMapper;

    public WebSocketConfig(SessionRepository sessionRepository, ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalingHandler(), "/signaling")
                .setAllowedOrigins("*");
    }

    @Bean
    public SignalingHandler signalingHandler() {
        return new SignalingHandler(sessionRepository, objectMapper);
    }
}