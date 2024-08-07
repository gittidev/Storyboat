package com.ssafy.storyboat.domain.character.api;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.domain.character.application.CharacterCommandService;
import com.ssafy.storyboat.domain.character.application.CharacterQueryService;
import com.ssafy.storyboat.domain.character.dto.CharacterCreateRequest;
import com.ssafy.storyboat.domain.character.dto.CharacterUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Character API", description = "캐릭터 관리 API")
public class CharacterController {

    private final CharacterCommandService characterCommandService;
    private final CharacterQueryService characterQueryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Create a new character",
            description = "지정된 스튜디오에 새로운 캐릭터를 생성합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "캐릭터 생성 요청",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CharacterCreateRequest.class)
            )
    )
    )
    public ApiResponse<?> createCharacter(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            CharacterCreateRequest characterCreateRequest,
            @RequestPart MultipartFile file) {
        characterCommandService.createCharacter(studioId, customOAuth2User.getUserId(), characterCreateRequest, file);
        return ApiResponse.success("캐릭터 생성 성공");
    }

    @GetMapping
    @Operation(
            summary = "Get characters by studio ID",
            description = "지정된 스튜디오의 캐릭터 목록을 조회합니다."
    )
    public ApiResponse<?> getCharactersByStudioId(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId) {
        List<?> characters = characterQueryService.getCharactersByStudioId(studioId, customOAuth2User.getUserId());
        return ApiResponse.success(characters, "Get Characters Success");
    }

    @DeleteMapping("/{characterId}")
    @Operation(
            summary = "Delete a character",
            description = "지정된 캐릭터를 삭제합니다."
    )
    public ApiResponse<?> deleteCharacter(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            @PathVariable Long characterId) {
        characterCommandService.deleteCharacter(studioId, customOAuth2User.getUserId(), characterId);
        return ApiResponse.success("캐릭터 삭제 성공");
    }

    @PutMapping("/{characterId}")
    @Operation(
            summary = "Update a character",
            description = "지정된 캐릭터의 세부 정보를 업데이트합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "캐릭터 업데이트 요청",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = CharacterUpdateRequest.class)
                    )
            )
    )
    public ApiResponse<?> updateCharacter(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            @PathVariable Long characterId,
            CharacterUpdateRequest characterUpdateRequest,
            @RequestPart(required = false) MultipartFile file) {
        characterCommandService.updateCharacter(studioId, customOAuth2User.getUserId(), characterId, characterUpdateRequest, file);
        return ApiResponse.success("캐릭터 수정 성공");
    }

    @PostMapping("/{characterId}/{targetStudioId}")
    @Operation(
            summary = "Export a character",
            description = "캐릭터를 다른 스튜디오로 내보냅니다."
    )
    public ApiResponse<?> exportCharacter(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long studioId,
            @PathVariable Long characterId,
            @PathVariable Long targetStudioId) {
        characterCommandService.exportCharacter(studioId, customOAuth2User.getUserId(), targetStudioId, characterId);
        return ApiResponse.success("캐릭터 업로드 성공");
    }
}
