package com.floralshop.coupon;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    long countByCouponIdAndMemberId(Long couponId, Long memberId);
}
