package com.ssafy.storyboat.common.s3;

public enum Bucket {
    PROFILE("storyboat-profile"),
    CHARACTER("storyboat-character");

    private final String bucketName;

    Bucket(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getBucketName() {
        return bucketName;
    }
}
