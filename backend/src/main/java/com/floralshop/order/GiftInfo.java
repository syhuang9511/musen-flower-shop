package com.floralshop.order;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

/**
 * 5.2 送禮專用客製化資訊 — 內嵌於訂單，落庫後同步至專人外送單。
 */
@Embeddable
@Getter
@Setter
public class GiftInfo {

    @Column(name = "gift_recipient_name")
    private String recipientName;

    @Column(name = "gift_recipient_phone")
    private String recipientPhone;

    /** 店家 / 單位名稱（商務祝賀花籃） */
    @Column(name = "gift_company_name")
    private String companyName;

    @Column(name = "gift_card_message", columnDefinition = "text")
    private String cardMessage;

    /** 期望送達時間區間，例如 AM_09_12 / PM_14_17 */
    @Column(name = "gift_delivery_slot")
    private String deliverySlot;
}
