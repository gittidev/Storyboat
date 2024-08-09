package com.ssafy.storyboat.common.auth.dto;

import com.ssafy.storyboat.common.auth.application.CustomJoinStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

public class CustomOAuth2User implements OAuth2User {

    private final OAuth2UserDTO userDTO;

    public CustomOAuth2User(OAuth2UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userDTO.getRole();
            }
        });

        return authorities;
    }

    @Override
    public String getName() {
        return userDTO.getName();
    }

    public String getUsername() {
        return userDTO.getUsername();
    }

    public CustomJoinStatus getJoinStatus() {return userDTO.getJoinStatus();}

    public Long getUserId() { return userDTO.getUserId(); }
}
