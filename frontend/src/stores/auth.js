import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/api/modules'

/**
 * 會員登入狀態。
 *
 * 後端就緒時走真實 JWT；後端未啟動（呼叫失敗）時自動退回「Demo 後備」：
 * 以 LocalStorage 模擬會員登入，方便在無後端下測試購物流程。
 * 待後端接上，真實登入成功就不會進入後備分支，無需改動畫面。
 */
const DEMO_MEMBERS_KEY = 'floral_demo_members'
const DEMO_SESSION_KEY = 'floral_demo_member'

// 內建一組可直接使用的體驗帳號
export const DEMO_ACCOUNT = { email: 'demo@musen.test', password: 'demo1234', name: '沐森體驗會員' }

function loadDemoMembers() {
  try {
    const v = JSON.parse(localStorage.getItem(DEMO_MEMBERS_KEY) || 'null')
    if (Array.isArray(v) && v.length) return v
  } catch {
    /* ignore */
  }
  return [{ id: 9001, ...DEMO_ACCOUNT }]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || '')

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isDemo = computed(() => token.value.startsWith('demo-'))

  function setToken(t) {
    token.value = t
    if (t) localStorage.setItem('access_token', t)
    else localStorage.removeItem('access_token')
  }

  // ---- Demo 後備 ----
  function loginDemo(member) {
    const u = { id: member.id, email: member.email, name: member.name, role: 'MEMBER' }
    setToken('demo-' + member.id)
    user.value = u
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(u))
  }

  /** 應用啟動時還原登入狀態（後端統一回 { code, message, data }，取 data） */
  async function restoreSession() {
    if (!token.value) return
    if (token.value.startsWith('demo-')) {
      try {
        user.value = JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null')
      } catch {
        setToken('')
        user.value = null
      }
      return
    }
    try {
      const res = await authApi.me()
      user.value = res.data
    } catch {
      setToken('')
      user.value = null
    }
  }

  /** Email + 密碼登入（後端失敗 → Demo 後備） */
  async function loginByEmail(payload) {
    try {
      const { data } = await authApi.loginByEmail(payload)
      setToken(data.accessToken)
      user.value = data.user
    } catch (e) {
      const member = loadDemoMembers().find(
        (m) => m.email === payload.email?.trim() && m.password === payload.password,
      )
      if (!member) throw new Error(e?.message?.includes('Network') ? '帳號或密碼錯誤' : e.message)
      loginDemo(member)
    }
  }

  /** Demo 註冊：建立一組本地會員（後端就緒後改走 authApi） */
  function registerDemo({ email, password, name }) {
    const members = loadDemoMembers()
    if (members.some((m) => m.email === email)) throw new Error('此信箱已註冊')
    const member = { id: Date.now(), email, password, name: name || email.split('@')[0] }
    localStorage.setItem(DEMO_MEMBERS_KEY, JSON.stringify([...members, member]))
    loginDemo(member)
  }

  /** Google / LINE 一鍵登入：用 provider 授權碼換 token */
  async function loginByOAuth(provider, code) {
    const { data } = await authApi.oauth(provider, code)
    setToken(data.accessToken)
    user.value = data.user
  }

  async function logout() {
    try {
      if (!token.value.startsWith('demo-')) await authApi.logout()
    } finally {
      setToken('')
      user.value = null
      localStorage.removeItem(DEMO_SESSION_KEY)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    isDemo,
    restoreSession,
    loginByEmail,
    loginByOAuth,
    registerDemo,
    logout,
  }
})
