package com.floralshop.coupon;

import com.floralshop.auth.AuthPrincipal;
import com.floralshop.common.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ApiResponse<CouponService.ValidationResult> validate(@AuthenticationPrincipal AuthPrincipal principal,
                                                                  @RequestBody ValidateRequest request) {
        return ApiResponse.ok(couponService.validate(request.code(), request.subtotal(), principal.id()));
    }

    public record ValidateRequest(String code, BigDecimal subtotal) {
    }
}
