<script setup>
import { onMounted, ref, computed } from 'vue'
import { wishlistApi } from '@/api/modules'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

// 6.2 撈取會員已收藏、但尚未在購物車中的商品
const cart = useCartStore()
const auth = useAuthStore()
const wishlistProducts = ref([])

const recommendations = computed(() => {
  const inCart = new Set(cart.items.map((i) => i.productId))
  return wishlistProducts.value.filter((p) => !inCart.has(p.id))
})

onMounted(async () => {
  if (!auth.isLoggedIn) return
  try {
    wishlistProducts.value = await wishlistApi.list()
  } catch (e) {
    console.warn('載入收藏推薦失敗', e.message)
  }
})

function quickAdd(product) {
  // 即時重算總價與物流限制，且不影響已填寫的結帳資訊
  cart.addItem(product, 1)
}
</script>

<template>
  <section v-if="recommendations.length" class="cross-sell">
    <h2>您的專屬收藏清單</h2>
    <p class="hint">這些是您先前收藏、還沒加入購物車的商品 ✨</p>
    <div class="cards">
      <article v-for="p in recommendations" :key="p.id" class="mini-card">
        <img :src="p.image" :alt="p.name" />
        <div class="mini-card__body">
          <span>{{ p.name }}</span>
          <strong>NT$ {{ p.price }}</strong>
          <button class="btn" @click="quickAdd(p)">快速加入</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.cross-sell {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.hint {
  color: var(--color-muted);
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
.mini-card {
  border: 1px solid #eee;
  border-radius: var(--radius);
  overflow: hidden;
}
.mini-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}
.mini-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.6rem;
}
</style>
