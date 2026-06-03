package com.floralshop.order;

import com.floralshop.cart.LogisticsRuleService;
import com.floralshop.common.BusinessException;
import com.floralshop.coupon.CouponService;
import com.floralshop.order.dto.CheckoutRequest;
import com.floralshop.payment.EcpayService;
import com.floralshop.product.Product;
import com.floralshop.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 結帳主流程：串接 5.1 物流防呆、5.3 優惠券、訂單落庫、綠界金流。
 */
@Service
public class OrderService {

    private final LogisticsRuleService logisticsRuleService;
    private final CouponService couponService;
    private final EcpayService ecpayService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderService(LogisticsRuleService logisticsRuleService, CouponService couponService,
                        EcpayService ecpayService, ProductRepository productRepository,
                        OrderRepository orderRepository) {
        this.logisticsRuleService = logisticsRuleService;
        this.couponService = couponService;
        this.ecpayService = ecpayService;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public record CheckoutResult(String orderNo, BigDecimal total, String ecpayRedirectUrl) {
    }

    @Transactional
    public CheckoutResult checkout(CheckoutRequest req, Long memberId) {
        // 5.1 後端權威防呆：阻擋被繞過的非法配送方式
        logisticsRuleService.assertShippingAllowed(req.items(), req.shippingMethod());

        Map<Long, Product> products = loadProducts(req);
        BigDecimal subtotal = req.items().stream()
                .map(i -> products.get(i.productId()).getPrice().multiply(BigDecimal.valueOf(i.qty())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 5.3 優惠券折扣
        BigDecimal discount = BigDecimal.ZERO;
        if (req.couponCode() != null && !req.couponCode().isBlank()) {
            var result = couponService.validate(req.couponCode(), subtotal, memberId);
            discount = result.discountAmount();
        }

        Order order = buildOrder(req, memberId, products, subtotal, discount);
        orderRepository.save(order);

        // 2.2 綠界付款導向
        String redirectUrl = ecpayService.createPaymentUrl(order);
        return new CheckoutResult(order.getOrderNo(), order.getTotal(), redirectUrl);
    }

    private Order buildOrder(CheckoutRequest req, Long memberId, Map<Long, Product> products,
                             BigDecimal subtotal, BigDecimal discount) {
        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setMemberId(memberId);
        order.setShippingMethod(req.shippingMethod());
        order.setRecipientName(req.recipient().name());
        order.setRecipientPhone(req.recipient().phone());
        order.setAddress(req.recipient().address());
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTotal(subtotal.subtract(discount).add(order.getShippingFee()));
        order.setCouponCode(req.couponCode());

        if (req.giftInfo() != null) {
            order.setGift(true);
            GiftInfo gift = new GiftInfo();
            gift.setRecipientName(req.giftInfo().recipientName());
            gift.setRecipientPhone(req.giftInfo().recipientPhone());
            gift.setCompanyName(req.giftInfo().companyName());
            gift.setCardMessage(req.giftInfo().cardMessage());
            gift.setDeliverySlot(req.giftInfo().deliverySlot());
            order.setGiftInfo(gift);
        }

        req.items().forEach(i -> {
            Product p = products.get(i.productId());
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(p.getId());
            item.setProductName(p.getName());
            item.setUnitPrice(p.getPrice());
            item.setQty(i.qty());
            order.getItems().add(item);
        });
        return order;
    }

    private Map<Long, Product> loadProducts(CheckoutRequest req) {
        var ids = req.items().stream().map(i -> i.productId()).toList();
        var products = productRepository.findAllById(ids).stream()
                .collect(java.util.stream.Collectors.toMap(Product::getId, p -> p));
        if (products.size() != ids.size()) {
            throw new BusinessException(40400, "訂單含無效商品");
        }
        return products;
    }

    private String generateOrderNo() {
        // 以時間戳為基底；正式環境可改用序列 / 雪花演算法避免碰撞
        return "FS" + System.currentTimeMillis();
    }
}
