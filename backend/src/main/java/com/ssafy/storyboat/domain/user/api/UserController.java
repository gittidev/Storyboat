package com.ssafy.storyboat.domain.user.api;

import com.ssafy.storyboat.common.dto.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.dto.ProfileFindResponse;
import com.ssafy.storyboat.domain.user.dto.ProfileUpdateRequest;
import com.ssafy.storyboat.domain.user.entity.Profile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Slf4j
public class UserController {

    private final UserService userService;

    // 필명 중복 확인
    @GetMapping("/pen-names/{penName}")
    public ResponseEntity<?> getUserByPenName(@PathVariable String penName) {
        userService.searchPenName(penName);
        return ResponseEntity.ok().body("필명 중복 X");
    }

    // 유저 프로필 조회
    @GetMapping("/profiles")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        Profile profile = userService.fetchSingleProfile(customOAuth2User.getUserId());
        ProfileFindResponse profileFindResponse = new ProfileFindResponse();
        profileFindResponse.setDTO(profile);

        return ResponseEntity.ok().body(ApiResponse.success(profileFindResponse, "Find Profile Success"));
    }

    // Tag 매핑 확인
    @PostMapping("/profiles")
    public ResponseEntity<?> updateUserProfile(@RequestBody ProfileUpdateRequest profileUpdateRequest, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        userService.updateUserProfile(customOAuth2User.getUserId(), profileUpdateRequest);
        return ResponseEntity.ok().body(ApiResponse.success("Update Profile Success"));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }



}
