<script setup>
import { computed, onMounted, ref } from 'vue'
import { productApi } from '@/api/modules'
import { useCartStore, shippingInfoFor } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { STATIC_PRODUCTS } from '@/data/staticProducts'

const props = defineProps({ id: { type: String, required: true } })
const product = ref(null)
const qty = ref(1)
const cart = useCartStore()
const wishlist = useWishlistStore()

function changeQty(delta) {
  qty.value = Math.max(1, qty.value + delta)
}

const shipping = computed(() => (product.value ? shippingInfoFor(product.value.logisticsClass) : null))

onMounted(async () => {
  try {
    const res = await productApi.detail(props.id)
    product.value = res?.data ?? res ?? null
  } catch {
    product.value = STATIC_PRODUCTS.find((p) => p.id === Number(props.id)) ?? null
  }
})
</script>

<template>
  <div class="shop">
    <div class="shop__bg" aria-hidden="true"></div>

    <div class="container shop__inner">
      <RouterLink to="/products" class="back">‹ 返回商品列表</RouterLink>

      <p v-if="!product" class="notice">找不到此商品。</p>

      <div v-else class="panel">
        <div class="panel__media">
          <img :src="product.image" :alt="product.name" />
          <button
            class="wish"
            :class="{ active: wishlist.has(product.id) }"
            :aria-label="wishlist.has(product.id) ? '取消收藏' : '加入收藏'"
            @click="wishlist.toggle(product.id)"
          >
            {{ wishlist.has(product.id) ? '♥' : '♡' }}
          </button>
        </div>

        <div class="panel__info">
          <small v-if="product.category" class="cat">{{ product.category }}</small>
          <h1>{{ product.name }}</h1>
          <p class="price">NT$ {{ product.price }}</p>

          <section class="block">
            <h2 class="block__title">商品說明</h2>
            <p class="desc">{{ product.description || '此商品尚無詳細說明。' }}</p>
          </section>

          <section v-if="shipping" class="block">
            <h2 class="block__title">配送方式</h2>
            <ul class="ship-list">
              <li v-for="m in shipping.methods" :key="m">✓ {{ m }}</li>
            </ul>
            <p class="ship-note" :class="{ 'ship-note--truck': shipping.truckOnly }">
              <span v-if="shipping.truckOnly">🚚 </span>{{ shipping.note }}
            </p>
          </section>

          <div class="buy">
            <div class="qty">
              <button class="qty__btn" :disabled="qty <= 1" @click="changeQty(-1)">−</button>
              <input class="qty__val" type="number" min="1" v-model.number="qty" />
              <button class="qty__btn" @click="changeQty(1)">+</button>
            </div>
            <button class="add" @click="cart.addItem(product, qty)">加入購物車</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop {
  position: relative;
  min-height: calc(100vh - 66px);
  overflow: hidden;
}
.shop__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 18%, rgba(156, 175, 148, 0.22), transparent 45%),
    linear-gradient(160deg, rgba(247, 246, 241, 0.84), rgba(236, 241, 233, 0.9)),
    url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=60')
      center / cover fixed;
}
.shop__inner {
  position: relative;
  z-index: 1;
  padding: 2rem 1rem 3.5rem;
  color: var(--color-text);
}
.back {
  display: inline-block;
  margin-bottom: 1.2rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}
.back:hover {
  color: var(--color-accent);
}

/* 玻璃面板 */
.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.4rem;
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: 0 24px 60px rgba(43, 53, 44, 0.16);
}
.panel__media {
  position: relative;
}
.panel__media img {
  width: 100%;
  border-radius: 12px;
}
.wish {
  position: absolute;
  right: 0.8rem;
  bottom: 0.8rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  color: var(--color-muted);
  font-size: 1.3rem;
  line-height: 1;
  transition: transform 0.15s, color 0.2s;
}
.wish:hover {
  transform: scale(1.1);
}
.wish.active {
  color: #c2566a;
}

.cat {
  color: #6f8463;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}
.panel__info h1 {
  margin: 0.3rem 0 0.4rem;
  letter-spacing: 0.04em;
}
.price {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
  margin: 0 0 1.4rem;
}
.block {
  border-top: 1px solid var(--color-line);
  padding-top: 1.1rem;
  margin-bottom: 1.1rem;
}
.block__title {
  font-size: 1rem;
  letter-spacing: 0.06em;
  margin: 0 0 0.6rem;
  color: var(--color-primary);
}
.desc {
  margin: 0;
  color: #4a514a;
  line-height: 1.85;
}
.ship-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.2rem;
}
.ship-list li {
  color: var(--color-primary);
  font-weight: 600;
}
.ship-note {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.7;
}
.ship-note--truck {
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius);
  background: #fbe7e3;
  border: 1px solid #f0c4b4;
  color: #b15a3c;
}
.buy {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.6rem;
}
.qty {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
}
.qty__btn {
  width: 42px;
  height: 48px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  color: var(--color-primary);
}
.qty__btn:disabled {
  color: var(--color-muted);
  cursor: not-allowed;
}
.qty__val {
  width: 48px;
  height: 48px;
  border: none;
  border-left: 1px solid var(--color-line);
  border-right: 1px solid var(--color-line);
  text-align: center;
  font: inherit;
  background: transparent;
  -moz-appearance: textfield;
}
.qty__val::-webkit-outer-spin-button,
.qty__val::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.add {
  flex: 1;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.06em;
  transition: opacity 0.2s;
}
.add:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .panel {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
