<script setup>
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div class="toast-host">
      <TransitionGroup name="toast">
        <div v-for="t in toast.toasts" :key="t.id" class="toast" :class="`toast--${t.type}`">
          <span class="toast__icon">✓</span>
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 84px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  z-index: 1000;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.3rem;
  border-radius: 999px;
  background: rgba(43, 53, 44, 0.95);
  color: #fff;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #21301f;
  font-size: 0.75rem;
  font-weight: 700;
}
.toast--error {
  background: rgba(176, 58, 42, 0.95);
}
.toast--error .toast__icon {
  background: #fff;
  color: #b03a2a;
}

/* 進出場動畫 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
