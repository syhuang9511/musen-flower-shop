package com.floralshop.product;

/**
 * 商品物流類別（5.1 智慧物流配送過濾機制）
 */
public enum LogisticsClass {
    /** 一般資材：營養土、肥料、花盆、小工具 → 可超商 / 宅配 */
    GENERAL,
    /** 大型盆栽 / 祝賀大花籃 → 超商尺寸限制，強制專人貨車 */
    BULKY,
    /** 高脆弱鮮花 → 運送極易損壞，強制專人貨車 */
    FRAGILE;

    /** 是否限制只能專人貨車外送 */
    public boolean requiresDedicatedTruck() {
        return this == BULKY || this == FRAGILE;
    }
}
