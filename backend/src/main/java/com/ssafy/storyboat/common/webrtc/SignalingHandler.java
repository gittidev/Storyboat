package com.ssafy.storyboat.common.webrtc;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(SignalingHandler.class);
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToRoom = new ConcurrentHashMap<>();
    private final Map<String, Map<String, WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("새로운 WebSocket 연결 수립: 세션 ID = {}", session.getId());
        sessions.put(session.getId(), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("메시지 수신: 세션 ID = {}, 페이로드 = {}", session.getId(), payload);

        try {
            Map<String, Object> jsonMessage = objectMapper.readValue(payload, Map.class);
            String type = (String) jsonMessage.get("type");
            String roomId = (String) jsonMessage.get("roomId");

            switch (type) {
                case "join":
                    handleJoinMessage(session, roomId);
                    break;
                case "offer":
                case "answer":
                case "candidate":
                    forwardMessage(session, jsonMessage, roomId);
                    break;
                default:
                    logger.warn("알 수 없는 메시지 타입: {}", type);
            }
        } catch (IOException e) {
            logger.error("메시지 처리 중 오류 발생", e);
        }
    }

    private void handleJoinMessage(WebSocketSession session, String roomId) throws IOException {
        logger.info("세션 {} 이(가) 방 {} 에 참여", session.getId(), roomId);
        sessionToRoom.put(session.getId(), roomId);
        rooms.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>()).put(session.getId(), session);

        // 같은 방의 다른 참가자들에게 새 참가자 알림
        for (WebSocketSession client : rooms.get(roomId).values()) {
            if (!client.getId().equals(session.getId())) {
                Map<String, Object> joinMessage = new ConcurrentHashMap<>();
                joinMessage.put("type", "user-joined");
                joinMessage.put("userId", session.getId());
                joinMessage.put("roomId", roomId);
                sendMessage(client, joinMessage);
            }
        }
    }

    private void forwardMessage(WebSocketSession sender, Map<String, Object> jsonMessage, String roomId) throws IOException {
        if (roomId == null || !rooms.containsKey(roomId)) {
            logger.warn("세션 {}이(가) 존재하지 않는 방에 메시지 전송 시도", sender.getId());
            return;
        }

        for (WebSocketSession client : rooms.get(roomId).values()) {
            if (!client.getId().equals(sender.getId())) {
                sendMessage(client, jsonMessage);
            }
        }
    }

    private void sendMessage(WebSocketSession session, Map<String, Object> message) throws IOException {
        String jsonMessage = objectMapper.writeValueAsString(message);
        session.sendMessage(new TextMessage(jsonMessage));
        logger.info("메시지 전송: 수신자 세션 ID = {}, 메시지 = {}", session.getId(), jsonMessage);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("WebSocket 연결 종료: 세션 ID = {}, 상태 = {}", session.getId(), status);
        String roomId = sessionToRoom.remove(session.getId());
        sessions.remove(session.getId());

        if (roomId != null && rooms.containsKey(roomId)) {
            rooms.get(roomId).remove(session.getId());
            if (rooms.get(roomId).isEmpty()) {
                rooms.remove(roomId);
            } else {
                // 같은 방의 다른 참가자들에게 퇴장 알림
                Map<String, Object> leaveMessage = new ConcurrentHashMap<>();
                leaveMessage.put("type", "user-left");
                leaveMessage.put("userId", session.getId());
                leaveMessage.put("roomId", roomId);

                for (WebSocketSession client : rooms.get(roomId).values()) {
                    try {
                        sendMessage(client, leaveMessage);
                    } catch (IOException e) {
                        logger.error("퇴장 메시지 전송 중 오류 발생: {}", e.getMessage());
                    }
                }
            }
        }
    }
}