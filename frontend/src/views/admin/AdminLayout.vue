<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'

const admin = useAdminAuthStore()
const router = useRouter()

function logout() {
  admin.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="container admin" style="padding: 2rem 0">
    <aside>
      <div class="admin__user">
        <span class="admin__avatar">{{ (admin.current?.name || 'A').charAt(0) }}</span>
        <div>
          <strong>{{ admin.current?.name }}</strong>
          <small>{{ admin.current?.username }}</small>
        </div>
      </div>
      <h2>後台管理</h2>
      <nav>
        <RouterLink to="/admin">營運儀表板</RouterLink>
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
nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
    gap: 1rem;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>
