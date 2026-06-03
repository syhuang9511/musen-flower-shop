<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="auth">
    <div class="auth__bg" aria-hidden="true"></div>

    <div class="auth__card">
      <p class="auth__brand">沐森植研所 ㅤMUSEN</p>
      <h1 class="auth__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth__subtitle">{{ subtitle }}</p>

      <div class="auth__body">
        <slot />
      </div>

      <div v-if="$slots.footer" class="auth__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth {
  position: relative;
  min-height: calc(100vh - 66px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.25rem;
  overflow: hidden;
}

/* 低彩度墨綠背景 + 植物意象光暈 */
.auth__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 22%, rgba(156, 175, 148, 0.28), transparent 42%),
    radial-gradient(circle at 82% 78%, rgba(74, 93, 78, 0.45), transparent 48%),
    linear-gradient(150deg, #2b352c 0%, #3a4a3d 48%, #243024 100%);
}
.auth__bg::after {
  /* 細緻噪點 / 葉影層，提升質感 */
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1400&q=60');
  background-size: cover;
  background-position: center;
  opacity: 0.12;
  mix-blend-mode: luminosity;
}

/* 半透明玻璃卡片 */
.auth__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 2.6rem 2.2rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px) saturate(120%);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  color: #f3f4ee;
}

.auth__brand {
  margin: 0 0 1.4rem;
  font-size: 0.78rem;
  letter-spacing: 0.32em;
  color: rgba(243, 244, 238, 0.7);
}
.auth__title {
  margin: 0;
  font-size: 1.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}
.auth__subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: rgba(243, 244, 238, 0.72);
}
.auth__body {
  margin-top: 1.8rem;
}
.auth__footer {
  margin-top: 1.6rem;
  text-align: center;
  font-size: 0.88rem;
  color: rgba(243, 244, 238, 0.78);
}

/* ---- 玻璃卡內共用表單樣式（透過 :slotted 套用到插槽內容） ---- */
.auth__body :slotted(input) {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  margin: 0.55rem 0;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.2s, background 0.2s;
}
.auth__body :slotted(input::placeholder) {
  color: rgba(243, 244, 238, 0.55);
}
.auth__body :slotted(input:focus) {
  outline: none;
  border-color: var(--color-accent);
  background: rgba(255, 255, 255, 0.14);
}
.auth__body :slotted(.auth-btn) {
  display: block;
  width: 100%;
  margin-top: 0.9rem;
  padding: 0.85rem;
  border: none;
  border-radius: 10px;
  background: var(--color-accent);
  color: #21301f;
  font-weight: 600;
  letter-spacing: 0.08em;
  transition: transform 0.15s, opacity 0.2s;
}
.auth__body :slotted(.auth-btn:hover) {
  opacity: 0.92;
}
.auth__body :slotted(.auth-btn--ghost) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #f3f4ee;
}
.auth__body :slotted(.auth-divider) {
  text-align: center;
  margin: 1.3rem 0 0.6rem;
  font-size: 0.82rem;
  color: rgba(243, 244, 238, 0.55);
}
.auth__body :slotted(.auth-error) {
  color: #ffc9c2;
  font-size: 0.86rem;
  margin: 0.3rem 0;
}
.auth__body :slotted(.auth-msg) {
  color: #d6e6cf;
  font-size: 0.86rem;
  margin: 0.6rem 0 0;
}

@media (max-width: 480px) {
  .auth__card {
    padding: 2rem 1.4rem;
  }
  .auth__title {
    font-size: 1.45rem;
  }
}
</style>
