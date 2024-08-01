package com.ssafy.storyboat.domain.character.application;

import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.storyboat.common.exception.BadRequestException;
import com.ssafy.storyboat.common.exception.ForbiddenException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import com.ssafy.storyboat.domain.character.dto.CharacterUpdateRequest;
import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.character.repository.CharacterRepository;
import com.ssafy.storyboat.domain.studio.application.StudioWriteAuthorization;
import com.ssafy.storyboat.domain.studio.entity.Studio;
import com.ssafy.storyboat.domain.studio.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.storyboat.domain.character.dto.CharacterCreateRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CharacterCommandService {

    private final StudioRepository studioRepository;
    private final CharacterRepository characterRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private String uploadFile(MultipartFile file) {
        if (file.isEmpty())
            throw new BadRequestException("업로드할 파일이 없습니다.");
        try {
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());

            String uniqueFileName = UUID.randomUUID()+file.getOriginalFilename();

            amazonS3.putObject(bucket, uniqueFileName, file.getInputStream(), objectMetadata);
            return amazonS3.getUrl(bucket, uniqueFileName).toString();
        } catch (IOException e) {
            throw new InternalServerErrorException("S3 파일 업로드 중 오류가 발생했습니다.");
        }
    }

    @Transactional
    @StudioWriteAuthorization
    public void createCharacter(Long studioId, Long userId, CharacterCreateRequest characterCreateRequest, MultipartFile file) {
        String imageUrl = uploadFile(file);

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

    @Transactional
    public void updateCharacter(Long studioId, Long userId, Long characterId, CharacterUpdateRequest updateRequest, MultipartFile file) throws IOException {
        // 엔티티 조회
        StudioCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new ResourceNotFoundException("찾을 수 없는 캐릭터입니다.: " + characterId));

        // 이미지가 변경된 경우
        if (file != null && !file.isEmpty()) {
            // 기존 이미지 URL이 있는 경우 S3에서 삭제
            if (character.getImageUrl() != null) {
                String oldImageKey = character.getImageUrl().substring(character.getImageUrl().lastIndexOf('/') + 1);
                amazonS3.deleteObject(bucket, oldImageKey);
            }

            // 새 이미지 S3에 업로드
            String newImageKey = file.getOriginalFilename(); // 파일 이름을 키로 사용
            amazonS3.putObject(new PutObjectRequest(bucket, newImageKey, file.getInputStream(), null));
            String newImageUrl = amazonS3.getUrl(bucket, newImageKey).toString();
            character.updateImageUrl(newImageUrl);
        }

        // 나머지 필드 업데이트
        character.setName(updateRequest.getName());
        character.setDescription(updateRequest.getDescription());

        // 데이터베이스에 저장
        characterRepository.save(character);
    }

    @Transactional
    @StudioWriteAuthorization
    public void deleteCharacter(Long studioId, Long userId, Long characterId) {
        // 엔티티가 존재하는지 확인
        if (!characterRepository.existsById(characterId)) {
            throw new ResourceNotFoundException("찾을 수 없는 캐릭터입니다.: " + characterId);
        }

        // 스튜디오 캐릭터 엔티티 조회
        StudioCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new ResourceNotFoundException("찾을 수 없는 캐릭터입니다.: " + characterId));

        // S3에서 이미지 삭제
        if (character.getImageUrl() != null) {
            String imageKey = character.getImageUrl().substring(character.getImageUrl().lastIndexOf('/') + 1);
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, imageKey));
        }

        // 데이터베이스에서 엔티티 삭제
        characterRepository.deleteById(characterId);
    }
}
