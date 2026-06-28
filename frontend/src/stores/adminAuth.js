import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/api/modules'

/**
 * 後台管理員登入。
 * 優先嘗試後端 JWT 驗證（{username}@floralshop.test），成功後
 * 將 JWT 存入 localStorage 供 adminProductApi 等呼叫使用。
 * 後端不可用時自動退回本地 demo。
 */
const SESSION_KEY = 'floral_admin_session'

const DEMO_ACCOUNTS = [
  { username: 'yun',   password: '1234',      name: '小花', role: 'ADMIN' },
  { username: 'admin', password: 'admin1234',  name: '大明', role: 'ADMIN' },
]

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const current = ref(load())

  function load() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
  }

  const isLoggedIn = computed(() => !!current.value)

  async function login(username, password) {
    // 先嘗試真實後端（帳號 = username@floralshop.test）
    try {
      const email = username.includes('@') ? username : `${username}@floralshop.test`
      const { data } = await authApi.loginByEmail({ email, password })
      if (data.user.role !== 'ADMIN') throw new Error('非管理員帳號')
      localStorage.setItem('access_token', data.accessToken)
      current.value = { username, name: data.user.name, role: 'ADMIN', realJwt: true }
      localStorage.setItem(SESSION_KEY, JSON.stringify(current.value))
      return
    } catch {
      // 後端失敗 → 嘗試本地 demo 帳號
    }

    const acc = DEMO_ACCOUNTS.find(
      (a) => a.username === username.trim() && a.password === password,
    )
    if (!acc) throw new Error('帳號或密碼錯誤')
    current.value = { username: acc.username, name: acc.name, role: acc.role, realJwt: false }
    localStorage.setItem(SESSION_KEY, JSON.stringify(current.value))
  }

  function logout() {
    current.value = null
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('access_token')
  }

  return { current, isLoggedIn, login, logout }
})
