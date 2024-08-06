package com.ssafy.storyboat.domain.user.entity;

import com.ssafy.storyboat.domain.tag.entity.ProfileTag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "profile")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    // User <-> Profile 매핑, 1 : 1 즉시로딩, 영속성 전이
    @OneToOne//(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "pen_name")
    private String penName;

    private String introduction;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileTag> profileTags;

    // User <-> Profile 까지만 매핑되어 있음

    public void setUser(User user) {
        user.setProfile(this);
        this.user = user;
    }

    public void updatePenName(String newPenName) {
        this.penName = newPenName;
    }

    public void updateIntroduction(String newIntroduction) {
        this.introduction = newIntroduction;
    }

    public void updateImageUrl(String newImageUrl) {
        this.imageUrl = newImageUrl;
    }

    public void updateProfileTags(List<ProfileTag> newTags) {
        // 기존 태그 삭제
        profileTags.clear();
        profileTags.addAll(newTags);
    }

}
