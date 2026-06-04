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
  <div class="admin">
    <!-- 後台頂部導覽列 -->
    <header class="admin-header">
      <div class="container admin-header__inner">
        <div class="admin-header__brand">
          <span class="avatar">{{ (admin.current?.name || 'A').charAt(0) }}</span>
          <div class="brand-text">
            <strong>後台管理</strong>
            <small>{{ admin.current?.name }}（{{ admin.current?.username }}）</small>
          </div>
        </div>

        <button
          class="admin-toggle"
          :class="{ open: menuOpen }"
          :aria-expanded="menuOpen"
          aria-label="後台選單"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span><span></span>
        </button>

        <nav class="admin-nav" :class="{ 'is-open': menuOpen }" @click="menuOpen = false">
          <RouterLink to="/admin">營運儀表板</RouterLink>
          <RouterLink to="/admin/orders">訂單管理</RouterLink>
          <RouterLink to="/admin/products">商品管理</RouterLink>
          <RouterLink to="/admin/cms">Q&A 管理</RouterLink>
          <RouterLink to="/admin/comments">留言管理</RouterLink>
          <RouterLink to="/admin/coupons">優惠券管理</RouterLink>
          <RouterLink to="/admin/members">會員管理</RouterLink>
          <RouterLink to="/admin/analytics">購物車分析</RouterLink>
          <button class="logout" @click="logout">登出</button>
        </nav>
      </div>
    </header>

    <main class="container admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 頂部導覽列 */
.admin-header {
  background: var(--color-primary-dark);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  position: sticky;
  top: 0;
  z-index: 50;
}
.admin-header__inner {
  display: flex;
  align-items: center;
  min-height: 60px;
  gap: 1rem;
}
.admin-header__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #f3f4ee;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #1f2a1f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-transform: uppercase;
  flex: 0 0 auto;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.brand-text small {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
}

.admin-nav {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: auto;
  flex-wrap: wrap;
}
.admin-nav a {
  color: #d6dcd2;
  font-size: 0.9rem;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.admin-nav a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
.admin-nav a.router-link-exact-active {
  background: var(--color-accent);
  color: #1f2a1f;
  font-weight: 600;
}
.logout {
  margin-left: 0.4rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: transparent;
  color: #d6dcd2;
  font-size: 0.9rem;
}
.logout:hover {
  color: #fff;
  border-color: #e0b4ad;
}

/* 漢堡：桌機隱藏 */
.admin-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 6px;
  margin-left: auto;
}
.admin-toggle span {
  width: 24px;
  height: 2px;
  background: #f3f4ee;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.2s;
}
.admin-toggle.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.admin-toggle.open span:nth-child(2) {
  opacity: 0;
}
.admin-toggle.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* 內容區 */
.admin-main {
  padding: 1.6rem 1rem 3rem;
}

/* ---- 手機版 ---- */
@media (max-width: 768px) {
  .admin-header__inner {
    flex-wrap: wrap;
  }
  .admin-toggle {
    display: flex;
  }
  .admin-nav {
    flex-basis: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    margin: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.28s ease;
  }
  .admin-nav.is-open {
    max-height: 640px;
    padding-bottom: 0.6rem;
  }
  .admin-nav a {
    padding: 0.8rem 0.4rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .logout {
    margin: 0.6rem 0 0;
    width: 100%;
  }
  .admin-main {
    padding: 1rem 0.9rem 2.5rem;
  }
}
</style>
