package com.ssafy.storyboat.common.dto;

import lombok.Getter;

@Getter
public enum Role {
    ROLE_OWNER("ROLE_CREATOR"),
    ROLE_MEMBER("ROLE_MEMBER"),
    ROLE_VIEWER("ROLE_VIEWER"),
    ROLE_PRIVATE("ROLE_PRIVATE"),
    ROLE_REQUESTER("ROLE_REQUESTER");

    private final String role;

    Role(String role) {
        this.role = role;
    }
}

/*
Role role = Role.OWNER;
String roleString = role.getRole(); // "ROLE_CREATOR"
 */