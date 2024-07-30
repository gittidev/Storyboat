package com.ssafy.storyboat.domain.user.api;

import com.ssafy.storyboat.common.api.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.dto.ProfileFindResponse;
import com.ssafy.storyboat.domain.user.dto.UserFindResponse;
import com.ssafy.storyboat.domain.user.dto.ProfileUpdateRequest;
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

    // @AuthenticationPrincipal CustomOAuth2User customOAuth2User 로 받아 .getUserId 로 접속한 유저의 주키 반환!
    // 로그인 유저 정보 조회가 의미가 없어져서 주석 처리함

//    @GetMapping
//    public ResponseEntity<ApiResponse<UserFindResponse>> getUser(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
//        log.info("userId = {}",customOAuth2User.getUserId());
//
//        UserFindResponse userFindResponse = userService.findSingleUser(customOAuth2User.getProviderId(), customOAuth2User.getProvider());
//        return ResponseEntity.ok(ApiResponse.success(userFindResponse, "Fetch User Success"));
//    }

    @GetMapping("/pen-names/{penName}")
    public ResponseEntity<ApiResponse<Boolean>> getUserByPenName(@PathVariable String penName) {
        Boolean result = userService.searchPenName(penName);
        return ResponseEntity.ok(ApiResponse.success(result, "Search User Success"));
    }

    @GetMapping("/profiles")
    public ResponseEntity<ApiResponse<ProfileFindResponse>> getUserProfile(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        ProfileFindResponse profileFindResponse = userService.fetchSingleProfile(customOAuth2User.getUserId());
        return ResponseEntity.ok(ApiResponse.success(profileFindResponse, "Fetch Profile Success"));
    }

    @PostMapping("/profiles")
    public ResponseEntity<ApiResponse<ProfileUpdateRequest>> updateUserProfile(@RequestBody ProfileUpdateRequest profileUpdateRequest, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        boolean success = userService.updateUserProfile(customOAuth2User.getUserId(), profileUpdateRequest);

        if (success) {
            return ResponseEntity.ok(ApiResponse.success(profileUpdateRequest, "Profile updated Success"));
        } else {
            return ResponseEntity.status(409).body(ApiResponse.error("Failed to update profile"));
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteUser(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }



}
