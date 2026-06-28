package com.floralshop.order;

import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import com.floralshop.member.Member;
import com.floralshop.member.MemberRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** 後台訂單管理（ADMIN 限定） */
@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;

    public AdminOrderController(OrderRepository orderRepository, MemberRepository memberRepository) {
        this.orderRepository = orderRepository;
        this.memberRepository = memberRepository;
    }

    @GetMapping
    public ApiResponse<List<AdminOrderDto>> list() {
        List<Order> orders = orderRepository.findAll(
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        return ApiResponse.ok(toAdminDtos(orders));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminOrderDto> detail(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "訂單不存在"));
        Member member = memberRepository.findById(order.getMemberId()).orElse(null);
        return ApiResponse.ok(toAdminDto(order, member));
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ApiResponse<AdminOrderDto> updateStatus(@PathVariable Long id,
                                                    @RequestBody StatusRequest req) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "訂單不存在"));
        order.setStatus(OrderStatus.valueOf(req.status()));
        orderRepository.save(order);
        Member member = memberRepository.findById(order.getMemberId()).orElse(null);
        return ApiResponse.ok(toAdminDto(order, member));
    }

    // ── 私有輔助 ──────────────────────────────────────────

    private List<AdminOrderDto> toAdminDtos(List<Order> orders) {
        List<Long> memberIds = orders.stream().map(Order::getMemberId).distinct().toList();
        Map<Long, Member> memberMap = memberRepository.findAllById(memberIds).stream()
                .collect(Collectors.toMap(Member::getId, m -> m));
        return orders.stream().map(o -> toAdminDto(o, memberMap.get(o.getMemberId()))).toList();
    }

    private AdminOrderDto toAdminDto(Order o, Member m) {
        MemberInfo memberInfo = m == null
                ? new MemberInfo("未知會員", "", "")
                : new MemberInfo(m.getName(), m.getEmail(), m.getPhone() != null ? m.getPhone() : "");

        List<ItemInfo> items = o.getItems().stream()
                .map(i -> new ItemInfo(i.getProductName(), i.getUnitPrice(), i.getQty()))
                .toList();

        RecipientInfo recipient = new RecipientInfo(
                o.getRecipientName(), o.getRecipientPhone(), o.getAddress() != null ? o.getAddress() : "");

        GiftInfoDto gift = null;
        if (o.isGift() && o.getGiftInfo() != null) {
            com.floralshop.order.GiftInfo g = o.getGiftInfo();
            gift = new GiftInfoDto(g.getRecipientName(), g.getRecipientPhone(),
                    g.getCompanyName(), g.getCardMessage(), g.getDeliverySlot());
        }

        PaymentInfo payment = new PaymentInfo("UNPAID", null, null, o.getOrderNo(), null);
        LogisticsInfo logistics = new LogisticsInfo("PENDING", null, null, null, null, null);

        return new AdminOrderDto(
                o.getId(), o.getOrderNo(), o.getCreatedAt().toString(),
                o.getStatus().name(), memberInfo, items,
                o.getSubtotal(), o.getDiscount(), o.getShippingFee(), o.getTotal(),
                o.getCouponCode(), recipient, o.getShippingMethod().name(), gift,
                payment, logistics);
    }

    // ── DTOs ──────────────────────────────────────────────

    public record StatusRequest(String status) {}

    public record MemberInfo(String name, String email, String phone) {}

    public record ItemInfo(String productName, BigDecimal unitPrice, int qty) {}

    public record RecipientInfo(String name, String phone, String address) {}

    public record GiftInfoDto(String recipientName, String recipientPhone,
                               String companyName, String cardMessage, String deliverySlot) {}

    public record PaymentInfo(String status, String method,
                               String ecpayTradeNo, String merchantTradeNo, Instant paidAt) {}

    public record LogisticsInfo(String status, String subType,
                                 String trackingNo, String ecpayLogisticsId,
                                 Object cvsStore, Instant shippedAt) {}

    public record AdminOrderDto(
            Long id, String orderNo, String createdAt, String status,
            MemberInfo member, List<ItemInfo> items,
            BigDecimal subtotal, BigDecimal discount, BigDecimal shippingFee, BigDecimal total,
            String couponCode, RecipientInfo recipient, String shippingMethod,
            GiftInfoDto gift, PaymentInfo payment, LogisticsInfo logistics) {}
}
