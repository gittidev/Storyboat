package com.ssafy.storyboat.domain.studio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitation_code")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class InvitationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_code_id")
    private Long invitationCodeId;

    @OneToOne
    @JoinColumn(name = "studio_id", nullable = false)
    private Studio studio;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @Column(name = "code", nullable = false, unique = true)
    private String code;
}
