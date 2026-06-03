package com.floralshop.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "members")
@Getter
@Setter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    /** 第三方登入者可為 null */
    @Column(name = "password_hash")
    private String passwordHash;

    private String name;
    private String phone;

    /** LOCAL / GOOGLE / LINE */
    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 16)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "provider_uid")
    private String providerUid;

    /** 4.2 引導綁定 LINE 後存放 userId，供 Messaging API 推播 */
    @Column(name = "line_user_id")
    private String lineUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Role role = Role.MEMBER;

    @Column(nullable = false)
    private Integer points = 0;

    private boolean emailVerified = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public enum AuthProvider { LOCAL, GOOGLE, LINE }

    public enum Role { MEMBER, ADMIN }
}
