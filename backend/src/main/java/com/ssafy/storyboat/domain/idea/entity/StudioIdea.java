package com.ssafy.storyboat.domain.idea.entity;

import com.ssafy.storyboat.domain.studio.entity.Studio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "studio_idea")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class StudioIdea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studio_idea_id")
    private Long studioIdeaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id")
    private Studio studio;

    private String title;

    private String content;

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
