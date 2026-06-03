<script setup>
import { reactive, ref } from 'vue'
import { authApi } from '@/api/modules'
import AuthShell from '@/components/auth/AuthShell.vue'

// 4.1 Email 註冊：EmailJS 發送 6 位數驗證碼，後端驗證時效（5 分鐘）與正確性
const form = reactive({ email: '', code: '', password: '' })
const step = ref(1)
const msg = ref('')
const error = ref('')

async function sendCode() {
  error.value = ''
  msg.value = ''
  try {
    await authApi.sendEmailCode(form.email)
    step.value = 2
    msg.value = '驗證碼已寄出，5 分鐘內有效。'
  } catch (e) {
    error.value = e.message
  }
}

async function verify() {
  error.value = ''
  try {
    await authApi.verifyEmailCode(form)
    msg.value = '註冊成功，請前往登入。'
    step.value = 3
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <AuthShell title="會員註冊" subtitle="加入沐森，開啟您的植感生活">
    <template v-if="step === 1">
      <input v-model="form.email" placeholder="電子信箱" autocomplete="email" />
      <input v-model="form.password" type="password" placeholder="設定密碼" autocomplete="new-password" />
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button class="auth-btn" @click="sendCode">寄送驗證碼</button>
    </template>

    <template v-else-if="step === 2">
      <input v-model="form.code" placeholder="請輸入 6 位數驗證碼" maxlength="6" inputmode="numeric" />
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button class="auth-btn" @click="verify">驗證並完成註冊</button>
    </template>

    <template v-else>
      <p class="auth-msg">🌿 {{ msg }}</p>
      <RouterLink to="/login"><button class="auth-btn">前往登入</button></RouterLink>
    </template>

    <p v-if="msg && step !== 3" class="auth-msg">{{ msg }}</p>

    <template #footer>
      已經是會員了？<RouterLink to="/login" class="auth-link">前往登入</RouterLink>
    </template>
  </AuthShell>
</template>

<style scoped>
.auth-link {
  color: var(--color-accent);
  font-weight: 600;
}
</style>
