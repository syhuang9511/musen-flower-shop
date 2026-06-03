package com.floralshop.wishlist;

import com.floralshop.common.ApiResponse;
import com.floralshop.product.Product;
import com.floralshop.product.ProductRepository;
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
    public ApiResponse<List<Product>> list() {
        Long memberId = currentMemberId();
        List<Long> ids = wishlistRepository.findByMemberId(memberId).stream()
                .map(WishlistItem::getProductId).toList();
        return ApiResponse.ok(productRepository.findAllById(ids));
    }

    @PostMapping
    @Transactional
    public ApiResponse<Void> add(@RequestBody IdRequest request) {
        addInternal(currentMemberId(), request.productId());
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ApiResponse<Void> remove(@PathVariable Long productId) {
        wishlistRepository.deleteByMemberIdAndProductId(currentMemberId(), productId);
        return ApiResponse.ok(null);
    }

    /** 6.1 登入後合併訪客收藏 */
    @PostMapping("/merge")
    @Transactional
    public ApiResponse<Void> merge(@RequestBody MergeRequest request) {
        Long memberId = currentMemberId();
        request.productIds().forEach(pid -> addInternal(memberId, pid));
        return ApiResponse.ok(null);
    }

    private void addInternal(Long memberId, Long productId) {
        if (wishlistRepository.existsByMemberIdAndProductId(memberId, productId)) return;
        WishlistItem item = new WishlistItem();
        item.setMemberId(memberId);
        item.setProductId(productId);
        wishlistRepository.save(item);
    }

    private Long currentMemberId() {
        // TODO: 由 SecurityContext 取得
        return 1L;
    }

    public record IdRequest(Long productId) {
    }

    public record MergeRequest(List<Long> productIds) {
    }
}
