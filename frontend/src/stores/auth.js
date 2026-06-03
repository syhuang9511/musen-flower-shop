import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/api/modules'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || '')

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  function setToken(t) {
    token.value = t
    if (t) localStorage.setItem('access_token', t)
    else localStorage.removeItem('access_token')
  }

  /** 應用啟動時還原登入狀態 */
  async function restoreSession() {
    if (!token.value) return
    try {
      user.value = await authApi.me()
    } catch {
      setToken('')
      user.value = null
    }
  }

  /** Email + 密碼登入 */
  async function loginByEmail(payload) {
    const res = await authApi.loginByEmail(payload)
    setToken(res.accessToken)
    user.value = res.user
  }

  /** Google / LINE 一鍵登入：用 provider 授權碼換 token */
  async function loginByOAuth(provider, code) {
    const res = await authApi.oauth(provider, code)
    setToken(res.accessToken)
    user.value = res.user
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      setToken('')
      user.value = null
    }
  }

  return { user, token, isLoggedIn, isAdmin, restoreSession, loginByEmail, loginByOAuth, logout }
})
