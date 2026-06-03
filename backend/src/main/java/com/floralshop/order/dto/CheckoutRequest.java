package com.floralshop.order.dto;

import com.floralshop.cart.ShippingMethod;
import com.floralshop.cart.dto.CartItemDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CheckoutRequest(
        @NotEmpty @Valid List<CartItemDto> items,
        @NotNull ShippingMethod shippingMethod,
        @NotNull Recipient recipient,
        GiftInfoDto giftInfo,
        String couponCode
) {
    public record Recipient(String name, String phone, String address) {
    }

    public record GiftInfoDto(
            String recipientName,
            String recipientPhone,
            String companyName,
            String cardMessage,
            String deliverySlot
    ) {
    }
}
