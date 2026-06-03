<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Google / LINE 授權回呼：用 code 換取後端 token
onMounted(async () => {
  const provider = route.params.provider
  const code = route.query.code
  try {
    await auth.loginByOAuth(provider, code)
    router.replace('/')
  } catch {
    router.replace('/login')
  }
})
</script>

<template>
  <div class="container" style="padding: 4rem 0; text-align: center">
    <p>登入處理中…</p>
  </div>
</template>
