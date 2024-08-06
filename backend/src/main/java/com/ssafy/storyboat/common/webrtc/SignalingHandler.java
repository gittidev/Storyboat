package com.ssafy.storyboat.common.webrtc;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class SignalingHandler extends TextWebSocketHandler {

    private final SessionRepository sessionRepository;
    private final ObjectMapper objectMapper;

    public SignalingHandler(SessionRepository sessionRepository, ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("새로운 WebSocket 연결 수립: 세션 ID = {}, 원격 주소 = {}", session.getId(), session.getRemoteAddress());
        sessionRepository.addSessionToDefaultRoom(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.debug("메시지 수신: 세션 ID = {}, 페이로드 = {}", session.getId(), payload);

        try {
            WebSocketMessage webSocketMessage = objectMapper.readValue(payload, WebSocketMessage.class);
            handleWebSocketMessage(session, webSocketMessage);
        } catch (IOException e) {
            log.error("메시지 처리 중 오류 발생: 세션 ID = {}, 오류 = {}", session.getId(), e.getMessage(), e);
            sendErrorMessage(session, "메시지 처리 실패: " + e.getMessage());
        }
    }

    private void handleWebSocketMessage(WebSocketSession session, WebSocketMessage message) throws IOException {
        log.info("메시지 처리 시작: 타입 = {}, 세션 ID = {}", message.getType(), session.getId());

        if (message.getRoomId() == null) {
            message.setRoomId(sessionRepository.getRoomIdForSession(session).orElse(null));
        }

        switch (message.getType()) {
            case "join":
                handleJoinRoom(session, message);
                break;
            case "subscribe":
                handleSubscribe(session, message);
                break;
            case "publish":
                handlePublish(session, message);
                break;
            case "offer":
            case "answer":
            case "candidate":
                handleMediaMessage(session, message);
                break;
            case "ping":
                handlePing(session);
                break;
            default:
                log.warn("알 수 없는 메시지 타입: 타입 = {}, 세션 ID = {}", message.getType(), session.getId());
                sendErrorMessage(session, "알 수 없는 메시지 타입: " + message.getType());
        }
        log.info("메시지 처리 완료: 타입 = {}, 세션 ID = {}", message.getType(), session.getId());
    }

    private void handleJoinRoom(WebSocketSession session, WebSocketMessage message) throws IOException {
        Long roomId = message.getRoomId();
        if (roomId == null) {
            roomId = sessionRepository.createNewRoom();
        }
        sessionRepository.moveSessionToRoom(session, roomId);

        log.info("방 입장 처리: 룸 ID = {}, 세션 ID = {}", roomId, session.getId());

        Map<String, WebSocketSession> clientList = sessionRepository.getClientList(roomId);
        WebSocketMessage joinMessage = WebSocketMessage.builder()
                .type("user-joined")
                .sender(session.getId())
                .roomId(roomId)
                .allUsers(clientList.keySet().stream().filter(id -> !id.equals(session.getId())).toList())
                .build();

        for (WebSocketSession client : clientList.values()) {
            if (client.isOpen() && !client.getId().equals(session.getId())) {
                sendMessage(client, joinMessage);
            }
        }
    }

    private void handleSubscribe(WebSocketSession session, WebSocketMessage message) {
        Long roomId = message.getRoomId();
        if (roomId == null) {
            log.warn("구독 실패: 룸 ID가 null입니다. 세션 ID = {}", session.getId());
            return;
        }
        // 구독 로직 구현
        log.info("구독 성공: 룸 ID = {}, 세션 ID = {}", roomId, session.getId());
    }

    private void handlePublish(WebSocketSession session, WebSocketMessage message) throws IOException {
        Long roomId = message.getRoomId();
        if (roomId == null) {
            log.warn("발행 실패: 룸 ID가 null입니다. 세션 ID = {}", session.getId());
            return;
        }
        // 발행 로직 구현
        log.info("발행 성공: 룸 ID = {}, 세션 ID = {}", roomId, session.getId());
    }

    private void handleMediaMessage(WebSocketSession session, WebSocketMessage message) throws IOException {
        log.info("미디어 메시지 처리: 타입 = {}, 발신자 = {}, 수신자 = {}", message.getType(), message.getSenderAsString(), message.getReceiver());
        Long roomId = sessionRepository.getRoomIdForSession(session).orElse(null);
        if (roomId != null) {
            Map<String, WebSocketSession> clientList = sessionRepository.getClientList(roomId);
            WebSocketSession receiverSession = clientList.get(message.getReceiver());
            if (receiverSession != null && receiverSession.isOpen()) {
                message.setSender(session.getId());
                sendMessage(receiverSession, message);
                log.info("미디어 메시지 전송 완료: 수신자 세션 ID = {}, 메시지 타입 = {}", receiverSession.getId(), message.getType());
            } else {
                log.warn("수신자를 찾을 수 없거나 연결되지 않음: 수신자 = {}", message.getReceiver());
            }
        } else {
            log.warn("세션이 어떤 방에도 속해있지 않음: 세션 ID = {}", session.getId());
        }
    }

    private void handlePing(WebSocketSession session) throws IOException {
        sessionRepository.getRoomIdForSession(session).ifPresentOrElse(
                roomId -> {
                    try {
                        sendPongMessage(session);
                    } catch (IOException e) {
                        log.error("Pong 메시지 전송 실패: 세션 ID = {}, 오류 = {}", session.getId(), e.getMessage(), e);
                    }
                },
                () -> {
                    log.warn("세션에 대한 방을 찾을 수 없습니다: {}", session.getId());
                    try {
                        sendErrorMessage(session, "세션에 대한 방을 찾을 수 없습니다.");
                    } catch (IOException e) {
                        log.error("에러 메시지 전송 실패: 세션 ID = {}, 오류 = {}", session.getId(), e.getMessage(), e);
                    }
                }
        );
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket 연결 종료: 세션 ID = {}, 상태 = {}", session.getId(), status);
        sessionRepository.getRoomIdForSession(session).ifPresent(roomId -> {
            sessionRepository.removeSessionFromRoom(session, roomId);

            Map<String, WebSocketSession> clientList = sessionRepository.getClientList(roomId);
            WebSocketMessage leaveMessage = WebSocketMessage.builder()
                    .type("user-left")
                    .sender(session.getId())
                    .roomId(roomId)
                    .build();

            clientList.values().forEach(client -> {
                if (client.isOpen()) {
                    try {
                        sendMessage(client, leaveMessage);
                        log.info("퇴장 메시지 전송: 수신자 세션 ID = {}, 룸 ID = {}", client.getId(), roomId);
                    } catch (IOException e) {
                        log.error("퇴장 메시지 전송 중 오류 발생: 수신자 세션 ID = {}, 룸 ID = {}, 오류 = {}", client.getId(), roomId, e.getMessage(), e);
                    }
                }
            });
        });
    }

    private void sendMessage(WebSocketSession session, WebSocketMessage message) throws IOException {
        // null이 아닌 필드만 포함하는 새로운 객체 생성
        Map<String, Object> nonNullFields = new HashMap<>();
        if (message.getType() != null) nonNullFields.put("type", message.getType());
        if (message.getSender() != null) nonNullFields.put("sender", message.getSender());
        if (message.getRoomId() != null) nonNullFields.put("roomId", message.getRoomId());
        if (message.getAllUsers() != null) nonNullFields.put("allUsers", message.getAllUsers());

        String json = objectMapper.writeValueAsString(nonNullFields);
        session.sendMessage(new TextMessage(json));
        log.debug("메시지 전송: 세션 ID = {}, 메시지 = {}", session.getId(), json);
    }

    private void sendPongMessage(WebSocketSession session) throws IOException {
        WebSocketMessage pongMessage = WebSocketMessage.builder()
                .type("pong")
                .sender("server")
                .build();
        sendMessage(session, pongMessage);
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) throws IOException {
        WebSocketMessage errorMsg = WebSocketMessage.builder()
                .type("error")
                .sender("server")
                .content(errorMessage)
                .build();
        sendMessage(session, errorMsg);
        log.error("에러 메시지 전송: 세션 ID = {}, 에러 = {}", session.getId(), errorMessage);
    }
}