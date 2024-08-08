package com.ssafy.storyboat.domain.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.domain.character.dto.CharacterUpdateRequest;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.dto.ProfileFindResponse;
import com.ssafy.storyboat.domain.user.dto.ProfileUpdateRequest;
import com.ssafy.storyboat.domain.user.dto.UserProfileFindDTO;
import com.ssafy.storyboat.domain.user.entity.Profile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Slf4j
@Tag(name = "유저 관리", description = "사용자 관리 API")
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;  // JSON 파싱을 위한 ObjectMapper


    @GetMapping("/pen-names/{penName}")
    @Operation(
            summary = "필명 중복 확인",
            description = "주어진 필명이 중복되지 않았는지 확인합니다."
    )
    public ResponseEntity<?> getUserByPenName(@PathVariable String penName) {
        userService.searchPenName(penName);
        return ResponseEntity.ok(ApiResponse.success("PenName is not Duplication"));
    }

    @GetMapping("/profiles")
    @Operation(
            summary = "유저 프로필 조회",
            description = "현재 로그인한 사용자의 프로필을 조회합니다."
    )
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Profile profile = userService.fetchSingleProfile(customOAuth2User.getUserId());
        StudioResponse privateStudio = userService.fetchPrivateStudio(customOAuth2User.getUserId());
        ProfileFindResponse profileFindResponse = new ProfileFindResponse();
        profileFindResponse.setDTO(profile);
        profileFindResponse.setStudio(privateStudio);
        profileFindResponse.setTags(userService.findTags(profile.getProfileId()));

        return ResponseEntity.ok().body(ApiResponse.success(profileFindResponse, "Find Profile Success"));
    }

    @PutMapping("/profiles")
    @Operation(
            summary = "유저 프로필 수정",
            description = "현재 로그인한 사용자의 프로필을 수정합니다."
    )
    public ResponseEntity<?> updateUserProfile(@RequestPart String data,
                                               @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                               @RequestPart(required = false) MultipartFile imageUrl) {
        // JSON 문자열을 ProfileUpdateRequest 객체로 변환
        ProfileUpdateRequest profileUpdateRequest;
        try {
            profileUpdateRequest = objectMapper.readValue(data, ProfileUpdateRequest.class);
        } catch (IOException e) {
            throw new InternalServerErrorException("데이터 변환 실패 JSON");
        }

        Long userId = customOAuth2User.getUserId();
        log.info("Input: {}", profileUpdateRequest);
        Profile profile = userService.updateUserProfile(userId, profileUpdateRequest, imageUrl);
        StudioResponse privateStudio = userService.fetchPrivateStudio(userId);

        ProfileFindResponse profileFindResponse = new ProfileFindResponse();
        profileFindResponse.setDTO(profile);
        profileFindResponse.setStudio(privateStudio);
        profileFindResponse.setTags(userService.findTags(profile.getProfileId()));

        return ResponseEntity.ok().body(ApiResponse.success(profileFindResponse, "Update Profile Success"));
    }

    @DeleteMapping
    @Operation(
            summary = "유저 삭제",
            description = "현재 로그인한 사용자의 계정을 삭제합니다."
    )
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        userService.deleteUser(customOAuth2User.getUserId()); // 사용자 삭제 서비스 호출 추가
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @GetMapping("/profiles/{userId}")
    public ResponseEntity<?> findUser(@PathVariable Long userId) {
        UserProfileFindDTO result = userService.findUser(userId);
        return ResponseEntity.ok(ApiResponse.success(result, "해당 유저 조회 성공"));
    }

}
