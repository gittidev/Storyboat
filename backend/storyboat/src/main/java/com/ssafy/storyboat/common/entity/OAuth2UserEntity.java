package com.ssafy.storyboat.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class OAuth2UserEntity {

    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "email_domain")
    private String emailDomain;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "provider")
    private String provider;
}
