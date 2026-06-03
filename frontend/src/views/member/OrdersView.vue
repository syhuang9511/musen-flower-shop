<script setup>
// 4.2 訂單狀態軸：已接單 → 備貨中 → 配送中 → 已送達 → 已完成
const steps = ['已接單', '備貨中', '配送中', '已送達', '已完成']
const currentStep = 2 // 範例
</script>

<template>
  <div>
    <h1>我的訂單</h1>
    <div class="timeline">
      <div
        v-for="(s, idx) in steps"
        :key="s"
        class="node"
        :class="{ active: idx <= currentStep }"
      >
        <span class="dot"></span>{{ s }}
      </div>
    </div>
    <p class="notice" style="margin-top: 1rem">範例資料 — 串接後端 /orders 後顯示真實訂單。</p>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-muted);
}
.node.active {
  color: var(--color-primary);
  font-weight: 700;
}
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: currentColor;
  margin-bottom: 0.3rem;
}
</style>
