<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import CrossSell from '@/components/checkout/CrossSell.vue'

const cart = useCartStore()
const router = useRouter()
</script>

<template>
  <div class="container cart">
    <h1>購物車</h1>

    <p v-if="!cart.items.length" class="notice">購物車是空的，<RouterLink to="/products">去逛逛</RouterLink>。</p>

    <template v-else>
      <table class="cart__table">
        <thead>
          <tr><th>商品</th><th>單價</th><th>數量</th><th>小計</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="i in cart.items" :key="i.productId">
            <td>
              <div class="cart__product">
                <img v-if="i.image" class="cart__thumb" :src="i.image" :alt="i.name" loading="lazy" />
                <span>{{ i.name }}</span>
              </div>
            </td>
            <td>NT$ {{ i.price }}</td>
            <td>
              <div class="qty">
                <button class="qty__btn" :disabled="i.qty <= 1" @click="cart.updateQty(i.productId, i.qty - 1)">−</button>
                <input
                  class="qty__val"
                  type="number"
                  min="1"
                  :value="i.qty"
                  @input="cart.updateQty(i.productId, Number($event.target.value))"
                />
                <button class="qty__btn" @click="cart.updateQty(i.productId, i.qty + 1)">+</button>
              </div>
            </td>
            <td>NT$ {{ i.price * i.qty }}</td>
            <td><button class="btn--ghost btn" @click="cart.removeItem(i.productId)">移除</button></td>
          </tr>
        </tbody>
      </table>

      <!-- 5.1 物流限制即時提示 -->
      <p v-if="cart.logisticsNotice" class="notice">{{ cart.logisticsNotice }}</p>

      <div class="cart__summary">
        <strong>小計：NT$ {{ cart.subtotal }}</strong>
        <button class="btn" @click="router.push('/checkout')">前往結帳</button>
      </div>

      <!-- 6.2 購物車交叉行銷：您的專屬收藏清單 -->
      <CrossSell />
    </template>
  </div>
</template>

<style scoped>
.cart {
  padding: 2rem 1rem;
}
.cart__table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: var(--radius);
  overflow: hidden;
}
.cart__table th,
.cart__table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.cart__summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}
.cart__product {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.cart__thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  flex: 0 0 auto;
}
.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  overflow: hidden;
}
.qty__btn {
  width: 32px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: var(--color-primary);
}
.qty__btn:disabled {
  color: var(--color-muted);
  cursor: not-allowed;
}
.qty__val {
  width: 44px;
  height: 36px;
  border: none;
  border-left: 1px solid var(--color-line);
  border-right: 1px solid var(--color-line);
  text-align: center;
  font: inherit;
  -moz-appearance: textfield;
}
.qty__val::-webkit-outer-spin-button,
.qty__val::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media (max-width: 600px) {
  /* 表格改為卡片式堆疊，避免水平溢出 */
  .cart__table,
  .cart__table tbody,
  .cart__table tr,
  .cart__table td {
    display: block;
    width: 100%;
  }
  .cart__table thead {
    display: none;
  }
  .cart__table tr {
    margin-bottom: 1rem;
    border: 1px solid #eee;
    border-radius: var(--radius);
    padding: 0.5rem 0.8rem;
  }
  .cart__table td {
    border: none;
    padding: 0.35rem 0;
  }
  .cart__summary {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
}
</style>
