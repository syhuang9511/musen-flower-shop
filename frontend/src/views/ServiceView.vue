<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// 包裝示意圖（品牌插圖）。若日後要換成實拍照片，存成 frontend/public/packaging.jpg
// 並把下面的 .svg 改為 .jpg 即可。
const base = import.meta.env.BASE_URL
const packImg = ref(`${base}packaging.svg`)
function onImgError() {
  packImg.value =
    'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1200&q=70'
}
</script>

<template>
  <div class="container service" style="padding: 2rem 1rem">
    <h1>客戶服務專區</h1>

    <!-- 包裝安心 -->
    <section class="pack">
      <div class="pack__text">
        <h2>📦 包裝安心</h2>
        <p class="pack__lead">
          每一份花禮與植栽，都由花藝師<strong>親手包裝、層層防護</strong>，
          從離店到送達，細心呵護每個環節，讓您收到時依然完好如初。
        </p>
        <ul class="pack__list">
          <li><strong>鮮花保水</strong>：花腳保水處理＋防撞內襯，鎖住水分與花型，運送不脫水。</li>
          <li><strong>盆栽固定</strong>：盆器固定與緩衝包材，避免土壤外漏、枝葉折損。</li>
          <li><strong>環保材質</strong>：採用牛皮紙、紙膠帶與可回收緩衝材，減少塑膠使用。</li>
          <li><strong>送禮質感</strong>：可附手寫賀卡與緞帶，開箱即是心意。</li>
          <li><strong>大型／脆弱植栽</strong>：專人貨車配送、現場協助擺位，全程專人呵護。</li>
        </ul>
      </div>
      <figure class="pack__img">
        <img :src="packImg" alt="花藝師職人手工包裝花禮" loading="lazy" @error="onImgError" />
        <figcaption>職人手工包裝・層層防護</figcaption>
      </figure>
    </section>

    <section class="info">
      <h2>付款流程</h2>
      <p>全站採用綠界科技 ECPay，支援信用卡刷卡結帳。</p>

      <h2>物流配送與運費</h2>
      <ul>
        <li>一般資材：可選 7-11 店到店或一般宅配。</li>
        <li>大型 / 脆弱植栽：一律由專人貨車外送（限台北市／新北市），以確保品質。</li>
      </ul>

      <h2>退換貨政策</h2>
      <p>
        鮮花類因屬易逝商品，恕不適用七天鑑賞期；一般資材依消保法辦理。
        詳細條款請參閱
        <RouterLink to="/return-policy">退換貨政策頁面</RouterLink>。
      </p>
    </section>
  </div>
</template>

<style scoped>
.service h1 {
  margin-bottom: 1.4rem;
}

/* 包裝安心 */
.pack {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 16px;
  padding: 1.8rem;
  margin-bottom: 2rem;
}
.pack__text h2 {
  margin: 0 0 0.8rem;
}
.pack__lead {
  color: #4a514a;
  line-height: 1.9;
  margin: 0 0 1rem;
}
.pack__list {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.pack__list li {
  line-height: 1.7;
  color: #4a514a;
}
.pack__img {
  margin: 0;
}
.pack__img img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow);
  display: block;
}
.pack__img figcaption {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.84rem;
  margin-top: 0.5rem;
  letter-spacing: 0.04em;
}

.info h2 {
  margin: 1.6rem 0 0.5rem;
}
.info ul {
  padding-left: 1.2rem;
  line-height: 1.9;
}

@media (max-width: 720px) {
  .pack {
    grid-template-columns: 1fr;
    gap: 1.3rem;
    padding: 1.3rem;
  }
  .pack__img {
    order: -1; /* 手機：圖片放上面 */
  }
}
</style>
