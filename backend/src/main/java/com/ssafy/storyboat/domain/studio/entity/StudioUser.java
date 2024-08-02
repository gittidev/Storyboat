package com.ssafy.storyboat.domain.studio.entity;

import com.ssafy.storyboat.common.dto.Role;
import com.ssafy.storyboat.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "studio_user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class StudioUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studio_user_id")
    private Long studioUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id")
    private Studio studio;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "reg_date")
    private LocalDateTime createdAt;

    public void setStudio(Studio studio) {
        this.studio = studio;
        studio.getStudioUsers().add(this);
    }

    public void setUser(User user) {
        this.user = user;
        user.getStudioUsers().add(this);
    }

    public void updateRole(Role role) {
        this.role = role;
    }
}
