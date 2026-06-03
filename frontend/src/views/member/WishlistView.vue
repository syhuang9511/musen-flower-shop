<script setup>
import { onMounted, ref } from 'vue'
import { wishlistApi } from '@/api/modules'
import { useCartStore } from '@/stores/cart'

const items = ref([])
const cart = useCartStore()

onMounted(async () => {
  try {
    items.value = await wishlistApi.list()
  } catch (e) {
    console.warn(e.message)
  }
})
</script>

<template>
  <div>
    <h1>我的收藏</h1>
    <p v-if="!items.length" class="notice">尚無收藏商品。</p>
    <div v-else class="grid">
      <article v-for="p in items" :key="p.id" class="card">
        <img :src="p.image" :alt="p.name" />
        <h3>{{ p.name }}</h3>
        <button class="btn" @click="cart.addItem(p)">加入購物車</button>
      </article>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
.card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}
</style>
