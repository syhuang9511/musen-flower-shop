package com.floralshop.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByMemberId(Long memberId);

    boolean existsByMemberIdAndProductId(Long memberId, Long productId);

    void deleteByMemberIdAndProductId(Long memberId, Long productId);
}
