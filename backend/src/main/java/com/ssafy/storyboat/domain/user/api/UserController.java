package com.ssafy.storyboat.domain.user.api;

import com.ssafy.storyboat.common.api.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.CustomUserDetails;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.dto.ProfileFindResponse;
import com.ssafy.storyboat.domain.user.dto.UserFindResponse;
import com.ssafy.storyboat.domain.user.dto.ProfileUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<UserFindResponse>> getUser(@AuthenticationPrincipal CustomUserDetails userDetails) {

        UserFindResponse userFindResponse = userService.findSingleUser(userDetails.getProviderId(), userDetails.getProvider());
        return ResponseEntity.ok(ApiResponse.success(userFindResponse, "Fetch User Success"));
    }

    @GetMapping("/pen-names/{penName}")
    public ResponseEntity<ApiResponse<Boolean>> getUserByPenName(@PathVariable String penName) {
        Boolean result = userService.searchPenName(penName);
        return ResponseEntity.ok(ApiResponse.success(result, "Search User Success"));
    }

    @GetMapping("/profiles")
    public ResponseEntity<ApiResponse<ProfileFindResponse>> getUserProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ProfileFindResponse profileFindResponse = userService.fetchSingleProfile(userDetails.getProviderId(), userDetails.getProvider());
        return ResponseEntity.ok(ApiResponse.success(profileFindResponse, "Fetch Profile Success"));
    }

    @PostMapping("/profiles")
    public ResponseEntity<ApiResponse<ProfileUpdateRequest>> updateUserProfile(@RequestBody ProfileUpdateRequest profileUpdateRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {

        boolean success = userService.updateUserProfile(userDetails.getProviderId(), userDetails.getProvider(), profileUpdateRequest);

        if (success) {
            return ResponseEntity.ok(ApiResponse.success(profileUpdateRequest, "Profile updated Success"));
        } else {
            return ResponseEntity.status(409).body(ApiResponse.error("Failed to update profile"));
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteUser(@AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }



}
