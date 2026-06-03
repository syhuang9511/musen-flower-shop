package com.floralshop.cart;

import com.floralshop.cart.dto.CartItemDto;
import com.floralshop.cart.dto.LogisticsCheckResult;
import com.floralshop.common.BusinessException;
import com.floralshop.product.Product;
import com.floralshop.product.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ⭐ 專案核心：智慧物流配送過濾（5.1）
 *
 * 「最高物流限制原則」：購物車中只要包含任一 BULKY / FRAGILE 商品，
 * 整筆訂單即全面停用超商取貨，強制鎖定「專人貨車外送」。
 *
 * 此規則同時由前端 stores/cart.js 即時呈現，並在此後端 **權威性** 強制執行
 * （防止前端被繞過 — 8.x 防呆 / 安全）。
 */
@Service
public class LogisticsRuleService {

    private static final String DEDICATED_TRUCK_NOTICE =
            "由於您購物車中包含大型或脆弱植栽，為了確保商品品質，本次訂單將統一由專業貨車為您專人配送。";

    private final ProductRepository productRepository;

    public LogisticsRuleService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /** 依購物車內容計算可用配送方式。 */
    public LogisticsCheckResult evaluate(List<CartItemDto> items) {
        boolean requiresTruck = resolveProducts(items).stream()
                .anyMatch(p -> p.getLogisticsClass().requiresDedicatedTruck());

        if (requiresTruck) {
            return new LogisticsCheckResult(
                    true,
                    List.of(ShippingMethod.TRUCK_DEDICATED),
                    DEDICATED_TRUCK_NOTICE);
        }
        return new LogisticsCheckResult(
                false,
                List.of(ShippingMethod.CVS_711, ShippingMethod.HOME_DELIVERY),
                null);
    }

    /**
     * 結帳時的權威防呆：驗證使用者選擇的配送方式是否合法。
     * 若購物車需專人貨車卻選了超商 → 擲出例外阻擋下單。
     */
    public void assertShippingAllowed(List<CartItemDto> items, ShippingMethod chosen) {
        LogisticsCheckResult result = evaluate(items);
        if (!result.availableMethods().contains(chosen)) {
            throw new BusinessException(40010,
                    "所選配送方式不適用於本購物車內容，請選擇專人貨車外送。");
        }
    }

    private List<Product> resolveProducts(List<CartItemDto> items) {
        List<Long> ids = items.stream().map(CartItemDto::productId).toList();
        List<Product> products = productRepository.findAllById(ids);
        if (products.size() != ids.size()) {
            throw new BusinessException(40400, "購物車中含無效商品");
        }
        return products;
    }
}
