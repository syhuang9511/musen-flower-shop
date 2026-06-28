package com.floralshop.order;

import com.floralshop.auth.AuthPrincipal;
import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import com.floralshop.order.dto.CheckoutRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /** 結帳建立訂單 → 回傳綠界付款導向 URL */
    @PostMapping
    public ApiResponse<OrderService.CheckoutResult> checkout(@AuthenticationPrincipal AuthPrincipal principal,
                                                              @Valid @RequestBody CheckoutRequest request) {
        return ApiResponse.ok(orderService.checkout(request, principal.id()));
    }

    @GetMapping
    public ApiResponse<List<Order>> myOrders(@AuthenticationPrincipal AuthPrincipal principal) {
        return ApiResponse.ok(orderRepository.findByMemberIdOrderByCreatedAtDesc(principal.id()));
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> detail(@AuthenticationPrincipal AuthPrincipal principal,
                                     @PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("訂單不存在"));
        if (!order.getMemberId().equals(principal.id())) {
            throw new BusinessException(40300, "無操作權限");
        }
        return ApiResponse.ok(order);
    }
}
