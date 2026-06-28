<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const eventList = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1000&q=80',
    badge: '限時優惠',
    title: '母親節限定花禮',
    dateRange: '即日起 ～ 2026/06/30',
    desc: '精選康乃馨與當季鮮花，以最細膩的手工包裝傳遞心意。活動期間滿 NT$1,000 即享 100 元折扣，讓每一束花都承載著最真實的情感。',
    coupon: 'WELCOME100',
    couponNote: '結帳輸入折扣碼，滿千折百',
    cta: '立即選購',
    ctaLink: '/products',
    tags: ['花束', '送禮', '滿額折扣'],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1000&q=80',
    badge: '特展進行中',
    title: '觀葉植栽特展',
    dateRange: '即日起 ～ 2026/07/15',
    desc: '把森林帶回家——精選琴葉榕、龜背芋、橡皮樹等大型落地植栽。雙北地區提供專業植物師親自到府安置服務，讓每一株植物都能在最適合的角落生長。',
    coupon: null,
    couponNote: null,
    cta: '瀏覽植栽',
    ctaLink: '/products',
    tags: ['觀葉植物', '大型盆栽', '專人到府'],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80',
    badge: '新會員專屬',
    title: '新會員首購禮',
    dateRange: '長期開放',
    desc: '加入沐森植研所會員，立即獲得首購折價券，開啟你的植感生活。會員獨享積分回饋、優先選購新品、專屬養護知識庫，與我們一起把植物帶進日常。',
    coupon: null,
    couponNote: '註冊後自動發放至會員帳戶',
    cta: '立即加入',
    ctaLink: '/register',
    tags: ['新會員', '折價券', '會員回饋'],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=1000&q=80',
    badge: '季節限定',
    title: '夏日多肉植物節',
    dateRange: '2026/06/15 ～ 2026/08/31',
    desc: '炎炎夏日，換上一盆清涼感的多肉植物！精選仙人掌、石蓮花、景天屬等數十種耐熱品種，搭配質感陶器盆，打造你的桌面小宇宙。購買任意 3 盆即享 9 折。',
    coupon: 'SUCCULENT10',
    couponNote: '任 3 盆以上享 9 折，折扣碼結帳時輸入',
    cta: '選購多肉',
    ctaLink: '/products',
    tags: ['多肉植物', '夏季限定', '買三折扣'],
  },
]

const copiedId = ref(null)

function copyCoupon(code, id) {
  navigator.clipboard.writeText(code).then(() => {
    copiedId.value = id
    setTimeout(() => (copiedId.value = null), 2000)
  })
}
</script>

<template>
  <div>
    <!-- 頁首 Hero -->
    <section class="hero">
      <div class="hero__overlay" />
      <div class="hero__content">
        <p class="hero__kicker">MUSEN ㅤ EVENTS</p>
        <h1>最新活動</h1>
        <p class="hero__sub">精選優惠・限定花禮・會員專屬，把美好植感帶入你的生活。</p>
      </div>
    </section>

    <div class="container events">
      <!-- 活動清單 -->
      <div class="event-list">
        <article v-for="ev in eventList" :key="ev.id" class="event-card">
          <!-- 圖片 -->
          <div class="event-card__img-wrap">
            <img :src="ev.image" :alt="ev.title" loading="lazy" class="event-card__img" />
            <span class="event-card__badge">{{ ev.badge }}</span>
          </div>

          <!-- 內容 -->
          <div class="event-card__body">
            <div class="event-card__meta">
              <span class="event-card__date">🗓 {{ ev.dateRange }}</span>
              <div class="event-card__tags">
                <span v-for="t in ev.tags" :key="t" class="event-tag">{{ t }}</span>
              </div>
            </div>

            <h2 class="event-card__title">{{ ev.title }}</h2>
            <p class="event-card__desc">{{ ev.desc }}</p>

            <!-- 折扣碼 -->
            <div v-if="ev.coupon" class="coupon-block">
              <div class="coupon-block__inner">
                <div>
                  <p class="coupon-block__label">折扣碼</p>
                  <p class="coupon-block__code">{{ ev.coupon }}</p>
                  <p v-if="ev.couponNote" class="coupon-block__note">{{ ev.couponNote }}</p>
                </div>
                <button
                  class="coupon-block__copy"
                  :class="{ copied: copiedId === ev.id }"
                  @click="copyCoupon(ev.coupon, ev.id)"
                >
                  {{ copiedId === ev.id ? '已複製 ✓' : '複製' }}
                </button>
              </div>
            </div>
            <p v-else-if="ev.couponNote" class="coupon-note-only">📌 {{ ev.couponNote }}</p>

            <!-- CTA -->
            <RouterLink :to="ev.ctaLink" class="event-card__cta">
              {{ ev.cta }} →
            </RouterLink>
          </div>
        </article>
      </div>

      <!-- 底部提示 -->
      <div class="events__footer">
        <p>活動內容與期限以官方公告為準，如有疑問請透過 <RouterLink to="/contact">聯絡我們</RouterLink> 洽詢。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hero */
