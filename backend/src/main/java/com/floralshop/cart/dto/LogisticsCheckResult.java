package com.floralshop.cart.dto;

import com.floralshop.cart.ShippingMethod;

import java.util.List;

/**
 * 物流檢核結果 — 回傳前端用以決定哪些配送方式可選 / 置灰，以及溫馨提示文案。
 */
public record LogisticsCheckResult(
        boolean requiresDedicatedTruck,
        List<ShippingMethod> availableMethods,
        String notice
) {
}
