package com.ssafy.storyboat.domain.character.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.character.application.CharacterService;
import com.ssafy.storyboat.domain.character.dto.CharacterCreateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/studios/{studioId}/characters")
public class CharacterController {

    private final CharacterService characterService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> createCharacter(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                          @PathVariable Long studioId,
                                          CharacterCreateRequest characterCreateRequest,
                                          @RequestPart MultipartFile file) {
        characterService.createCharacter(customOAuth2User, studioId, characterCreateRequest, file);
        return ApiResponse.success("Create Character Success");
    }
}
