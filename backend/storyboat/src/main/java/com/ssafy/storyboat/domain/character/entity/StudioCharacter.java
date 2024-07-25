package com.ssafy.storyboat.domain.character.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StudioCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
