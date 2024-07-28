package com.ssafy.storyboat.domain.user.application;

import com.ssafy.storyboat.domain.user.dto.FetchSingleProfileDto;
import com.ssafy.storyboat.domain.user.dto.FetchSingleUserDTO;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.ProfileRepository;
import com.ssafy.storyboat.domain.user.repository.RefreshTokenRepository;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public FetchSingleUserDTO fetchSingleUser(String providerId, String provider) {

        log.info("provider = " + provider + " providerId = " + providerId);
        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);

        return new FetchSingleUserDTO(user.getUserId(), profile.getPenName());
    }

    @Transactional(readOnly = true)
    public boolean searchPenName(String penName) {
        log.info("Searching for penName: {}", penName);
        Profile profile = profileRepository.findByPenName(penName);
        if (profile != null) {
            log.info("Found penName: {}", profile.getPenName());
            return true;
        } else {
            log.info("PenName not found: {}", penName);
            return false;
        }
    }

    @Transactional(readOnly = true)
    public FetchSingleProfileDto fetchSingleProfile(String providerId, String provider) {
        log.info("provider = " + provider + " providerId = " + providerId);
        User user = userRepository.findByProviderIdAndProvider(providerId, provider);
        Profile profile = profileRepository.findByUser(user);

        FetchSingleProfileDto fetchSingleProfileDto = new FetchSingleProfileDto();
        fetchSingleProfileDto.setPenName(profile.getPenName());

        return fetchSingleProfileDto;
    }
}
