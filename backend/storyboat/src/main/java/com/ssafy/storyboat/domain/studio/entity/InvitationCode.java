package com.ssafy.storyboat.domain.studio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class InvitationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
