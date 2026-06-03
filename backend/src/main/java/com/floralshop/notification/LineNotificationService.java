package com.floralshop.notification;

import com.floralshop.order.Order;
import org.springframework.stereotype.Service;

/**
 * 2.2 / 4.2 LINE Messaging API 通知（骨架）。
 * 於重要訂單節點主動推播給已綁定 LINE 的會員，例如：
 * 「花束已由貨車送達指定地點」、送禮成功致謝等。
 */
@Service
public class LineNotificationService {

    /** 推送訂單狀態更新給訂購人 */
    public void pushOrderStatus(Order order, String message) {
        if (order == null) return;
        // TODO: 呼叫 https://api.line.me/v2/bot/message/push，帶 lineUserId 與 Bearer access token
        System.out.printf("[LINE] 推播訂單 %s：%s%n", order.getOrderNo(), message);
    }
}
