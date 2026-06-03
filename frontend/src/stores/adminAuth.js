import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 後台管理員登入（DEMO）。
 *
 * ⚠️ 正式環境請改由後端驗證並簽發 JWT，切勿在前端存放帳密。
 * 此處為了在後端尚未啟動時也能完整 demo 後台登入流程，將帳號內建於前端，
 * 登入狀態存於 LocalStorage。
 */
const SESSION_KEY = 'floral_admin_session'

const ACCOUNTS = [
  { username: 'yun', password: '1234', name: 'Yun', role: 'ADMIN' },
  { username: 'admin', password: '1234', name: '系統管理員', role: 'ADMIN' },
]

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const current = ref(load())

  function load() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    } catch {
      return null
    }
  }

  const isLoggedIn = computed(() => !!current.value)

  function login(username, password) {
    const acc = ACCOUNTS.find(
      (a) => a.username === username.trim() && a.password === password,
    )
    if (!acc) {
      throw new Error('帳號或密碼錯誤')
    }
    current.value = { username: acc.username, name: acc.name, role: acc.role }
    localStorage.setItem(SESSION_KEY, JSON.stringify(current.value))
  }

  function logout() {
    current.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return { current, isLoggedIn, login, logout }
})
