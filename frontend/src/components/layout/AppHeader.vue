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

      <nav class="header__nav" :class="{ 'is-open': menuOpen }" @click="closeMenu">
        <RouterLink to="/products">商品</RouterLink>
        <RouterLink to="/events">活動</RouterLink>
        <RouterLink to="/qa">植栽養護</RouterLink>
        <RouterLink to="/pet-safe">毛孩安全植物</RouterLink>
        <RouterLink to="/contact">聯絡我們</RouterLink>
        <RouterLink to="/service">客戶服務</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/member">會員中心</RouterLink>
        <RouterLink v-else to="/login">登入 / 註冊</RouterLink>
      </nav>

      <!-- 右側常駐：購物車 + 漢堡（手機不收起購物車） -->
      <div class="header__bar">
        <RouterLink to="/cart" class="header__cart" aria-label="購物車" @click="closeMenu">
          🛒<span v-if="cartCount" class="header__badge">{{ cartCount }}</span>
        </RouterLink>
        <button
          class="header__toggle"
          :class="{ open: menuOpen }"
          :aria-expanded="menuOpen"
          aria-label="選單"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
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
  margin-left: auto; /* 桌機：選單靠右 */
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

/* 右側常駐區：購物車 + 漢堡 */
.header__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1.6rem;
}
.header__cart {
  position: relative;
  font-size: 1.3rem;
  line-height: 1;
  color: #f3f4ee;
}
.header__badge {
  position: absolute;
  top: -8px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--color-accent);
  color: #1f2a1f;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
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
  transition: transform 0.25s, opacity 0.2s;
}
/* 開啟時變 X */
.header__toggle.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.header__toggle.open span:nth-child(2) {
  opacity: 0;
}
.header__toggle.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
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
    max-height: 360px;
  }
  .header__nav > a {
    width: 100%;
    padding: 0.9rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
}
</style>
