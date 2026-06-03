package com.floralshop.coupon;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/** 優惠券核銷紀錄 — 用以檢查會員是否已重複使用。 */
@Entity
@Table(name = "coupon_usages")
@Getter
@Setter
public class CouponUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coupon_id", nullable = false)
    private Long couponId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "used_at", nullable = false)
    private Instant usedAt = Instant.now();
}
