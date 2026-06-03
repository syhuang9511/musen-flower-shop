package com.floralshop.coupon;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "coupons")
@Getter
@Setter
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private DiscountType type;

    /** 折扣值：FIXED → 折抵金額；PERCENTAGE → 折扣百分比(0-100)；FREE_SHIPPING → 忽略 */
    @Column(precision = 10, scale = 2)
    private BigDecimal value;

    /** 最低消費金額門檻 */
    @Column(name = "min_spend", precision = 10, scale = 2)
    private BigDecimal minSpend = BigDecimal.ZERO;

    /** 發行總量（剩餘庫存） */
    @Column(name = "total_quantity")
    private Integer totalQuantity;

    /** 每人限領 / 限用次數 */
    @Column(name = "per_user_limit")
    private Integer perUserLimit = 1;

    @Column(name = "valid_from")
    private Instant validFrom;

    @Column(name = "valid_until")
    private Instant validUntil;

    private boolean active = true;

    public enum DiscountType {
        FIXED,         // 滿額現折
        PERCENTAGE,    // 百分比折扣
        FREE_SHIPPING  // 免運券
    }
}
