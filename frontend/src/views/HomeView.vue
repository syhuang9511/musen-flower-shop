<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { productApi } from '@/api/modules'
import { useProductAdminStore } from '@/stores/productAdmin'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const catalog = useProductAdminStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

const allProducts = ref([])
const loading = ref(true)

// 熱銷主打：主打商品優先，再以其他上架商品補滿，最多 8 樣
const featured = computed(() => {
  const feat = allProducts.value.filter((p) => p.featured)
  const rest = allProducts.value.filter((p) => !p.featured)
  return [...feat, ...rest].slice(0, 8)
})

onMounted(async () => {
  try {
    allProducts.value = await productApi.list()
  } catch (e) {
    console.warn('改用本機目錄商品：', e.message)
    allProducts.value = catalog.activeProducts
  } finally {
    loading.value = false
  }
})

// ---- 輪播 ----
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=70',
    title: '讓每一束花，訴說一段心意',
    subtitle: '當季鮮花花束・專人配送送禮首選',
  },
  {
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=70',
    title: '把森林帶回家',
    subtitle: '精選觀葉植栽，為空間注入呼吸感',
  },
  {
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=1600&q=70',
    title: '療癒，從一盆綠意開始',
    subtitle: '多肉・小品盆栽・盆器資材一次備齊',
  },
]
const current = ref(0)
let timer = null

function go(i) {
  current.value = (i + slides.length) % slides.length
}
function next() {
  go(current.value + 1)
}
function prev() {
  go(current.value - 1)
}
onMounted(() => {
  timer = setInterval(next, 5000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div>
    <!-- 輪播圖 -->
    <section class="carousel">
      <div
        v-for="(s, i) in slides"
        :key="i"
        class="slide"
        :class="{ active: current === i }"
        :style="{ backgroundImage: `linear-gradient(rgba(43,53,44,.35), rgba(43,53,44,.5)), url(${s.image})` }"
      >
        <div class="slide__caption">
          <h2>{{ s.title }}</h2>
          <p>{{ s.subtitle }}</p>
          <RouterLink to="/products" class="btn">立即選購</RouterLink>
        </div>
      </div>

      <button class="nav prev" aria-label="上一張" @click="prev">‹</button>
      <button class="nav next" aria-label="下一張" @click="next">›</button>
      <div class="dots">
        <button
          v-for="(s, i) in slides"
          :key="i"
          class="dot"
          :class="{ active: current === i }"
          :aria-label="`第 ${i + 1} 張`"
          @click="go(i)"
        ></button>
      </div>
    </section>

    <!-- 熱銷主打 -->
    <section class="featured">
      <div class="featured__bg" aria-hidden="true"></div>
      <div class="container featured__inner">
      <h2 class="section-title">熱銷主打</h2>
      <p v-if="loading">載入中…</p>
      <p v-else-if="!featured.length" class="notice">尚無資料 — 請先於後台上架商品。</p>
      <div v-else class="grid">
        <article v-for="p in featured" :key="p.id" class="card">
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
          <button class="btn card__cart" @click="cart.addItem(p)">加入購物車</button>
        </article>
      </div>
      <div class="more">
        <RouterLink to="/products" class="btn--ghost btn">查看全部商品 →</RouterLink>
      </div>
      </div>
    </section>

    <!-- 品牌宗旨 -->
    <section class="ethos">
      <div class="container ethos__inner">
        <p class="ethos__kicker">沐森植研所 ㅤMUSEN</p>
        <p class="ethos__text">
          我們相信，照顧一株植物，也是在照顧自己。<br />
          在城市的縫隙裡留一方綠意，讓葉子記得光的方向，<br />
          讓花朵替你說出口難言的心意。
        </p>
        <p class="ethos__sign">願每一次澆水與凝視，都成為你與生活溫柔和解的時刻。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 輪播 */
.carousel {
  position: relative;
  height: 460px;
  overflow: hidden;
}
.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
}
.slide.active {
  opacity: 1;
  pointer-events: auto;
}
.slide__caption h2 {
  font-size: 2.3rem;
  margin: 0 0 0.6rem;
  letter-spacing: 0.06em;
}
.slide__caption p {
  margin: 0 0 1.4rem;
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}
.nav:hover {
  background: rgba(255, 255, 255, 0.4);
}
.nav.prev {
  left: 1.2rem;
}
.nav.next {
  right: 1.2rem;
}
.dots {
  position: absolute;
  bottom: 1.1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.dot.active {
  background: #fff;
  transform: scale(1.25);
}

/* 熱銷主打 */
.featured {
  position: relative;
  padding: 3rem 0 3.5rem;
  overflow: hidden;
}
.featured__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 85% 10%, rgba(156, 175, 148, 0.22), transparent 45%),
    linear-gradient(160deg, rgba(247, 246, 241, 0.86), rgba(236, 241, 233, 0.92)),
    url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=60')
      center / cover fixed;
}
.featured__inner {
  position: relative;
  z-index: 1;
}
.section-title {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  margin-bottom: 1.8rem;
}
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
  box-shadow: 0 12px 30px rgba(43, 53, 44, 0.12);
  padding: 0.9rem;
}
.card__media {
  position: relative;
}
.card__media img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
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
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
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
  color: var(--color-text);
  font-weight: 600;
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
}
.more {
  text-align: center;
  margin-top: 2rem;
}

/* 品牌宗旨 */
.ethos {
  background: var(--color-bg);
  padding: 4.5rem 0;
}
.ethos__inner {
  max-width: 720px;
  text-align: center;
}
.ethos__kicker {
  margin: 0 0 1.4rem;
  letter-spacing: 0.32em;
  font-size: 0.8rem;
  color: var(--color-accent);
}
.ethos__text {
  margin: 0;
  font-size: 1.35rem;
  line-height: 2.4;
  letter-spacing: 0.06em;
  color: var(--color-text);
  font-weight: 300;
}
.ethos__sign {
  margin: 1.8rem 0 0;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
}

@media (max-width: 768px) {
  .ethos {
    padding: 3rem 0;
  }
  .ethos__text {
    font-size: 1.1rem;
    line-height: 2.1;
  }
}

@media (max-width: 768px) {
  .carousel {
    height: 340px;
  }
  .slide__caption h2 {
    font-size: 1.6rem;
  }
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>
