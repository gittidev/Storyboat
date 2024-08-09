package com.ssafy.storyboat.domain.character.application;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.storyboat.common.exception.BadRequestException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.common.s3.Bucket;
import com.ssafy.storyboat.common.s3.S3Repository;
import com.ssafy.storyboat.domain.character.dto.CharacterCreateRequest;
import com.ssafy.storyboat.domain.character.dto.CharacterUpdateRequest;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.character.repository.CharacterRepository;
import com.ssafy.storyboat.domain.studio.application.StudioService;
import com.ssafy.storyboat.domain.studio.application.authorization.StudioWriteAuthorization;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class CharacterCommandService {

    private final StudioRepository studioRepository;
    private final CharacterRepository characterRepository;
//    private final AmazonS3 amazonS3;
    private final S3Repository s3Repository;
    private final StudioService studioService;
    private final Bucket bucket = Bucket.CHARACTER;

    @Transactional
    @StudioWriteAuthorization
    public void createCharacter(Long studioId, Long userId, CharacterCreateRequest characterCreateRequest, MultipartFile file) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스튜디오 존재하지 않음"));

        String imageUrl = s3Repository.uploadFile(file, bucket);
        StudioCharacter studioCharacter = StudioCharacter.builder()
                .studio(studio)
                .name(characterCreateRequest.getName())
                .description(characterCreateRequest.getDescription())
                .tags(characterCreateRequest.getTags())
                .imageUrl(imageUrl)
                .build();

        characterRepository.save(studioCharacter);
    }

    @StudioWriteAuthorization
    @Transactional
    public void updateCharacter(Long studioId, Long userId,
                                Long characterId, CharacterUpdateRequest updateRequest,
                                MultipartFile file) {
        // 엔티티 조회
        StudioCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new ResourceNotFoundException("찾을 수 없는 캐릭터입니다"));

        // 이미지가 변경된 경우
        if (file != null && !file.isEmpty()) {
            // 기존 이미지 URL이 있는 경우 S3에서 삭제
            if (character.getImageUrl() != null) {
                s3Repository.deleteFile(character.getImageUrl(), bucket);
            }

            // 새 이미지 S3에 업로드
            String newImageUrl = s3Repository.uploadFile(file, bucket);
            character.updateImageUrl(newImageUrl);
        }

        // 이름과 설명 업데이트
        character.updateInfo(updateRequest.getName(), updateRequest.getDescription(), updateRequest.getTags());

        // 데이터베이스에 저장
        characterRepository.save(character);
    }

    @Transactional
    @StudioWriteAuthorization
    public void deleteCharacter(Long studioId, Long userId, Long characterId) {
        // 엔티티가 존재하는지 확인
        if (!characterRepository.existsById(characterId)) {
            throw new ResourceNotFoundException("캐릭터 존재하지 않음");
        }

        // 스튜디오 캐릭터 엔티티 조회
        StudioCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new ResourceNotFoundException("캐릭터 존재하지 않음"));

        // S3에서 이미지 삭제 -> default 캐릭터 검증 추가 필요
        if (character.getImageUrl() != null && !character.getImageUrl().equals("https://storyboat-character.s3.ap-northeast-2.amazonaws.com/img1.jpg")) {
            s3Repository.deleteFile(character.getImageUrl(), bucket);
        }

        // 데이터베이스에서 엔티티 삭제
        characterRepository.deleteById(characterId);
    }

    public void exportCharacter(Long studioId, Long userId, Long targetStudioId, Long characterId) {
        // 캐릭터가 존재하는지 확인
        StudioCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new ResourceNotFoundException("캐릭터 존재하지 않음"));

        StudioUser targetStudioUser = studioService.isCharacterSendAuthorized(studioId, userId, targetStudioId);

        // 캐릭터 복사
        StudioCharacter newCharacter = new StudioCharacter();

        // 복사한 캐릭터를 새로운 targetStudioUser 에 저장
        newCharacter.updateForCopy(character);
        newCharacter.copyStudio(targetStudioUser.getStudio());
        characterRepository.save(newCharacter);
    }
}
