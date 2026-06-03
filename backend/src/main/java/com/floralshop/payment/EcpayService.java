package com.floralshop.payment;

import com.floralshop.order.Order;
import org.springframework.stereotype.Service;

/**
 * 2.2 綠界 ECPay 金流整合（骨架）。
 * 實作時：依綠界 AIO 規格組裝參數、以 HashKey/HashIV 產生 CheckMacValue，
 * 回傳前端可導向的付款頁 URL；並於 /payments/ecpay/callback 驗證回傳簽章。
 */
@Service
public class EcpayService {

    /** 產生綠界付款導向 URL */
    public String createPaymentUrl(Order order) {
        // TODO: 組裝綠界參數 + CheckMacValue（SHA256）
        return "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5?orderNo=" + order.getOrderNo();
    }

    /** 驗證綠界回呼簽章 */
    public boolean verifyCallback(java.util.Map<String, String> params) {
        // TODO: 重新計算 CheckMacValue 並比對
        return true;
    }
}
