package com.floralshop.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/** 4.2 常用收件人：可保存多組，結帳一鍵套用。 */
@Entity
@Table(name = "member_addresses")
@Getter
@Setter
public class MemberAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String recipientName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(name = "is_default")
    private boolean isDefault = false;
}
