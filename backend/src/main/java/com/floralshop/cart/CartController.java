package com.floralshop.cart;

import com.floralshop.cart.dto.CartItemDto;
import com.floralshop.cart.dto.LogisticsCheckResult;
import com.floralshop.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final LogisticsRuleService logisticsRuleService;

    public CartController(LogisticsRuleService logisticsRuleService) {
        this.logisticsRuleService = logisticsRuleService;
    }

    /** 5.1 結帳前即時檢核可用配送方式 */
    @PostMapping("/logistics-check")
    public ApiResponse<LogisticsCheckResult> logisticsCheck(@Valid @RequestBody LogisticsCheckRequest request) {
        return ApiResponse.ok(logisticsRuleService.evaluate(request.items()));
    }

    public record LogisticsCheckRequest(@Valid List<CartItemDto> items) {
    }
}
