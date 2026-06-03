<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthShell from '@/components/auth/AuthShell.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const form = reactive({ email: '', password: '' })
const msg = reactive({ error: '' })

async function submit() {
  msg.error = ''
  try {
    await auth.loginByEmail(form)
    router.push(route.query.redirect || '/')
  } catch (e) {
    msg.error = e.message
  }
}

// OAuth：導向後端產生的授權 URL（此處示意）
function oauth(provider) {
  window.location.href = `/api/auth/oauth/${provider}/authorize`
}
</script>

<template>
  <AuthShell title="會員登入" subtitle="歡迎回到沐森，繼續您的植感生活">
    <input v-model="form.email" placeholder="電子信箱" autocomplete="email" />
    <input v-model="form.password" type="password" placeholder="密碼" autocomplete="current-password" @keyup.enter="submit" />
    <p v-if="msg.error" class="auth-error">{{ msg.error }}</p>
    <button class="auth-btn" @click="submit">登入</button>

    <p class="auth-divider">— 或使用社群帳號 —</p>
    <button class="auth-btn auth-btn--ghost" @click="oauth('google')">使用 Google 登入</button>
    <button class="auth-btn auth-btn--ghost" @click="oauth('line')">使用 LINE 登入</button>

    <template #footer>
      還沒有帳號？<RouterLink to="/register" class="auth-link">前往註冊</RouterLink>
    </template>
  </AuthShell>
</template>

<style scoped>
.auth-link {
  color: var(--color-accent);
  font-weight: 600;
}
</style>
