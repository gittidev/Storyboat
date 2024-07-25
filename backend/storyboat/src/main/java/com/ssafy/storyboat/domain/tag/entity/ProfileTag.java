package com.ssafy.storyboat.domain.tag.entity;

import com.ssafy.storyboat.domain.user.entity.Profile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profile_tag")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ProfileTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
