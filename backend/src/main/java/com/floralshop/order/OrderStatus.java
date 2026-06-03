package com.floralshop.order;

/** 4.2 訂單狀態軸 */
public enum OrderStatus {
    ACCEPTED,    // 已接單
    PREPARING,   // 備貨中
    SHIPPING,    // 配送中
    DELIVERED,   // 已送達
    COMPLETED,   // 已完成
    CANCELLED    // 已取消
}
