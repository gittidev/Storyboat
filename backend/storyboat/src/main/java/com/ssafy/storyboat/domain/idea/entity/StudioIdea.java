package com.ssafy.storyboat.domain.idea.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StudioIdea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
