package com.ssafy.storyboat.domain.story.entity;

import com.ssafy.storyboat.domain.studio.entity.Studio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    @Column(name = "last_modified")
    private LocalDateTime lastModifiedDate;

    private String title;

    public void updateLastModified(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}
