<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'
import AuthShell from '@/components/auth/AuthShell.vue'

const admin = useAdminAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ username: '', password: '' })
const error = ref('')

function submit() {
  error.value = ''
  try {
    admin.login(form.username, form.password)
    router.push(route.query.redirect || '/admin')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <AuthShell title="後台管理登入" subtitle="請使用管理員帳號登入">
    <input v-model="form.username" placeholder="帳號" autocomplete="username" />
    <input
      v-model="form.password"
      type="password"
      placeholder="密碼"
      autocomplete="current-password"
      @keyup.enter="submit"
    />
    <p v-if="error" class="auth-error">{{ error }}</p>
    <button class="auth-btn" @click="submit">登入後台</button>

    <template #footer>
      <span class="hint">DEMO 帳號：yun / admin　密碼：1234</span>
    </template>
  </AuthShell>
</template>

<style scoped>
.hint {
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}
</style>
