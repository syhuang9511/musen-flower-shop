<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'

const admin = useAdminAuthStore()
const router = useRouter()
const menuOpen = ref(false)

function logout() {
  admin.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="container admin">
    <!-- 手機頂列：後台標題 + 漢堡（展開為後台選單） -->
    <div class="admin__topbar">
      <strong>後台管理</strong>
      <button
        class="admin__toggle"
        :class="{ open: menuOpen }"
        :aria-expanded="menuOpen"
        aria-label="後台選單"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>
    </div>

    <aside :class="{ 'is-open': menuOpen }" @click="menuOpen = false">
      <div class="admin__user">
        <span class="admin__avatar">{{ (admin.current?.name || 'A').charAt(0) }}</span>
        <div>
          <strong>{{ admin.current?.name }}</strong>
          <small>{{ admin.current?.username }}</small>
        </div>
      </div>
      <h2 class="admin__title">後台管理</h2>
      <nav>
        <RouterLink to="/admin">營運儀表板</RouterLink>
        <RouterLink to="/admin/orders">訂單管理</RouterLink>
        <RouterLink to="/admin/products">商品管理</RouterLink>
        <RouterLink to="/admin/cms">Q&A 管理</RouterLink>
        <RouterLink to="/admin/comments">留言管理</RouterLink>
        <RouterLink to="/admin/coupons">優惠券管理</RouterLink>
        <RouterLink to="/admin/members">會員管理</RouterLink>
        <RouterLink to="/admin/analytics">購物車分析</RouterLink>
      </nav>
      <button class="logout" @click="logout">登出</button>
    </aside>

    <section><RouterView /></section>
  </div>
</template>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr); /* minmax(0,..) 防止內容撐爆軌道 */
  gap: 2rem;
  padding: 1.5rem 1rem 3rem;
}

/* 手機頂列：桌機隱藏 */
.admin__topbar {
  display: none;
}
.admin__toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 6px;
}
.admin__toggle span {
  width: 24px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.2s;
}
.admin__toggle.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.admin__toggle.open span:nth-child(2) {
  opacity: 0;
}
.admin__toggle.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.admin__user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.7rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  margin-bottom: 1rem;
}
.admin__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-transform: uppercase;
}
.admin__user small {
  display: block;
  color: var(--color-muted);
}
.admin__title {
  font-size: 1.1rem;
  margin: 0 0 0.6rem;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
nav a {
  padding: 0.4rem 0.2rem;
  border-radius: 6px;
}
nav a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 600;
}
.logout {
  margin-top: 1.2rem;
  width: 100%;
  padding: 0.55rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius);
  background: transparent;
  color: var(--color-muted);
}
.logout:hover {
  color: #c0392b;
  border-color: #e0b4ad;
}

@media (max-width: 768px) {
  .admin {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0.9rem;
  }
  .admin__topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 0 0.6rem;
  }
  /* aside 變為可收合的下拉選單 */
  aside {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.28s ease;
    margin-bottom: 0;
  }
  aside.is-open {
    max-height: 640px;
    margin-bottom: 1rem;
  }
  .admin__title {
    display: none;
  }
  nav a {
    padding: 0.6rem 0.4rem;
    border-bottom: 1px solid var(--color-line);
  }
}
</style>
