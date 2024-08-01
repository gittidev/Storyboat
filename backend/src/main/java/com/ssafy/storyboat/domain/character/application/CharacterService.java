package com.ssafy.storyboat.domain.character.application;

import com.ssafy.storyboat.common.auth.dto.CustomOAuth2User;
import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.common.exception.BadRequestException;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.UnauthorizedException;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.character.repository.CharacterRepository;
import com.ssafy.storyboat.domain.idea.entity.StudioIdea;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import com.ssafy.storyboat.domain.studio.repository.StudioUserRepository;
import lombok.RequiredArgsConstructor;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.storyboat.domain.character.dto.CharacterCreateRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CharacterService {

    private final StudioRepository studioRepository;
    private final StudioUserRepository studioUserRepository;
    private final CharacterRepository characterRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile file) {
        if (file.isEmpty())
            throw new BadRequestException("업로드할 파일이 없습니다.");
        try {
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());

            String uniqueFileName = file.getOriginalFilename() +"-"+ UUID.randomUUID();

            amazonS3.putObject(bucket, uniqueFileName, file.getInputStream(), objectMetadata);
            return amazonS3.getUrl(bucket, uniqueFileName).toString();
        } catch (IOException e) {
            throw new InternalServerErrorException("S3 파일 업로드 중 오류가 발생했습니다.");
        }
    }
    private StudioUser checkAccessRole(CustomOAuth2User customOAuth2User, Long studioId) {
        Long userId = customOAuth2User.getUserId();
        StudioUser studioUser = studioUserRepository.findByStudio_StudioIdAndUser_UserId(studioId, userId)
                .orElseThrow(() -> new ForbiddenException("접근할 수 없는 경로입니다."));
        if (studioUser.getRole() == Role.ROLE_REQUESTER) {
            throw new UnauthorizedException("해당 스튜디오에 가입되어 있지 않습니다.");
        }
        return studioUser;
    }

    private void checkWriteRole(CustomOAuth2User customOAuth2User, Long studioId) {
        StudioUser studioUser = checkAccessRole(customOAuth2User, studioId);
        if (studioUser.getRole() == Role.ROLE_VIEWER) {
            throw new UnauthorizedException("쓰기/생성 권한이 없는 유저입니다.");
        }
    }

    public void createCharacter(CustomOAuth2User customOAuth2User, Long studioId, CharacterCreateRequest characterCreateRequest, MultipartFile file) {
        String imageUrl = uploadFile(file);

        // 캐릭터 생성 로직
        checkWriteRole(customOAuth2User, studioId);

        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ForbiddenException("없는 스튜디오 입니다."));

        StudioCharacter studioCharacter = StudioCharacter.builder()
                .studio(studio)
                .name(characterCreateRequest.getName())
                .description(characterCreateRequest.getDescription())
                .imageUrl(imageUrl)
                .build();

        characterRepository.save(studioCharacter);
    }

}
