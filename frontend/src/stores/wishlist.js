import { defineStore } from 'pinia'
import { ref } from 'vue'
import { wishlistApi } from '@/api/modules'
import { useAuthStore } from './auth'

const GUEST_KEY = 'floral_wishlist_guest'

/**
 * 收藏清單：
 * - 訪客：暫存於 LocalStorage
 * - 登入：同步後端；登入瞬間將訪客收藏合併進會員帳戶
 */
export const useWishlistStore = defineStore('wishlist', () => {
  const productIds = ref(loadGuest())

  function loadGuest() {
    try {
      return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]')
    } catch {
      return []
    }
  }

  function persistGuest() {
    localStorage.setItem(GUEST_KEY, JSON.stringify(productIds.value))
  }

  function has(productId) {
    return productIds.value.includes(productId)
  }

  async function toggle(productId) {
    const auth = useAuthStore()
    if (has(productId)) {
      productIds.value = productIds.value.filter((id) => id !== productId)
      if (auth.isLoggedIn) await wishlistApi.remove(productId)
    } else {
      productIds.value.push(productId)
      if (auth.isLoggedIn) await wishlistApi.add(productId)
    }
    if (!auth.isLoggedIn) persistGuest()
  }

  /** 登入後：把訪客 LocalStorage 收藏合併上雲，再以後端為準 */
  async function mergeGuestWishlist() {
    const guestIds = loadGuest()
    if (guestIds.length) {
      await wishlistApi.merge(guestIds)
      localStorage.removeItem(GUEST_KEY)
    }
    const list = await wishlistApi.list()
    productIds.value = list.map((p) => p.id)
  }

  return { productIds, has, toggle, mergeGuestWishlist }
})
