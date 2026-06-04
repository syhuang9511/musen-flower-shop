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
  [ShippingMethod.TRUCK_DEDICATED]: 500, // 專人貨車：雙北專人配送
}

// 專人配送服務範圍：僅限台北市 / 新北市
const TRUCK_AREAS = {
  台北市: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  新北市: ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '汐止區', '樹林區', '三峽區', '淡水區', '林口區', '五股區', '泰山區', '鶯歌區', '深坑區', '八里區', '三芝區'],
}
const truckCities = Object.keys(TRUCK_AREAS)

const form = reactive({
  shippingMethod: cart.availableShippingMethods[0],
  recipientName: auth.user?.name || '',
  recipientPhone: '',
  address: '',
  isGift: false,
  gift: null,
  couponCode: '',
})

// 專人配送專用地址（限雙北）
const truckAddr = reactive({ city: '台北市', district: '', detail: '' })
const isTruck = computed(() => form.shippingMethod === ShippingMethod.TRUCK_DEDICATED)
const truckDistricts = computed(() => TRUCK_AREAS[truckAddr.city] || [])

// 5.3 優惠券
const coupon = reactive({ applied: null, error: '', loading: false })
const shippingFee = computed(() => SHIPPING_FEES[form.shippingMethod] || 0)
const placedOrder = ref(null)
const placedTruck = ref(false)
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

// 依配送方式組出最終地址
function resolveAddress() {
  if (isTruck.value) return `${truckAddr.city}${truckAddr.district}${truckAddr.detail}`
  return form.address
}

async function submitOrder() {
  if (!form.recipientName || !form.recipientPhone) {
    toast.show('請填寫收件人姓名與電話')
    return
  }
  if (isTruck.value) {
    if (!truckAddr.district || !truckAddr.detail) {
      toast.show('專人配送請選擇行政區並填寫詳細地址（限台北市／新北市）')
      return
    }
  } else if (form.shippingMethod === ShippingMethod.HOME_DELIVERY && !form.address) {
    toast.show('宅配請填寫收件地址')
    return
  }
  submitting.value = true
  const address = resolveAddress()
  const payload = {
    items: cart.items,
    shippingMethod: form.shippingMethod,
    recipient: { name: form.recipientName, phone: form.recipientPhone, address },
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
      recipient: { name: form.recipientName, phone: form.recipientPhone, address },
      gift: form.isGift ? form.gift : null,
      subtotal: cart.subtotal,
      discount: discount(),
      shippingFee: effectiveShipping(),
      total: total(),
      couponCode: coupon.applied?.code || null,
    })
    placedTruck.value = isTruck.value
    placedOrder.value = order
    cart.clear()
  } finally {
    submitting.value = false
  }
}

// 專人配送聯繫資訊（請替換為實際門市資訊）
const CONTACT = {
  lineUrl: 'https://line.me/R/ti/p/@musen',
  lineId: '@musen',
  phone: '02-2700-0000',
}
</script>

