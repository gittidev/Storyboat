package com.ssafy.storyboat.common.auth.application;

import com.ssafy.storyboat.common.dto.CustomUserDetails;
import com.ssafy.storyboat.common.entity.OAuth2UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        OAuth2UserEntity userData = userRepository.findByUsername(username);
        //log.info("유저정보=[username={}, password={}]", userData.getUsername(), userData.getPassword());
        if (userData != null) {
            return new CustomUserDetails(userData);
        }
        return null;
    }
}
