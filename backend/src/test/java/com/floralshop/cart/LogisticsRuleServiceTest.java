package com.floralshop.cart;

import com.floralshop.cart.dto.CartItemDto;
import com.floralshop.cart.dto.LogisticsCheckResult;
import com.floralshop.common.BusinessException;
import com.floralshop.product.LogisticsClass;
import com.floralshop.product.Product;
import com.floralshop.product.ProductRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LogisticsRuleServiceTest {

    private final ProductRepository productRepository = mock(ProductRepository.class);
    private final LogisticsRuleService service = new LogisticsRuleService(productRepository);

    private Product product(long id, LogisticsClass cls) {
        Product p = new Product();
        p.setId(id);
        p.setLogisticsClass(cls);
        return p;
    }

    @Test
    void onlyGeneralItems_allowsCvsAndHomeDelivery() {
        when(productRepository.findAllById(List.of(1L)))
                .thenReturn(List.of(product(1L, LogisticsClass.GENERAL)));

        LogisticsCheckResult result = service.evaluate(List.of(new CartItemDto(1L, 1)));

        assertThat(result.requiresDedicatedTruck()).isFalse();
        assertThat(result.availableMethods())
                .containsExactlyInAnyOrder(ShippingMethod.CVS_711, ShippingMethod.HOME_DELIVERY);
    }

    @Test
    void mixedGeneralAndBulky_locksToDedicatedTruck() {
        // 最高物流限制原則：一般資材 + 大型盆栽 → 全車強制專人貨車
        when(productRepository.findAllById(List.of(1L, 2L)))
                .thenReturn(List.of(
                        product(1L, LogisticsClass.GENERAL),
                        product(2L, LogisticsClass.BULKY)));

        LogisticsCheckResult result = service.evaluate(
                List.of(new CartItemDto(1L, 1), new CartItemDto(2L, 1)));

        assertThat(result.requiresDedicatedTruck()).isTrue();
        assertThat(result.availableMethods()).containsExactly(ShippingMethod.TRUCK_DEDICATED);
        assertThat(result.notice()).contains("專人配送");
    }

    @Test
    void choosingCvsWhenTruckRequired_isRejected() {
        when(productRepository.findAllById(List.of(2L)))
                .thenReturn(List.of(product(2L, LogisticsClass.FRAGILE)));

        assertThatThrownBy(() -> service.assertShippingAllowed(
                List.of(new CartItemDto(2L, 1)), ShippingMethod.CVS_711))
                .isInstanceOf(BusinessException.class);
    }
}