.hero {
  position: relative;
  height: 300px;
  background: url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=70')
    center / cover no-repeat;
  display: flex;
  align-items: center;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(30, 42, 30, 0.55), rgba(30, 42, 30, 0.65));
}
.hero__content {
  position: relative;
  z-index: 1;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  color: #fff;
}
.hero__kicker {
  margin: 0 0 0.4rem;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}
.hero__content h1 {
  margin: 0;
  font-size: 2.2rem;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.3);
}
.hero__sub {
  margin: 0.7rem 0 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 1rem;
  line-height: 1.7;
}

/* 頁面容器 */
.events {
  max-width: 900px;
  padding: 2.8rem 1rem 3rem;
}

/* 活動清單 */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

/* 活動卡片 */
.event-card {
  display: grid;
  grid-template-columns: 360px 1fr;
  border-radius: 20px;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  box-shadow: 0 2px 18px rgba(74, 93, 78, 0.07);
  transition: box-shadow 0.2s;
}
.event-card:hover {
  box-shadow: 0 6px 28px rgba(74, 93, 78, 0.13);
}

.event-card__img-wrap {
  position: relative;
  overflow: hidden;
}
.event-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.event-card:hover .event-card__img {
  transform: scale(1.04);
}
.event-card__badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.73rem;
  font-weight: 600;
  padding: 0.28rem 0.75rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.event-card__body {
  padding: 1.8rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.event-card__meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.event-card__date {
  font-size: 0.8rem;
  color: var(--color-muted);
}
.event-card__tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.event-tag {
  font-size: 0.7rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--color-accent);
  color: var(--color-primary);
}
.event-card__title {
  margin: 0;
  font-size: 1.3rem;
  letter-spacing: 0.04em;
  color: var(--color-primary-dark);
  line-height: 1.4;
}
.event-card__desc {
  margin: 0;
  color: #4a514a;
  line-height: 1.85;
  font-size: 0.94rem;
  flex: 1;
}

/* 折扣碼區塊 */
.coupon-block {
  border-radius: 12px;
  border: 1.5px dashed var(--color-accent);
  background: #f4f9f3;
  padding: 0.85rem 1rem;
}
.coupon-block__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.coupon-block__label {
  margin: 0;
  font-size: 0.72rem;
  color: var(--color-muted);
  letter-spacing: 0.06em;
}
.coupon-block__code {
  margin: 0.15rem 0 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  font-family: monospace;
}
.coupon-block__note {
  margin: 0.2rem 0 0;
  font-size: 0.73rem;
  color: var(--color-muted);
}
.coupon-block__copy {
  flex: 0 0 auto;
  border: 1.5px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  border-radius: 8px;
  padding: 0.42rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.18s;
  white-space: nowrap;
}
.coupon-block__copy:hover {
  background: var(--color-primary);
  color: #fff;
}
.coupon-block__copy.copied {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.coupon-note-only {
  margin: 0;
  font-size: 0.82rem;
  color: #7a7e76;
  line-height: 1.6;
}

.event-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--color-primary);
  color: #fff;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  align-self: flex-start;
  transition: background 0.18s;
  margin-top: auto;
}
.event-card__cta:hover {
  background: var(--color-primary-dark);
}

.events__footer {
  margin-top: 2.8rem;
  padding-top: 1.4rem;
  border-top: 1px solid var(--color-line);
  text-align: center;
  font-size: 0.83rem;
  color: var(--color-muted);
  line-height: 1.8;
}
.events__footer a {
  color: var(--color-primary);
}

@media (max-width: 700px) {
  .hero {
    height: 220px;
  }
  .hero__content h1 {
    font-size: 1.6rem;
  }
  .event-card {
    grid-template-columns: 1fr;
  }
  .event-card__img-wrap {
    height: 200px;
  }
  .event-card__body {
    padding: 1.3rem 1.2rem;
  }
}
</style>
