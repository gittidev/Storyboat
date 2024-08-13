package com.ssafy.storyboat.domain.studio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "invitation", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvitationTag> invitationTags = new ArrayList<>();

    public void updateTitle(String title) {
        this.title = title;
    }
    public void updateDescription(String description) {
        this.description = description;
    }

    public void updateStudio(Studio studio) {
        this.studio = studio;
    }

    public void setInvitationTags(List<InvitationTag> tags) {
        this.invitationTags.clear();
        this.invitationTags.addAll(tags);
    }
}
