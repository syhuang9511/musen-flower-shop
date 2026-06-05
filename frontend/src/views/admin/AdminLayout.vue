<script setup>
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'

const admin = useAdminAuthStore()
const router = useRouter()

const collapsed = ref(localStorage.getItem('admin_nav_collapsed') === '1')
const mobileOpen = ref(false)
watch(collapsed, (v) => localStorage.setItem('admin_nav_collapsed', v ? '1' : '0'))

const nav = [
  { to: '/admin', label: '營運儀表板', icon: '📊' },
  { to: '/admin/orders', label: '訂單管理', icon: '🧾' },
  { to: '/admin/products', label: '商品管理', icon: '🪴' },
  { to: '/admin/banners', label: '輪播管理', icon: '🖼️' },
  { to: '/admin/cms', label: 'Q&A 管理', icon: '💡' },
  { to: '/admin/comments', label: '留言管理', icon: '💬' },
  { to: '/admin/coupons', label: '優惠券管理', icon: '🎟️' },
  { to: '/admin/members', label: '會員管理', icon: '👤' },
  { to: '/admin/analytics', label: '購物車分析', icon: '📈' },
]

function logout() {
  admin.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin" :class="{ collapsed }">
    <!-- 手機頂列 -->
    <div class="admin__mobilebar">
      <button class="hb" aria-label="選單" @click="mobileOpen = !mobileOpen">☰</button>
      <strong>後台管理</strong>
    </div>
    <div v-if="mobileOpen" class="admin__overlay" @click="mobileOpen = false"></div>

    <!-- 左側導覽 -->
    <aside class="side" :class="{ open: mobileOpen }">
      <div class="side__head">
        <span class="avatar">{{ (admin.current?.name || 'A').charAt(0) }}</span>
        <div class="who">
          <strong>{{ admin.current?.name }}</strong>
          <small>{{ admin.current?.username }}</small>
        </div>
        <button class="collapse" :aria-label="collapsed ? '展開' : '收合'" @click="collapsed = !collapsed">
          {{ collapsed ? '»' : '«' }}
        </button>
      </div>

      <nav @click="mobileOpen = false">
        <RouterLink v-for="n in nav" :key="n.to" :to="n.to" :title="n.label">
          <span class="ic">{{ n.icon }}</span><span class="lb">{{ n.label }}</span>
        </RouterLink>
      </nav>

      <button class="logout" @click="logout">
        <span class="ic">🚪</span><span class="lb">登出</span>
      </button>
    </aside>

    <main class="main"><RouterView /></main>
  </div>
</template>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  align-items: start;
}
.admin.collapsed {
  grid-template-columns: 68px minmax(0, 1fr);
}

/* 側欄 */
.side {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--color-primary-dark);
  color: #f3f4ee;
  display: flex;
  flex-direction: column;
  padding: 0.9rem 0.7rem;
}
.side__head {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.3rem 0.3rem 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.7rem;
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
.who {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;
}
.who small {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.76rem;
}
.collapse {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  flex: 0 0 auto;
}
.collapse:hover {
  background: rgba(255, 255, 255, 0.2);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
nav a {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #d6dcd2;
  padding: 0.6rem 0.6rem;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
nav a:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
nav a.router-link-exact-active {
  background: var(--color-accent);
  color: #1f2a1f;
  font-weight: 600;
}
.ic {
  width: 22px;
  text-align: center;
  flex: 0 0 auto;
  font-size: 1.05rem;
}
.logout {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.6rem;
  padding: 0.6rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: transparent;
  color: #d6dcd2;
  white-space: nowrap;
}
.logout:hover {
  color: #fff;
  border-color: #e0b4ad;
}

/* 收合（桌機）：隱藏文字、置中圖示 */
.admin.collapsed .who,
.admin.collapsed .lb {
  display: none;
}
.admin.collapsed .side__head {
  justify-content: center;
}
.admin.collapsed .collapse {
  margin-left: 0;
}
.admin.collapsed nav a,
.admin.collapsed .logout {
  justify-content: center;
  gap: 0;
}

/* 內容 */
.main {
  padding: 1.6rem 1.4rem 3rem;
  min-width: 0;
}

/* 手機頂列 / 抽屜 */
.admin__mobilebar {
  display: none;
}
.admin__overlay {
  display: none;
}

@media (max-width: 768px) {
  .admin,
  .admin.collapsed {
    grid-template-columns: 1fr;
  }
  .admin__mobilebar {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem 0.9rem;
    background: var(--color-primary-dark);
    color: #f3f4ee;
    position: sticky;
    top: 0;
    z-index: 40;
  }
  .hb {
    background: none;
    border: none;
    color: #f3f4ee;
    font-size: 1.4rem;
    line-height: 1;
  }
  /* 側欄變左側抽屜 */
  .side {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 240px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 60;
  }
  .side.open {
    transform: none;
  }
  .admin__overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 55;
  }
  /* 抽屜內一律顯示文字、隱藏桌機收合鈕 */
  .admin.collapsed .who {
    display: flex;
  }
  .admin.collapsed .lb {
    display: inline;
  }
  .collapse {
    display: none;
  }
  .admin.collapsed nav a,
  .admin.collapsed .logout {
    justify-content: flex-start;
    gap: 0.7rem;
  }
  .main {
    padding: 1rem 0.9rem 2.5rem;
  }
}
</style>
