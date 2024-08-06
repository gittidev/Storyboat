package com.ssafy.storyboat.common.webrtc;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    private String peerId;
    private String topic;
    private String sender;
    private String type;
    private Long roomId; // String에서 Long으로 변경
    private Object data;
    private List<String> allUsers;
    private String receiver;
    private Object offer;
    private Object answer;
    private Object candidate;
    private Object sdp;
    private String content;
    private List<String> topics;

    private Map<String, Object> additionalProperties = new HashMap<>();

    // sender를 문자열로 변환하는 메서드
    public String getSenderAsString() {
        if (sender == null) {
            return "";
        }
        if (sender instanceof String) {
            return (String) sender;
        }
        return new ObjectMapper().valueToTree(sender).toString();
    }

    // 알 수 없는 속성을 처리하기 위한 메서드
    @JsonAnySetter
    public void handleUnknownProperty(String key, Object value) {
        additionalProperties.put(key, value);
    }
}