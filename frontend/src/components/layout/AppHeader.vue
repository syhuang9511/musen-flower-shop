<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { computed, ref } from 'vue'

const auth = useAuthStore()
const cart = useCartStore()
const cartCount = computed(() => cart.items.reduce((n, i) => n + i.qty, 0))

const menuOpen = ref(false)
function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo" @click="closeMenu">沐森植研所</RouterLink>

      <!-- 手機漢堡按鈕 -->
      <button class="header__toggle" :aria-expanded="menuOpen" aria-label="選單" @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>

      <nav class="header__nav" :class="{ 'is-open': menuOpen }" @click="closeMenu">
        <RouterLink to="/products">商品</RouterLink>
        <RouterLink to="/qa">植栽養護</RouterLink>
        <RouterLink to="/contact">聯絡我們</RouterLink>
        <RouterLink to="/service">客戶服務</RouterLink>
        <div class="header__actions">
          <RouterLink to="/cart">🛒 <span v-if="cartCount">{{ cartCount }}</span></RouterLink>
          <RouterLink v-if="auth.isLoggedIn" to="/member">會員中心</RouterLink>
          <RouterLink v-else to="/login">登入 / 註冊</RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--color-primary-dark);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66px;
}
.header__logo {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #f3f4ee;
}
.header__nav {
  display: flex;
  gap: 1.6rem;
  align-items: center;
}
.header__nav a {
  color: #d6dcd2;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  transition: color 0.2s;
}
.header__nav a:hover {
  color: var(--color-accent);
}
.header__actions {
  display: flex;
  gap: 1.4rem;
  align-items: center;
}

/* 漢堡按鈕：桌機隱藏 */
.header__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 6px;
}
.header__toggle span {
  width: 24px;
  height: 2px;
  background: #f3f4ee;
  border-radius: 2px;
}

/* ---- 手機版 ---- */
@media (max-width: 768px) {
  .header__toggle {
    display: flex;
  }
  .header__nav {
    position: absolute;
    top: 66px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background: var(--color-primary-dark);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
  }
  .header__nav.is-open {
    max-height: 320px;
  }
  .header__nav > a,
  .header__actions {
    width: 100%;
    padding: 0.9rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .header__actions {
    justify-content: flex-start;
  }
}
</style>
