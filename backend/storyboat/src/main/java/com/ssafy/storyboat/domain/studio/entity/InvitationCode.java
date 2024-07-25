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
    private Long id;

    @OneToOne
    @JoinColumn(name = "studio_id")
    private Studio studio;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @NotNull
    private String code;
}
