<script setup>
import { computed, reactive, ref } from 'vue'
import { useCartStore, ShippingMethod } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderAdminStore } from '@/stores/orderAdmin'
import { useToastStore } from '@/stores/toast'
import { couponApi, cartApi } from '@/api/modules'
import GiftForm from '@/components/checkout/GiftForm.vue'

const cart = useCartStore()
const auth = useAuthStore()
const orders = useOrderAdminStore()
const toast = useToastStore()

const shippingLabels = {
  [ShippingMethod.CVS_711]: '7-11 店到店超商取貨',
  [ShippingMethod.HOME_DELIVERY]: '一般宅配',
  [ShippingMethod.TRUCK_DEDICATED]: '專人貨車外送',
}

const SHIPPING_FEES = {
  [ShippingMethod.CVS_711]: 60,
  [ShippingMethod.HOME_DELIVERY]: 80,
  [ShippingMethod.TRUCK_DEDICATED]: 200,
}

const form = reactive({
  shippingMethod: cart.availableShippingMethods[0],
  recipientName: auth.user?.name || '',
  recipientPhone: '',
  address: '',
  isGift: false,
  gift: null,
  couponCode: '',
})

// 5.3 優惠券
const coupon = reactive({ applied: null, error: '', loading: false })
const shippingFee = computed(() => SHIPPING_FEES[form.shippingMethod] || 0)
const placedOrder = ref(null)
const submitting = ref(false)

// Demo 優惠券（後端未啟動時的後備，與 V2 種子券一致）
const DEMO_COUPONS = {
  WELCOME100: (sub) => (sub >= 1000 ? { discountAmount: 100 } : { error: '需消費滿 NT$1,000' }),
  SPRING15: (sub) => (sub >= 800 ? { discountAmount: Math.round(sub * 0.15) } : { error: '需消費滿 NT$800' }),
  FREESHIP: () => ({ discountAmount: 0, freeShipping: true }),
}

async function applyCoupon() {
  coupon.error = ''
  coupon.loading = true
  try {
    const res = await couponApi.validate({
      code: form.couponCode,
      subtotal: cart.subtotal,
      items: cart.items,
    })
    coupon.applied = res // { code, discountAmount, ... }
  } catch {
    // 後端未啟動 → Demo 後備
    const code = form.couponCode.trim().toUpperCase()
    const rule = DEMO_COUPONS[code]
    const r = rule ? rule(cart.subtotal) : { error: '優惠碼無效' }
    if (r.error) {
      coupon.applied = null
      coupon.error = r.error
    } else {
      coupon.applied = { code, ...r }
    }
  } finally {
    coupon.loading = false
  }
}

const discount = () => coupon.applied?.discountAmount || 0
const effectiveShipping = () => (coupon.applied?.freeShipping ? 0 : shippingFee.value)
const total = () => Math.max(0, cart.subtotal - discount() + effectiveShipping())

