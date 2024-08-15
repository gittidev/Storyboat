package com.ssafy.storyboat.domain.studio.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.ConflictException;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.character.repository.CharacterRepository;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioOwnerAuthorization;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioReadAuthorization;
import com.ssafy.storyboat.domain.studio.dto.StudioMemberFindAllResponse;
import com.ssafy.storyboat.domain.studio.dto.StudioResponse;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import com.ssafy.storyboat.domain.user.application.UserService;
import com.ssafy.storyboat.domain.user.entity.Profile;
import com.ssafy.storyboat.domain.user.entity.User;
import com.ssafy.storyboat.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudioService {

    private final StudioRepository studioRepository;
    private final StudioUserRepository studioUserRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final CharacterRepository characterRepository;


    @Transactional(readOnly = true)
    public StudioUser isCharacterSendAuthorized(Long studioId, Long userId, Long targetStudioId) {
        StudioUser targetStudioUser = isWriteAuthorized(targetStudioId, userId);
        StudioUser thisStudioUser = isOwnerAuthorized(studioId, userId);

        if (thisStudioUser.getRole() != Role.ROLE_PRIVATE) {
            throw new ForbiddenException("캐릭터 전송 권한 없음");
        }
        return targetStudioUser;
    }


    @Transactional(readOnly = true)
    public StudioUser isOwnerAuthorized(Long studioId, Long userId) {
        StudioUser studioUser = isWriteAuthorized(studioId, userId);
        if (studioUser.getRole() != Role.ROLE_OWNER && studioUser.getRole() != Role.ROLE_PRIVATE) {
            throw new ForbiddenException("Studio 관리 권한 없음");
        }
        return studioUser;
    }

    @Transactional(readOnly = true)
    public StudioUser isReadAuthorized(Long studioId, Long userId) {
        log.info("studioId: " + studioId + ", userId: " + userId);
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Studio 접근 권한 없음"));
        if (studioUser.getRole() == Role.ROLE_REQUESTER) {
            throw new ForbiddenException("Studio 접근 권한 없음");
        }
        return studioUser;
    }

    @Transactional(readOnly = true)
    public StudioUser isWriteAuthorized(Long studioId, Long userId) {
        StudioUser studioUser = isReadAuthorized(studioId, userId);
        if (studioUser.getRole() == Role.ROLE_VIEWER) {
            throw new ForbiddenException("Studio 수정 권한 없음");
        }
        return studioUser;
    }

    @Transactional
    public void createStudio(CustomOAuth2User customOAuth2User, String name, String description) {

        // 1. 유저 조회
        Long userId = customOAuth2User.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("로그인 유저 정보 조회 실패"));

        // 2. 개인 스튜디오 생성해 영속
        Studio studio = Studio.builder()
                .name(name)
                // description은 null이 입력된다면 ""으로 초기화
                .description(description == null ? "" : description)
                .studioUsers(new ArrayList<>())
                .build();

        Studio savedStudio = studioRepository.save(studio);

        // 3. StudioUser 생성해 persist
        StudioUser studioUser = StudioUser.builder()
                .user(user)
                .studio(savedStudio)
                .role(Role.ROLE_OWNER)
                .createdAt(LocalDateTime.now())
                .build();

        studioUserRepository.save(studioUser);

        // 4. Default Character 생성해 Persist
        StudioCharacter studioCharacter = makeDefaultCharacter(studio);
        characterRepository.save(studioCharacter);
    }

    @Transactional
    public List<StudioResponse> getStudios(CustomOAuth2User customOAuth2User) {
        Long userId = customOAuth2User.getUserId();
        return studioRepository.findAllDTOByUserId(userId);
    }

    @Transactional
    @StudioReadAuthorization
    public StudioResponse getStudio(Long studioId, Long userId) {
        return studioRepository.findDTOByStudioId(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재하지 않음"));
    }

    @Transactional
    @StudioOwnerAuthorization
    public StudioResponse updateStudio(Long studioId, Long userId, String name, String description) {

        // 1. 스튜디오 조회 및 수정
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재하지 않음"));

        studio.updateStudioName(name);
        studio.updateStudioDescription(description);

        return new StudioResponse(studio.getStudioId(), studio.getName(), studio.getDescription());
    }

    @Transactional(readOnly = true)
    @StudioReadAuthorization
    public List<Profile> findStudioUser(Long studioId, Long userId) {
        return studioUserRepository.findAllProfiles(studioId);
    }

    @Transactional(readOnly = true)
    @StudioReadAuthorization
    public List<StudioMemberFindAllResponse> findStudioUserDTO(Long studioId, Long userId) {
        return studioUserRepository.findAllProfileDTOS(studioId);

    }

    /**
     * Studio 에서 Member 의 권한 설정
     * @param studioId
     * @param userId
     * @param memberId
     * @param role
     */
    @StudioOwnerAuthorization
    public void updateMemberRole(Long studioId, Long userId, Long memberId, String role) {
        // 1. ROLE 조회 (ROLE_OWNER or ROLE_VIEWER or ROLE_MEMBER)
        if (!("ROLE_OWNER".equals(role) || "ROLE_MEMBER".equals(role) || "ROLE_VIEWER".equals(role))) {
            throw new ForbiddenException("설정할 수 없는 권한: " + role);
        }

        // 2. 해당 유저의 ROLE 세팅
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 유저 Studio 에 존재하지 않음"));

        Role role1;
        if (role.equals("ROLE_OWNER")) {
            role1 = Role.ROLE_OWNER;
        } else if (role.equals("ROLE_MEMBER")) {
            role1 = Role.ROLE_MEMBER;
        } else {
            role1 = Role.ROLE_VIEWER;
        }

        studioUser.updateRole(role1);
        studioUserRepository.save(studioUser);
    }

    /**
     * Studio 에서 Member 추방
     * @param studioId
     * @param userId
     * @param memberId
     */
    @StudioOwnerAuthorization
    public void deleteMember(Long studioId, Long userId, Long memberId) {
        // 1. Member 가 OWNER 인지 확인
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 유저 Studio 에 존재하지 않음"));

        if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("OWNER 사용자는 추방할 수 없음");
        }

        // 2. Member 추방
        studioUserRepository.delete(studioUser);
    }

    @Transactional(readOnly = true)
    public Studio findByStudioId(Long studioId) {
        return studioRepository.findById(studioId)
                .orElseThrow(() -> new IllegalArgumentException("Studio not found"));
    }

    @StudioOwnerAuthorization
    public void deleteStudio(Long studioId, Long userId) {
//        List<StudioCharacter> characters = characterRepository.findByStudioId(studioId);
//        for (StudioCharacter character : characters) {
//            if (character.getImageUrl() != null) {
//                String imageKey = character.getImageUrl().substring(character.getImageUrl().lastIndexOf('/') + 1);
//                amazonS3.deleteObject(new DeleteObjectRequest(bucket, imageKey));
//            }
//            characterRepository.delete(character);
//        }
        studioRepository.deleteById(studioId);  // 관련된 모든 엔티티가 하드 딜리트
    }

    // 스튜디오 가입 신청 로직
    public void joinRequest(Long studioId, Long userId) {
        User user = userService.findUserById(userId);

        Studio studio = findByStudioId(studioId);

        if (studio.getName().equals("private")) {
            throw new ConflictException("개인 스튜디오 가입 불가");
        }

        Optional<StudioUser> pastStudioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId);
        if (pastStudioUser.isPresent()) {
            throw new ConflictException("이미 가입된 스튜디오");
        }

        StudioUser studioUser = StudioUser.builder()
                .createdAt(LocalDateTime.now())
                .user(user)
                .studio(studio)
                .role(Role.ROLE_REQUESTER)
                .build();

        studioUserRepository.save(studioUser);
    }

    // 스튜디오 가입신청 수락 로직
    @StudioOwnerAuthorization
    public void acceptRequest(Long studioId, Long userId, Long memberId, boolean result) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("회원 가입 신청 내역 없음"));

        if (!studioUser.getRole().equals(Role.ROLE_REQUESTER)) {
            throw new ResourceNotFoundException("회원 가입 신청 내역 없음");
        }
        if (result) {
            studioUser.updateRole(Role.ROLE_MEMBER);
            studioUserRepository.save(studioUser);
        } else {
            // 삭제 연산...
            studioUserRepository.delete(studioUser);
        }

    }

    public void leaveStudio(Long studioId, Long userId) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 유저 Studio 에 존재하지 않음"));

        if (studioUser.getRole().equals(Role.ROLE_OWNER)) {
            throw new ForbiddenException("OWNER 권한은 탈퇴할 수 없음");
        }

        // 2. Member 추방
        studioUserRepository.delete(studioUser);
    }

    public Role findMYRole(Long studioId, Long userID) {
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userID)
                .orElseThrow(() -> new ForbiddenException("스튜디오 가입되지 않은 유저"));

        return studioUser.getRole();
    }

    private StudioCharacter makeDefaultCharacter(Studio studio) {
        return StudioCharacter.builder()
                .name("히카리")
                .description("히카리는 순수한 마음을 가진 초등학생으로, 피아노 연주를 사랑하는 소녀입니다. " +
                        "음악에 대한 깊은 애정과 천부적인 재능을 가지고 있습니다. 그녀는 연주로 사람들의 마음을 감동시킵니다. " +
                        "성격은 밝고 친절하며, 친구들과의 관계를 소중히 여기고 있습니다. 히카리는 매일 연습을 통해 더욱 뛰어난 피아니스트가 되기를 꿈꾸며, " +
                        "그녀의 음악은 듣는 이들에게 평화와 행복을 가져다줍니다. 그녀의 순수함과 열정은 주변 사람들에게 긍정적인 영향을 미칩니다.")
                .tags("피아노, 순수, 음악")
                .imageUrl("https://storyboat-character.s3.ap-northeast-2.amazonaws.com/img1.jpg")
                .studio(studio)
                .build();
    }
}
