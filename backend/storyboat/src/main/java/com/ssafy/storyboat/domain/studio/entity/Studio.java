package com.ssafy.storyboat.domain.studio.entity;

import com.ssafy.storyboat.domain.character.entity.StudioCharacter;
import com.ssafy.storyboat.domain.idea.entity.StudioIdea;
import com.ssafy.storyboat.domain.story.entity.StudioStory;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Studio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studio_id")
    private Long id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioUser> studioUsers;

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioCharacter> studioCharacters;

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioIdea> studioIdeas;

    @OneToOne(mappedBy = "studio")
    private Invitation invitation;

    @OneToOne(mappedBy = "studio")
    InvitationCode invitationCode;

    @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioStory> studioStories;


}
