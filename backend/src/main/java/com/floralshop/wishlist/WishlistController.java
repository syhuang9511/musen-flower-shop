package com.floralshop.wishlist;

import com.floralshop.auth.AuthPrincipal;
import com.floralshop.common.ApiResponse;
import com.floralshop.product.Product;
import com.floralshop.product.ProductRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 6.1 收藏機制。訪客收藏暫存於前端 LocalStorage，登入後呼叫 /wishlist/merge 合併。
 */
@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistController(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ApiResponse<List<Product>> list(@AuthenticationPrincipal AuthPrincipal principal) {
        List<Long> ids = wishlistRepository.findByMemberId(principal.id()).stream()
                .map(WishlistItem::getProductId).toList();
        return ApiResponse.ok(productRepository.findAllById(ids));
    }

    @PostMapping
    @Transactional
    public ApiResponse<Void> add(@AuthenticationPrincipal AuthPrincipal principal,
                                  @RequestBody IdRequest request) {
        addInternal(principal.id(), request.productId());
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ApiResponse<Void> remove(@AuthenticationPrincipal AuthPrincipal principal,
                                     @PathVariable Long productId) {
        wishlistRepository.deleteByMemberIdAndProductId(principal.id(), productId);
        return ApiResponse.ok(null);
    }

    /** 6.1 登入後合併訪客收藏 */
    @PostMapping("/merge")
    @Transactional
    public ApiResponse<Void> merge(@AuthenticationPrincipal AuthPrincipal principal,
                                    @RequestBody MergeRequest request) {
        request.productIds().forEach(pid -> addInternal(principal.id(), pid));
        return ApiResponse.ok(null);
    }

    private void addInternal(Long memberId, Long productId) {
        if (wishlistRepository.existsByMemberIdAndProductId(memberId, productId)) return;
        WishlistItem item = new WishlistItem();
        item.setMemberId(memberId);
        item.setProductId(productId);
        wishlistRepository.save(item);
    }

    public record IdRequest(Long productId) {
    }

    public record MergeRequest(List<Long> productIds) {
    }
}
