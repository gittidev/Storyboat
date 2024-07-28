package com.ssafy.storyboat.domain.user.api;

import com.ssafy.storyboat.common.api.ApiResponse;
import com.ssafy.storyboat.common.auth.dto.GoogleResponse;
import com.ssafy.storyboat.common.auth.dto.NaverResponse;
import com.ssafy.storyboat.common.auth.util.JWTUtil;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.dto.FetchSingleProfileDto;
import com.ssafy.storyboat.domain.user.dto.FetchSingleUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<FetchSingleUserDTO>> getUser(@RequestHeader("Authorization") String token) {
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String[] providers = getProviders(token);

        FetchSingleUserDTO fetchSingleUserDTO = userService.fetchSingleUser(providers[0], providers[1]);

        return ResponseEntity.ok(ApiResponse.success(fetchSingleUserDTO, "Fetch User Success"));
    }

    @GetMapping("/pen-name/{penName}")
    public ResponseEntity<ApiResponse<Boolean>> getUserByPenName(@PathVariable String penName) {
        Boolean result = userService.searchPenName(penName);
        return ResponseEntity.ok(ApiResponse.success(result, "Search User Success"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<FetchSingleProfileDto>> getUserProfile(@RequestHeader("Authorization") String token) {

        String[] providers = getProviders(token);
        FetchSingleProfileDto fetchSingleProfileDto = userService.fetchSingleProfile(providers[0], providers[1]);

        return ResponseEntity.ok(ApiResponse.success(fetchSingleProfileDto, "Fetch Profile Success"));
    }

    private String[] getProviders(String token) {
        // JWT 토큰에서 "Bearer " 부분 제거
        String jwtToken = token.substring(7);

        // JWTUtil을 사용하여 토큰의 정보 가져오기
        String username = jwtUtil.getUsername(jwtToken);
        return username.split(" ");
    }




}
