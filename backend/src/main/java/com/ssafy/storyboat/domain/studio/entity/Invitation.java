package com.ssafy.storyboat.domain.studio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invitation")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_id")
    private Long invitationId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id")
    private Studio studio;

    private String title;

    private String description;

    public void updateTitle(String title) {
        this.title = title;
    }
    public void updateDescription(String description) {
        this.description = description;
    }

    public void updateStudio(Studio studio) {
        this.studio = studio;
    }
}
