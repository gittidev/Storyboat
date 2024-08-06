package com.ssafy.storyboat.common.webrtc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class SessionRepository {
    private final Map<String, Long> sessionToRoomId = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, WebSocketSession>> roomToSessions = new ConcurrentHashMap<>();

    public void addSessionToDefaultRoom(WebSocketSession session) {
        Long defaultRoomId = 0L;
        sessionToRoomId.put(session.getId(), defaultRoomId);
        roomToSessions.computeIfAbsent(defaultRoomId, k -> new ConcurrentHashMap<>())
                .put(session.getId(), session);
        log.info("세션을 기본 방에 추가: 세션 ID = {}, 방 ID = {}", session.getId(), defaultRoomId);
    }

    public void moveSessionToRoom(WebSocketSession session, Long roomId) {
        Long oldRoomId = sessionToRoomId.get(session.getId());
        if (oldRoomId != null) {
            roomToSessions.get(oldRoomId).remove(session.getId());
        }
        sessionToRoomId.put(session.getId(), roomId);
        roomToSessions.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                .put(session.getId(), session);
        log.info("세션을 새 방으로 이동: 세션 ID = {}, 이전 방 ID = {}, 새 방 ID = {}", session.getId(), oldRoomId, roomId);
    }

    public Optional<Long> getRoomIdForSession(WebSocketSession session) {
        return Optional.ofNullable(sessionToRoomId.get(session.getId()));
    }

    public Map<String, WebSocketSession> getClientList(Long roomId) {
        return roomToSessions.getOrDefault(roomId, new ConcurrentHashMap<>());
    }

    public Long createNewRoom() {
        Long roomId = System.currentTimeMillis();
        roomToSessions.put(roomId, new ConcurrentHashMap<>());
        log.info("새 방 생성: 방 ID = {}", roomId);
        return roomId;
    }

    public void removeSessionFromRoom(WebSocketSession session, Long roomId) {
        sessionToRoomId.remove(session.getId());
        Map<String, WebSocketSession> roomSessions = roomToSessions.get(roomId);
        if (roomSessions != null) {
            roomSessions.remove(session.getId());
            if (roomSessions.isEmpty()) {
                roomToSessions.remove(roomId);
                log.info("빈 방 제거: 방 ID = {}", roomId);
            }
        }
        log.info("방에서 세션 제거: 세션 ID = {}, 방 ID = {}", session.getId(), roomId);
    }
}