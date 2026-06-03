<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container member" style="padding: 2rem 0">
    <aside>
      <h2>會員中心</h2>
      <nav>
        <RouterLink to="/member">我的訂單</RouterLink>
        <RouterLink to="/member/addresses">常用地址</RouterLink>
        <RouterLink to="/member/rewards">積分・折價券</RouterLink>
        <RouterLink to="/member/wishlist">我的收藏</RouterLink>
      </nav>
    </aside>
    <section><RouterView /></section>
  </div>
</template>

<style scoped>
.member {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .member {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>
