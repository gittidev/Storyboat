package com.ssafy.storyboat.domain.studio.entity;

import com.ssafy.storyboat.domain.tag.entity.Tag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invitation_tag")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class InvitationTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_tag_id")
    private Long invitationTagId;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;

    @ManyToOne
    @JoinColumn(name = "invitation_id")
    private Invitation invitation;
}
