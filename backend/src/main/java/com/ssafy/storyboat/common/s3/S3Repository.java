package com.ssafy.storyboat.common.s3;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.storyboat.common.exception.BadRequestException;
import com.ssafy.storyboat.common.exception.InternalServerErrorException;
import com.ssafy.storyboat.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

/**
 * S3 파일 업로드 및 삭제를 위한 Repository
 * 추후 리팩토링 시 사용
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class S3Repository {

    private final AmazonS3 amazonS3;

    public String uploadFile(MultipartFile file, Bucket bucket) {
        if (file.isEmpty()) {
            throw new ResourceNotFoundException("업로드할 파일 없음");
        }
        try {
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());

            String uniqueFileName = UUID.randomUUID() + "%" + file.getOriginalFilename();

            log.info("bukect" + bucket.getBucketName());
            amazonS3.putObject(bucket.getBucketName(), uniqueFileName, file.getInputStream(), objectMetadata);
            return amazonS3.getUrl(bucket.getBucketName(), uniqueFileName).toString();
        } catch (IOException e) {
            throw new InternalServerErrorException("S3 파일 업로드 중 오류가 발생");
        }
    }

    public String uploadDefaultProfileImage(Bucket bucket) {
        try {
            ClassPathResource imgFile = new ClassPathResource("/image/default_profile.png");
            byte[] bytes = StreamUtils.copyToByteArray(imgFile.getInputStream());

            MultipartFile multipartFile = new CustomMultipartFile(
                    "file",
                    "default_profile.png",
                    "image/png",
                    bytes
            );
            return uploadFile(multipartFile, bucket);
        } catch (IOException e) {
            throw new InternalServerErrorException("기본 프로필 이미지 로드 중 오류가 발생");
        }
    }

    public void deleteFile(String imageUrl, Bucket bucket) {
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("%") + 1);
        try {
            amazonS3.deleteObject(new DeleteObjectRequest(bucket.getBucketName(), fileName));
        } catch (Exception e) {
            throw new ResourceNotFoundException("S3 파일 삭제 중 오류가 발생");
        }
    }

    @Transactional
    public String updateFile(Long studioId, Long userId, MultipartFile file, Bucket bucket) {
        deleteFile(Objects.requireNonNull(file.getOriginalFilename()), bucket);
        return uploadFile(file, bucket);
    }
}
