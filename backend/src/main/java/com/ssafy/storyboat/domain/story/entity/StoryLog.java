package com.ssafy.storyboat.domain.story.entity;

import com.ssafy.storyboat.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "story_log")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class StoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "story_log_id")
    private Long studioLogId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_story_id")
    private StudioStory studioStory;

    private String key;
}
