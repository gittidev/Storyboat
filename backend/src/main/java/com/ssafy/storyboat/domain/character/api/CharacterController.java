package com.ssafy.storyboat.domain.character.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.character.application.CharacterCommandService;
import com.ssafy.storyboat.domain.character.application.CharacterQueryService;
import com.ssafy.storyboat.domain.character.dto.CharacterCreateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/studios/{studioId}/characters")
public class CharacterController {

    private final CharacterCommandService characterCommandService;
    private final CharacterQueryService characterQueryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> createCharacter(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                          @PathVariable Long studioId,
                                          CharacterCreateRequest characterCreateRequest,
                                          @RequestPart MultipartFile file) {
        characterCommandService.createCharacter(studioId, customOAuth2User.getUserId(), characterCreateRequest, file);
        return ApiResponse.success("Create Character Success");
    }

    @GetMapping
    public ApiResponse<?> getCharactersByStudioId(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long studioId) {
        List<?> characters = characterQueryService.getCharactersByStudioId(studioId, customOAuth2User.getUserId());
        return ApiResponse.success(characters, "Get Characters Success");
    }

    @DeleteMapping("/{characterId}")
    public ApiResponse<?> deleteCharacter(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,@PathVariable Long studioId, @PathVariable Long characterId) {
        characterCommandService.deleteCharacter(studioId, customOAuth2User.getUserId(), characterId);
        return ApiResponse.success("Delete Character Success");
    }
}
