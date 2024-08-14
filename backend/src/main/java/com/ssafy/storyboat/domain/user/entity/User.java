package com.ssafy.storyboat.domain.user.entity;

import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
//@SQLDelete(sql = "UPDATE user SET is_deleted = true WHERE user_id = ?")
@FilterDef(name = "deletedUserFilter", parameters = @ParamDef(name = "isDeleted", type = Boolean.class))
@Filter(name = "deletedUserFilter", condition = "is_deleted = :isDeleted")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email")
    private String email;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "provider")
    private String provider;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    // Profile 테이블과 매핑, 1:1 즉시 로딩, 영속성 전이
    @Setter
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Profile profile;
    // User <-> Profile 까지만 매핑되어 있음

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<RefreshToken> refreshTokens = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioUser> studioUsers = new ArrayList<>();

    public void revokeUser() {
        this.isDeleted = false;
    }

    public void deleteUser() { this.isDeleted = true; }

    public void updateProfile(Profile profile) {
        this.profile = profile;
        profile.setUser(this);
    }
}
