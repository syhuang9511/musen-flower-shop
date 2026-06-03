<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastHost from '@/components/ui/ToastHost.vue'

const auth = useAuthStore()
const wishlist = useWishlistStore()

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
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
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
