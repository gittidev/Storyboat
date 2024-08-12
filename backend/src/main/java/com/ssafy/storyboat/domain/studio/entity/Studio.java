package com.ssafy.storyboat.domain.studio.entity;

import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.idea.entity.StudioIdea;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Studio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studio_id")
    private Long studioId;

    private String name;

    private String description;

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioUser> studioUsers = new ArrayList<>();

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioCharacter> studioCharacters = new ArrayList<>();

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioIdea> studioIdeas = new ArrayList<>();

    @OneToOne(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    private Invitation invitation;

    @OneToOne(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    InvitationCode invitationCode;

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioStory> studioStories = new ArrayList<>();

    public void updateStudioName(String name) {
        this.name = name;
    }

    public void updateStudioDescription(String description) {
        this.description = description;
    }

    public void addStudioCharacter(StudioCharacter studioCharacters) {
        this.studioCharacters.add(studioCharacters);
    }
}
