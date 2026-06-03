package com.floralshop.coupon;

import com.floralshop.common.BusinessException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

/**
 * 5.3 優惠券折扣計算引擎 — 後端權威校驗：
 * 有效期限、剩餘庫存、最低消費金額、是否重複使用。
 */
@Service
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository usageRepository;

    public CouponService(CouponRepository couponRepository, CouponUsageRepository usageRepository) {
        this.couponRepository = couponRepository;
        this.usageRepository = usageRepository;
    }

    public record ValidationResult(String code, BigDecimal discountAmount, boolean freeShipping) {
    }

    /**
     * @param code     優惠碼
     * @param subtotal 商品小計
     * @param memberId 當前會員（null 表示訪客 — 不可使用需登入券）
     */
    public ValidationResult validate(String code, BigDecimal subtotal, Long memberId) {
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new BusinessException(40020, "優惠碼不存在或已停用"));

        Instant now = Instant.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            throw new BusinessException(40021, "優惠碼尚未開始");
        }
        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            throw new BusinessException(40022, "優惠碼已過期");
        }
        if (coupon.getTotalQuantity() != null && coupon.getTotalQuantity() <= 0) {
            throw new BusinessException(40023, "優惠碼已被領取完畢");
        }
        if (coupon.getMinSpend() != null && subtotal.compareTo(coupon.getMinSpend()) < 0) {
            throw new BusinessException(40024,
                    "未達最低消費金額 NT$ " + coupon.getMinSpend().toBigInteger());
        }
        if (memberId == null) {
            throw new BusinessException(40025, "請先登入會員以使用優惠碼");
        }
        if (coupon.getPerUserLimit() != null) {
            long used = usageRepository.countByCouponIdAndMemberId(coupon.getId(), memberId);
            if (used >= coupon.getPerUserLimit()) {
                throw new BusinessException(40026, "您已使用過此優惠碼");
            }
        }

        return computeDiscount(coupon, subtotal);
    }

    private ValidationResult computeDiscount(Coupon coupon, BigDecimal subtotal) {
        return switch (coupon.getType()) {
            case FIXED -> new ValidationResult(coupon.getCode(),
                    coupon.getValue().min(subtotal), false);
            case PERCENTAGE -> {
                BigDecimal discount = subtotal
                        .multiply(coupon.getValue())
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                yield new ValidationResult(coupon.getCode(), discount, false);
            }
            case FREE_SHIPPING -> new ValidationResult(coupon.getCode(), BigDecimal.ZERO, true);
        };
    }
}
