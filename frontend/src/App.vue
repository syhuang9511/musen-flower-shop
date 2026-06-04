<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LineFab from '@/components/layout/LineFab.vue'
import ToastHost from '@/components/ui/ToastHost.vue'

const auth = useAuthStore()
const wishlist = useWishlistStore()
const route = useRoute()

// 後台（/admin）為管理介面，不顯示前台 header/footer
const isAdminArea = computed(() => route.path.startsWith('/admin'))

onMounted(async () => {
  // 還原登入狀態；登入後合併訪客 LocalStorage 收藏
  await auth.restoreSession()
  if (auth.isLoggedIn) {
    await wishlist.mergeGuestWishlist()
  }
})
</script>

<template>
  <div class="app-shell">
    <AppHeader v-if="!isAdminArea" />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter v-if="!isAdminArea" />
    <LineFab v-if="!isAdminArea" />
    <ToastHost />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-main {
  flex: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
