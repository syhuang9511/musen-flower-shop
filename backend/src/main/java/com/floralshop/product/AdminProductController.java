package com.floralshop.product;

import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import com.floralshop.product.dto.ProductUpsertRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 7. 後台商品管理（上架 / 編輯 / 下架）。
 * 路徑位於 /admin/** → 由 SecurityConfig 限定 ROLE_ADMIN。
 */
@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductRepository repository;

    public AdminProductController(ProductRepository repository) {
        this.repository = repository;
    }

    /** 後台列出全部商品（含已下架） */
    @GetMapping
    public ApiResponse<List<Product>> list() {
        return ApiResponse.ok(repository.findAll());
    }

    /** 上架新商品 */
    @PostMapping
    public ApiResponse<Product> create(@Valid @RequestBody ProductUpsertRequest req) {
        Product product = new Product();
        apply(product, req);
        return ApiResponse.ok(repository.save(product));
    }

    /** 編輯商品 */
    @PutMapping("/{id}")
    public ApiResponse<Product> update(@PathVariable Long id, @Valid @RequestBody ProductUpsertRequest req) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "商品不存在"));
        apply(product, req);
        return ApiResponse.ok(repository.save(product));
    }

    /** 切換上架 / 下架狀態 */
    @PatchMapping("/{id}/active")
    public ApiResponse<Product> toggleActive(@PathVariable Long id, @RequestParam boolean active) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "商品不存在"));
        product.setActive(active);
        return ApiResponse.ok(repository.save(product));
    }

    /** 刪除商品 */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ApiResponse.ok(null);
    }

    private void apply(Product product, ProductUpsertRequest req) {
        product.setName(req.name());
        product.setDescription(req.description());
        product.setPrice(req.price());
        product.setImage(req.image());
        product.setStock(req.stock());
        product.setLogisticsClass(req.logisticsClass());
        product.setVolumeWeight(req.volumeWeight() == null ? 0 : req.volumeWeight());
        product.setFeatured(req.featured());
        product.setActive(req.active());
    }
}
