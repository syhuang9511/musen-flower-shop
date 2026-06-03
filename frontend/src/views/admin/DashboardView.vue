<template>
  <div>
    <h1>營運儀表板</h1>
    <div class="cards">
      <div class="stat"><span>今日訂單</span><strong>—</strong></div>
      <div class="stat"><span>今日營收</span><strong>—</strong></div>
      <div class="stat"><span>未結帳購物車</span><strong>—</strong></div>
      <div class="stat"><span>轉化率</span><strong>—</strong></div>
    </div>
    <p class="notice" style="margin-top: 1rem">待串接後端 /admin/analytics 統計 API。</p>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
.stat {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
.stat strong {
  font-size: 1.6rem;
  color: var(--color-primary);
}
</style>
