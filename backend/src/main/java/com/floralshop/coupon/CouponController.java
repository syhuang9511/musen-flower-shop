package com.floralshop.coupon;

import com.floralshop.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public ApiResponse<CouponService.ValidationResult> validate(@RequestBody ValidateRequest request) {
        // TODO: 從 SecurityContext 取得登入會員 id（此處先傳 null 以示意）
        Long memberId = null;
        return ApiResponse.ok(couponService.validate(request.code(), request.subtotal(), memberId));
    }

    public record ValidateRequest(String code, BigDecimal subtotal) {
    }
}
