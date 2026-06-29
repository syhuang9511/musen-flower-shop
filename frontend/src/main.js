import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)

// 全域錯誤處理：避免單一元件渲染錯誤導致整頁白屏
app.config.errorHandler = (err, instance, info) => {
  console.error('[App Error]', info, err)
}

app.use(createPinia())
app.use(router)

app.mount('#app')

// 攔截未處理的動態模組載入失敗（lazy chunk），自動重整一次
window.addEventListener('unhandledrejection', (e) => {
  const msg = e?.reason?.message || ''
  if (/dynamically imported module|Importing a module script failed|Failed to fetch/i.test(msg)) {
    const KEY = 'chunk-reload-at'
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last > 10000) {
      sessionStorage.setItem(KEY, String(Date.now()))
      window.location.reload()
    }
  }
})
