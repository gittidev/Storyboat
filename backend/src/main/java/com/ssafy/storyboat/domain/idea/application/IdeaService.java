package com.ssafy.storyboat.domain.idea.application;

import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class IdeaService {

    private final UserService userService;
    private final StudioRepository studioRepository;
    private final EntityManagerFactory entityManagerFactory;
    private final UserRepository userRepository;
    private final StudioUserRepository studioUserRepository;

    public List<StudioResponse> getIdeas(String providerId, String provider) {
        Long userId = userService.findUserId(providerId, provider);
        return studioRepository.findAllDTOByUserId(userId);
    }
}
