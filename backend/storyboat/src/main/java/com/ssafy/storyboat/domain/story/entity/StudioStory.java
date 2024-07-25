package com.ssafy.storyboat.domain.story.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StudioStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