<template>
  <div class="container checkout">
    <h1>結帳</h1>

    <!-- 專人配送：確認頁（待安排司機，請客人主動聯繫） -->
    <section v-if="placedOrder && placedTruck" class="block confirm">
      <div class="confirm__icon">🚚</div>
      <h2>專人配送預約已送出</h2>
      <p>訂單編號 <strong>{{ placedOrder.orderNo }}</strong>・狀態：<strong class="pending">待確認配送</strong></p>
      <p class="confirm__lead">
        您的商品含大型／脆弱植栽，將由<strong>專人貨車配送（限台北市／新北市）</strong>，
        需與您確認<strong>送達時段與司機檔期</strong>後才會出車。
      </p>

      <div class="confirm__cta">
        <p class="confirm__cta-title">📞 請主動與我們聯繫，加快為您安排司機</p>
        <div class="confirm__btns">
          <a class="btn line" :href="CONTACT.lineUrl" target="_blank" rel="noopener">加 LINE 確認（{{ CONTACT.lineId }}）</a>
          <a class="btn btn--ghost" :href="`tel:${CONTACT.phone}`">撥打 {{ CONTACT.phone }}</a>
        </div>
        <p class="confirm__quote">聯繫時請報訂單編號 <strong>{{ placedOrder.orderNo }}</strong></p>
      </div>

      <p class="notice">
        我們將於 <strong>24 小時內</strong>回覆確認；若該時段無司機可安排，將主動通知並協助改期或<strong>全額退款取消</strong>。
      </p>
      <div class="done__actions">
        <RouterLink class="btn btn--ghost" to="/member">前往我的訂單</RouterLink>
      </div>
    </section>

    <!-- 一般訂單成立 -->
    <section v-else-if="placedOrder" class="block done">
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

      <!-- 專人配送：限雙北，選縣市 + 行政區 + 詳細地址 -->
      <template v-if="isTruck">
        <p class="area-note">🚚 專人配送僅服務 <strong>台北市 / 新北市</strong>，運費 NT$500。</p>
        <div class="addr-row">
          <select v-model="truckAddr.city" @change="truckAddr.district = ''">
            <option v-for="c in truckCities" :key="c" :value="c">{{ c }}</option>
          </select>
          <select v-model="truckAddr.district">
            <option value="" disabled>選擇行政區</option>
            <option v-for="d in truckDistricts" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <input v-model="truckAddr.detail" placeholder="詳細地址（路 / 街 / 巷弄號樓）" />
      </template>

      <!-- 宅配 -->
      <input
        v-else-if="form.shippingMethod === ShippingMethod.HOME_DELIVERY"
        v-model="form.address"
        placeholder="收件地址"
      />

      <!-- 超商取貨 -->
      <p v-else class="area-note">🏪 超商取貨：實際串接綠界後，於此選擇取貨門市。</p>
    </section>

    <!-- 5.2 送禮專用客製化模組 -->
    <section class="block">
      <button
        type="button"
        class="gift-switch"
        :class="{ on: form.isGift }"
        @click="form.isGift = !form.isGift"
      >
        <span class="gift-switch__icon">🎁</span>
        <span class="gift-switch__text">
          <strong>這是一份祝賀禮物</strong>
          <small>填寫賀詞、收禮人與希望送達時間</small>
        </span>
        <span class="gift-switch__knob" aria-hidden="true"></span>
      </button>
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

/* 雙北地址 */
.area-note {
  background: #f1f4ef;
  border-radius: 8px;
  padding: 0.55rem 0.8rem;
  font-size: 0.88rem;
  color: #4a514a;
  margin: 0.6rem 0 0.4rem;
}
.addr-row {
  display: flex;
  gap: 0.6rem;
  margin: 0.4rem 0;
}
.addr-row select {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font: inherit;
  background: #fff;
}

/* 禮物開關 */
.gift-switch {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  transition: border-color 0.2s, background 0.2s;
}
.gift-switch.on {
  border-color: var(--color-primary);
  background: #f3f7f1;
}
.gift-switch__icon {
  font-size: 1.5rem;
  filter: grayscale(0.4);
  transition: filter 0.2s, transform 0.2s;
}
.gift-switch.on .gift-switch__icon {
  filter: none;
  transform: scale(1.1);
}
.gift-switch__text {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.gift-switch__text small {
  color: var(--color-muted);
  font-size: 0.8rem;
}
.gift-switch__knob {
  flex: 0 0 auto;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: #d6d6d6;
  position: relative;
  transition: background 0.2s;
}
.gift-switch__knob::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.gift-switch.on .gift-switch__knob {
  background: var(--color-primary);
}
.gift-switch.on .gift-switch__knob::after {
  transform: translateX(20px);
}

/* 專人配送確認頁 */
.confirm {
  text-align: center;
}
.confirm__icon {
  font-size: 2.6rem;
}
.confirm h2 {
  margin: 0.3rem 0 0.6rem;
}
.pending {
  color: #97640d;
}
.confirm__lead {
  color: #4a514a;
  line-height: 1.8;
  max-width: 460px;
  margin: 0.6rem auto;
}
.confirm__cta {
  background: #f3f7f1;
  border: 1px solid #d9e4d4;
  border-radius: 12px;
  padding: 1.1rem;
  margin: 1.2rem 0;
}
.confirm__cta-title {
  font-weight: 700;
  margin: 0 0 0.7rem;
}
.confirm__btns {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}
.confirm__quote {
  margin: 0.8rem 0 0;
  font-size: 0.9rem;
  color: var(--color-muted);
}
.btn.line {
  background: #06c755;
}
.confirm__policy {
  font-size: 0.9rem;
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
