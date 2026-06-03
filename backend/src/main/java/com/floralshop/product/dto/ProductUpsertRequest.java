package com.floralshop.product.dto;

import com.floralshop.product.LogisticsClass;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** 後台新增 / 編輯商品的輸入。 */
public record ProductUpsertRequest(
        @NotBlank String name,
        String description,
        @NotNull @DecimalMin("0") BigDecimal price,
        String image,
        @Min(0) int stock,
        @NotNull LogisticsClass logisticsClass,
        Integer volumeWeight,
        boolean featured,
        boolean active
) {
}