async function submitOrder() {
  if (!form.recipientName || !form.recipientPhone) {
    toast.show('請填寫收件人姓名與電話')
    return
  }
  if (form.shippingMethod !== ShippingMethod.CVS_711 && !form.address) {
    toast.show('宅配 / 專人配送請填寫收件地址')
    return
  }
  submitting.value = true
  const payload = {
    items: cart.items,
    shippingMethod: form.shippingMethod,
    recipient: { name: form.recipientName, phone: form.recipientPhone, address: form.address },
    giftInfo: form.isGift ? form.gift : null,
    couponCode: coupon.applied?.code || null,
  }
  try {
    const order = await cartApi.checkout(payload)
    // 後端回傳綠界付款參數 → 導向 ECPay
    window.location.href = order.ecpayRedirectUrl
  } catch {
    // 後端未啟動 → Demo 後備：本地成立訂單（會出現在後台訂單管理）
    const order = orders.placeDemoOrder({
      user: auth.user,
      lineItems: cart.items,
      shippingMethod: form.shippingMethod,
      recipient: { name: form.recipientName, phone: form.recipientPhone, address: form.address },
      gift: form.isGift ? form.gift : null,
      subtotal: cart.subtotal,
      discount: discount(),
      shippingFee: effectiveShipping(),
      total: total(),
      couponCode: coupon.applied?.code || null,
    })
    placedOrder.value = order
    cart.clear()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container checkout">
    <h1>結帳</h1>

    <!-- 訂單成立 -->
    <section v-if="placedOrder" class="block done">
      <div class="done__icon">🌿</div>
      <h2>訂單已成立！</h2>
      <p>訂單編號 <strong>{{ placedOrder.orderNo }}</strong></p>
      <p class="done__total">應付總額 NT$ {{ placedOrder.total.toLocaleString() }}（待付款）</p>
      <p class="notice">
        這是 Demo 訂單（後端未啟動），已記入後台「訂單管理」。實際串接綠界後，這一步將導向綠界付款頁。
      </p>
      <div class="done__actions">
        <RouterLink class="btn" to="/products">繼續購物</RouterLink>
        <RouterLink class="btn btn--ghost" to="/member">查看我的訂單</RouterLink>
      </div>
    </section>

    <template v-else>
    <section class="block">
      <h2>配送方式</h2>
      <!-- 5.1 智慧物流過濾：被鎖定時只剩專人貨車，超商選項置灰 -->
      <label
        v-for="m in [ShippingMethod.CVS_711, ShippingMethod.HOME_DELIVERY, ShippingMethod.TRUCK_DEDICATED]"
        :key="m"
        class="ship-option"
        :class="{ disabled: !cart.availableShippingMethods.includes(m) }"
      >
        <input
          type="radio"
          :value="m"
          v-model="form.shippingMethod"
          :disabled="!cart.availableShippingMethods.includes(m)"
        />
        {{ shippingLabels[m] }}
      </label>
      <p v-if="cart.logisticsNotice" class="notice">{{ cart.logisticsNotice }}</p>
    </section>

    <section class="block">
      <h2>收件資訊</h2>
      <input v-model="form.recipientName" placeholder="收件人姓名" />
      <input v-model="form.recipientPhone" placeholder="聯絡電話" />
      <input v-model="form.address" placeholder="收件地址" />
    </section>

    <!-- 5.2 送禮專用客製化模組 -->
    <section class="block">
      <label class="gift-toggle">
        <input type="checkbox" v-model="form.isGift" /> 這是一份祝賀禮物
      </label>
      <Transition name="expand">
        <GiftForm v-if="form.isGift" v-model="form.gift" />
      </Transition>
    </section>

    <!-- 5.3 優惠券 -->
    <section class="block">
      <h2>優惠碼</h2>
      <div class="coupon-row">
        <input v-model="form.couponCode" placeholder="請輸入優惠碼" />
        <button class="btn" :disabled="coupon.loading || !form.couponCode" @click="applyCoupon">應用</button>
      </div>
      <p v-if="coupon.error" class="error">{{ coupon.error }}</p>
      <p v-if="coupon.applied" class="ok">已套用，折抵 NT$ {{ discount() }}</p>
    </section>

    <section class="block summary">
      <div>商品小計<span>NT$ {{ cart.subtotal }}</span></div>
      <div>優惠折抵<span>- NT$ {{ discount() }}</span></div>
      <div>運費<span>NT$ {{ effectiveShipping() }}</span></div>
      <div class="total">應付總額<span>NT$ {{ total() }}</span></div>
      <p v-if="!cart.items.length" class="notice">購物車是空的，先去挑些植栽吧 🌱</p>
      <button class="btn" :disabled="!cart.items.length || submitting" @click="submitOrder">
        {{ submitting ? '處理中…' : '前往付款（綠界）' }}
      </button>
    </section>
    </template>
  </div>
</template>

<style scoped>
.checkout {
  padding: 2rem 0;
  max-width: 680px;
}
.block {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.2rem 1.4rem;
  margin-bottom: 1.2rem;
}
.block input[type='text'],
.block input:not([type]) {
  display: block;
  width: 100%;
  padding: 0.6rem;
  margin: 0.4rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.ship-option {
  display: block;
  padding: 0.5rem 0;
}
.ship-option.disabled {
  color: var(--color-muted);
  opacity: 0.5;
}
.coupon-row {
  display: flex;
  gap: 0.6rem;
}
.coupon-row input {
  flex: 1;
}
.error {
  color: #c0392b;
}
.ok {
  color: #27865a;
}
.summary div {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
}
.summary .total {
  font-weight: 700;
  font-size: 1.1rem;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 0.6rem;
}
/* 訂單成立 */
.done {
  text-align: center;
}
.done__icon {
  font-size: 2.4rem;
}
.done h2 {
  margin: 0.3rem 0 0.6rem;
}
.done__total {
  color: var(--color-muted);
}
.done__actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}
/* 5.2 平滑展開動畫 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 600px;
}
</style>
