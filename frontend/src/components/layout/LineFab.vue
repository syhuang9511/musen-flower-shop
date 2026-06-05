<script setup>
// LINE 線上客服懸浮按鈕（連結集中於 config/contact.js）
import { CONTACT } from '@/config/contact'
const lineUrl = CONTACT.lineUrl
</script>

<template>
  <a
    class="line-fab"
    :href="lineUrl"
    target="_blank"
    rel="noopener"
    aria-label="LINE 線上客服"
  >
    <svg class="line-fab__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.5 3 2 6.6 2 11.05c0 3.98 3.57 7.31 8.4 7.94.33.07.77.22.88.5.1.26.07.66.03.92l-.14.86c-.04.26-.2 1.02.9.56 1.1-.46 5.9-3.48 8.05-5.96 1.48-1.62 2.18-3.27 2.18-5.32C22.3 6.6 17.8 3 12 3Z"
      />
      <g fill="#06C755">
        <rect x="6.6" y="9.1" width="1.1" height="4.1" rx="0.2" />
        <path d="M9.1 9.1h.9l1.7 2.4V9.1h1v4.1h-.9l-1.7-2.4v2.4h-1z" />
        <rect x="13.9" y="9.1" width="1.1" height="4.1" rx="0.2" />
        <path d="M15.9 9.1h2.5v.95h-1.5v.6h1.4v.95h-1.4v.65h1.5v.95h-2.5z" />
      </g>
    </svg>
    <span class="line-fab__label">線上客服</span>
  </a>
</template>

<style scoped>
.line-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 120;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem 0.55rem 0.7rem;
  background: #06c755;
  color: #fff;
  border-radius: 999px;
  box-shadow: 0 6px 20px rgba(6, 199, 85, 0.4);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  transition: transform 0.18s, box-shadow 0.18s;
}
.line-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(6, 199, 85, 0.5);
}
.line-fab__icon {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
}

@media (max-width: 600px) {
  /* 手機：縮成圓形圖示鈕，省空間 */
  .line-fab {
    padding: 0.7rem;
    border-radius: 50%;
  }
  .line-fab__label {
    display: none;
  }
  .line-fab__icon {
    width: 30px;
    height: 30px;
  }
}
</style>
