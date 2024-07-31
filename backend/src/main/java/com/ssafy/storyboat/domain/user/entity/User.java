package com.ssafy.storyboat.domain.user.entity;

import com.ssafy.storyboat.domain.studio.entity.StudioUser;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
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

    // Profile 테이블과 매핑, 1:1 즉시 로딩, 영속성 전이
    @Setter
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;
    // User <-> Profile 까지만 매핑되어 있음

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<RefreshToken> refreshTokens = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<StudioUser> studioUsers = new ArrayList<>();

}
