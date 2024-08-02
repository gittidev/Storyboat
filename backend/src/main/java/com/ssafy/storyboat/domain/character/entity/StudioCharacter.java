package com.ssafy.storyboat.domain.character.entity;

import com.ssafy.storyboat.domain.studio.entity.Studio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "studio_character")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class StudioCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studio_character_id")
    private Long studioCharacterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id")
    private Studio studio;

    private String name;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    public void updateImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void updateNameAndDescription(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void copyStudio(Studio studio) {
        this.studio = studio;
    }

    public void updateForCopy(StudioCharacter studioCharacter) {
        this.studio = studioCharacter.studio;
        this.name = studioCharacter.name;
        this.description = studioCharacter.description;
        this.imageUrl = studioCharacter.imageUrl;
    }
}
