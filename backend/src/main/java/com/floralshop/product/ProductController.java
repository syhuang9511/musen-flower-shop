package com.floralshop.product;

import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ApiResponse<List<Product>> list() {
        return ApiResponse.ok(repository.findByActiveTrue());
    }

    @GetMapping("/featured")
    public ApiResponse<List<Product>> featured() {
        return ApiResponse.ok(repository.findByActiveTrueAndFeaturedTrue());
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> detail(@PathVariable Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "商品不存在"));
        return ApiResponse.ok(product);
    }
}
