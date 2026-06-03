package com.floralshop.order;

import com.floralshop.common.ApiResponse;
import com.floralshop.order.dto.CheckoutRequest;
import jakarta.validation.Valid;
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
    public ApiResponse<OrderService.CheckoutResult> checkout(@Valid @RequestBody CheckoutRequest request) {
        // TODO: 從 SecurityContext 取得登入會員 id
        Long memberId = currentMemberId();
        return ApiResponse.ok(orderService.checkout(request, memberId));
    }

    @GetMapping
    public ApiResponse<List<Order>> myOrders() {
        return ApiResponse.ok(orderRepository.findByMemberIdOrderByCreatedAtDesc(currentMemberId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> detail(@PathVariable Long id) {
        return ApiResponse.ok(orderRepository.findById(id).orElseThrow());
    }

    private Long currentMemberId() {
        // TODO: SecurityContextHolder.getContext().getAuthentication() → memberId
        return 1L;
    }
}
