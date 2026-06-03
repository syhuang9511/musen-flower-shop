package com.floralshop.order;

import com.floralshop.cart.ShippingMethod;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_no", nullable = false, unique = true)
    private String orderNo;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private OrderStatus status = OrderStatus.ACCEPTED;

    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_method", nullable = false, length = 24)
    private ShippingMethod shippingMethod;

    private String recipientName;
    private String recipientPhone;
    private String address;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "coupon_code")
    private String couponCode;

    /** 5.2 是否為送禮 + 客製化資訊 */
    private boolean isGift = false;

    @Embedded
    private GiftInfo giftInfo;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
