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

  /** 應用啟動時還原登入狀態（後端統一回 { code, message, data }，取 data） */
  async function restoreSession() {
    if (!token.value) return
    try {
      const res = await authApi.me()
      user.value = res.data
    } catch {
      setToken('')
      user.value = null
    }
  }

  /** Email + 密碼登入 */
  async function loginByEmail(payload) {
    const { data } = await authApi.loginByEmail(payload)
    setToken(data.accessToken)
    user.value = data.user
  }

  /** Google / LINE 一鍵登入：用 provider 授權碼換 token */
  async function loginByOAuth(provider, code) {
    const { data } = await authApi.oauth(provider, code)
    setToken(data.accessToken)
    user.value = data.user
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
