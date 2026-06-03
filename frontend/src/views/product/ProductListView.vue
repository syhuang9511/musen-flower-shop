<script setup>
import { computed, onMounted, ref } from 'vue'
import { productApi } from '@/api/modules'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductAdminStore } from '@/stores/productAdmin'
import { useCategoryStore } from '@/stores/category'

const products = ref([])
const cart = useCartStore()
const wishlist = useWishlistStore()
const catalog = useProductAdminStore()
const categoryStore = useCategoryStore()

const activeCategory = ref('全部')
const tabs = computed(() => ['全部', ...categoryStore.categories])

const filtered = computed(() =>
  activeCategory.value === '全部'
    ? products.value
    : products.value.filter((p) => p.category === activeCategory.value),
)

function countOf(cat) {
  return cat === '全部'
    ? products.value.length
    : products.value.filter((p) => p.category === cat).length
}

onMounted(async () => {
  try {
    products.value = await productApi.list()
  } catch (e) {
    console.warn('改用本機目錄商品：', e.message)
    products.value = catalog.activeProducts
  }
})
</script>

<template>
  <div class="shop">
    <div class="shop__bg" aria-hidden="true"></div>

    <div class="container shop__inner">
      <header class="shop__head">
        <p class="shop__kicker">MUSEN ㅤSHOP</p>
        <h1>選購商品</h1>
      </header>

      <!-- 分類頁籤 -->
      <nav class="cats">
        <button
          v-for="cat in tabs"
          :key="cat"
          class="cat-tab"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}<small>{{ countOf(cat) }}</small>
        </button>
      </nav>

      <p v-if="!products.length" class="notice">尚無商品資料 — 請先於後台上架商品。</p>
      <p v-else-if="!filtered.length" class="notice">此分類目前沒有商品。</p>

      <div class="grid">
        <article v-for="p in filtered" :key="p.id" class="card">
          <div class="card__media">
            <RouterLink :to="`/products/${p.id}`">
              <img :src="p.image" :alt="p.name" />
            </RouterLink>
            <button
              class="wish"
              :class="{ active: wishlist.has(p.id) }"
              :aria-label="wishlist.has(p.id) ? '取消收藏' : '加入收藏'"
              @click="wishlist.toggle(p.id)"
            >
              {{ wishlist.has(p.id) ? '♥' : '♡' }}
            </button>
          </div>
          <small v-if="p.category" class="card__cat">{{ p.category }}</small>
          <RouterLink :to="`/products/${p.id}`" class="card__name">{{ p.name }}</RouterLink>
          <p class="card__price">NT$ {{ p.price }}</p>
          <button class="card__cart" @click="cart.addItem(p)">加入購物車</button>
        </article>
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
    radial-gradient(circle at 15% 12%, rgba(156, 175, 148, 0.25), transparent 45%),
    linear-gradient(160deg, rgba(247, 246, 241, 0.84), rgba(236, 241, 233, 0.9)),
    url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=60')
      center / cover fixed;
}
.shop__inner {
  position: relative;
  z-index: 1;
  padding: 2.4rem 1rem 3.5rem;
  color: var(--color-text);
}
.shop__head {
  margin-bottom: 1.4rem;
}
.shop__kicker {
  margin: 0 0 0.3rem;
  letter-spacing: 0.3em;
  font-size: 0.76rem;
  color: var(--color-muted);
}
.shop__head h1 {
  margin: 0;
  letter-spacing: 0.1em;
}

/* 玻璃分類頁籤 */
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.8rem;
}
.cat-tab {
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  color: var(--color-text);
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  transition: all 0.18s;
}
.cat-tab small {
  margin-left: 0.35rem;
  color: var(--color-muted);
}
.cat-tab:hover {
  border-color: var(--color-primary);
}
.cat-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.cat-tab.active small {
  color: rgba(255, 255, 255, 0.8);
}

/* 玻璃商品卡 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 14px;
  padding: 0.9rem;
  box-shadow: 0 12px 30px rgba(43, 53, 44, 0.12);
}
.card__media {
  position: relative;
}
.card__media img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 10px;
}
.wish {
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  color: var(--color-muted);
  font-size: 1.15rem;
  line-height: 1;
  transition: transform 0.15s, color 0.2s;
}
.wish:hover {
  transform: scale(1.12);
}
.wish.active {
  color: #c2566a;
}
.card__cat {
  margin: 0.8rem 0 0.1rem;
  color: #6f8463;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}
.card__name {
  margin: 0.15rem 0 0.3rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}
.card__name:hover {
  color: var(--color-primary);
}
.card__price {
  margin: 0 0 0.85rem;
  color: var(--color-primary);
  font-weight: 700;
}
.card__cart {
  width: 100%;
  margin-top: auto;
  padding: 0.65rem;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: opacity 0.2s;
}
.card__cart:hover {
  opacity: 0.9;
}
</style>
