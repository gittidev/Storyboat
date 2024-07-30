package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudioService {

    private final UserService userService;
    private final StudioRepository studioRepository;

    public Long findUserId(String providerId, String provider) {
        log.info("provider = " + provider + " providerId = " + providerId);
        return userService.findUserId(providerId, provider);
    }

    public List<StudioResponse> getStudios(String providerId, String provider) {
        Long userId = findUserId(providerId, provider);
        return studioRepository.findAllDTOByUserId(userId);
    }
}
