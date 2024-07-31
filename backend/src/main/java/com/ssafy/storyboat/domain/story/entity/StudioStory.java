package com.ssafy.storyboat.domain.story.entity;

import com.ssafy.storyboat.domain.studio.entity.Studio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "studio_story")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class StudioStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studio_story_id")
    private Long studioStoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id")
    private Studio studio;

    private String title;

    @OneToMany(mappedBy = "studioStory", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StoryLog> storyLogs;


}
