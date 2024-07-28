package com.ssafy.storyboat.domain.user.api;

import com.ssafy.storyboat.common.api.ApiResponse;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.dto.SingleProfileResponseDTO;
import com.ssafy.storyboat.domain.user.dto.FetchSingleUserResponseDTO;
import com.ssafy.storyboat.domain.user.dto.UpdateProfileRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<FetchSingleUserResponseDTO>> getUser(@RequestHeader("Authorization") String token) {
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String[] providers = getProviders(token);

        FetchSingleUserResponseDTO fetchSingleUserResponseDTO = userService.fetchSingleUser(providers[0], providers[1]);

        return ResponseEntity.ok(ApiResponse.success(fetchSingleUserResponseDTO, "Fetch User Success"));
    }

    @GetMapping("/pen-name/{penName}")
    public ResponseEntity<ApiResponse<Boolean>> getUserByPenName(@PathVariable String penName) {
        Boolean result = userService.searchPenName(penName);
        return ResponseEntity.ok(ApiResponse.success(result, "Search User Success"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<SingleProfileResponseDTO>> getUserProfile(@RequestHeader("Authorization") String token) {

        String[] providers = getProviders(token);
        SingleProfileResponseDTO singleProfileResponseDto = userService.fetchSingleProfile(providers[0], providers[1]);

        return ResponseEntity.ok(ApiResponse.success(singleProfileResponseDto, "Fetch Profile Success"));
    }

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<UpdateProfileRequestDTO>> updateUserProfile(@RequestBody UpdateProfileRequestDTO updateProfileRequestDTO, @RequestHeader("Authorization") String token) {

        String[] providers = getProviders(token);
        boolean success = userService.updateUserProfile(providers[0], providers[1], updateProfileRequestDTO);

        if (success) {
            return ResponseEntity.ok(ApiResponse.success(updateProfileRequestDTO, "Profile updated Success"));
        } else {
            return ResponseEntity.status(409).body(ApiResponse.error("Failed to update profile"));
        }

    }

    private String[] getProviders(String token) {
        // JWT 토큰에서 "Bearer " 부분 제거
        String jwtToken = token.substring(7);

        // JWTUtil을 사용하여 토큰의 정보 가져오기
        String username = jwtUtil.getUsername(jwtToken);
        return username.split(" ");
    }


}
