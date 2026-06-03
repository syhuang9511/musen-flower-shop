package com.floralshop.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String image;

    @Column(nullable = false)
    private Integer stock = 0;

    /** 5.1 物流類別 */
    @Enumerated(EnumType.STRING)
    @Column(name = "logistics_class", nullable = false, length = 16)
    private LogisticsClass logisticsClass = LogisticsClass.GENERAL;

    /** 7.3 體積權重：累計觸發閾值時可停用超商取貨 */
    @Column(name = "volume_weight")
    private Integer volumeWeight = 0;

    private boolean featured = false;
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
