package com.ssafy.storyboat.common.dto;

import lombok.Getter;

@Getter
public enum Role {
    OWNER("ROLE_CREATOR"),
    MEMBER("ROLE_MEMBER"),
    VIEWER("ROLE_VIEWER"),
    PRIVATE("ROLE_PRIVATE"),
    REQUESTER("ROLE_REQUESTER");

    private final String role;

    Role(String role) {
        this.role = role;
    }
}

/*
Role role = Role.OWNER;
String roleString = role.getRole(); // "ROLE_CREATOR"
 */