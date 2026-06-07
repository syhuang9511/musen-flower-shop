<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BannerCarousel from '@/components/ui/BannerCarousel.vue'

const imgFailed = reactive({})
const photoIdx = ref(0)

watch(
  () => photoIdx.value,
  () => {},
)

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=70',
    title: '毛孩也能安心的綠意',
    subtitle: '精選對貓・狗・鳥・兔・鼠無毒的花草，打造安全的共居空間',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=70',
    title: '有機種植・無農藥',
    subtitle: '全程使用有機土，不使用化學殺蟲劑、除草劑與肥料',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=1600&q=70',
    title: '依寵物挑選植物',
    subtitle: '貓・狗・鸚鵡・兔子・寵物鼠，各有專屬安全清單',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=70',
    title: '自然共居・從植物開始',
    subtitle: '一片葉、一盆草，也可以是給毛孩最溫柔的禮物',
  },
]

const pets = [
  {
    key: 'cat',
    name: '貓咪',
    en: 'Cats',
    emoji: '🐱',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=320&q=70',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
        caption: '🐱 貓咪與室內植物的共居日常',
      },
      {
        url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80',
        caption: '🌿 貓薄荷——讓貓咪又愛又放鬆的機能草本',
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80',
        caption: '🪴 吊蘭與波士頓蕨——無毒且淨化空氣的首選',
      },
      {
        url: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&w=1000&q=80',
        caption: '🌸 非洲堇・玫瑰——安全陪伴貓咪的美麗花卉',
      },
    ],
    tags: ['貓咪', '室內植物', '無毒確認', '共居'],
    updatedAt: '2025 年 5 月',
    readTime: '4 分鐘',
    intro:
      '貓咪對許多常見室內植物（如百合、黃金葛、龜背芋）都會產生嚴重的中毒反應。以下這些花草對貓咪完全無毒，能讓牠安全探索與玩耍：',
    groups: [
      {
        label: '機能性草本',
        items: [
          { zh: '貓薄荷', en: 'Catnip', icon: '🌿' },
          { zh: '木天蓼', en: 'Silvervine', icon: '🌿' },
          { zh: '貓草（小麥・燕麥・大麥草）', en: 'Cat Grass', icon: '🌱', note: '幫助吐毛球' },
        ],
      },
      {
        label: '觀葉植物',
        items: [
          { zh: '吊蘭', en: 'Spider Plant', icon: '🪴' },
          { zh: '波士頓蕨', en: 'Boston Fern', icon: '🪴' },
          { zh: '黃椰子', en: 'Areca Palm', icon: '🌴' },
          { zh: '西瓜皮椒草', en: 'Watermelon Peperomia', icon: '🪴' },
        ],
      },
      {
        label: '花卉',
        items: [
          { zh: '非洲堇', en: 'African Violet', icon: '🌸' },
          { zh: '向日葵', en: 'Sunflower', icon: '🌻' },
          { zh: '玫瑰', en: 'Rose', icon: '🌹', note: '盆栽建議修剪刺以免扎傷' },
        ],
      },
    ],
  },
  {
    key: 'dog',
    name: '狗狗',
    en: 'Dogs',
    emoji: '🐶',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=320&q=70',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80',
        caption: '🐶 狗狗在花園裡自由奔跑的快樂時光',
      },
      {
        url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=80',
        caption: '🌿 迷迭香與百里香——香氣怡人又可入菜的安全香草',
      },
      {
        url: 'https://images.unsplash.com/photo-1456428746267-a1756408f782?auto=format&fit=crop&w=1000&q=80',
        caption: '🌼 萬壽菊・金魚草——為庭院帶來繽紛色彩的無毒花卉',
      },
      {
        url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1000&q=80',
        caption: '🪴 吊蘭・波士頓蕨——室內常見的安全觀葉植物',
      },
    ],
    tags: ['狗狗', '香草植物', '庭院種植', '無毒'],
    updatedAt: '2025 年 5 月',
    readTime: '4 分鐘',
    intro: '狗狗有時會因無聊或腸胃不適而啃咬植物。以下植物無毒且帶有淡淡香氣：',
    groups: [
      {
        label: '香草植物',
        items: [
          { zh: '百里香', en: 'Thyme', icon: '🌿', note: '可入菜' },
          { zh: '迷迭香', en: 'Rosemary', icon: '🌿', note: '可入菜' },
          { zh: '羅勒', en: 'Basil', icon: '🌿', note: '可入菜' },
        ],
      },
      {
        label: '觀花植物',
        items: [
          { zh: '金魚草', en: 'Snapdragon', icon: '🌸' },
          { zh: '萬壽菊', en: 'Marigold', icon: '🌼' },
          { zh: '向日葵', en: 'Sunflower', icon: '🌻' },
        ],
      },
      {
        label: '觀葉植物',
        items: [
          { zh: '吊蘭', en: 'Spider Plant', icon: '🪴' },
          { zh: '波士頓蕨', en: 'Boston Fern', icon: '🪴' },
          { zh: '冷水花', en: 'Aluminum Plant', icon: '🪴' },
        ],
      },
    ],
  },
  {
    key: 'parrot',
    name: '鸚鵡',
    en: 'Parrots',
    emoji: '🦜',
    photo: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=320&q=70',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80',
        caption: '🦜 鸚鵡天生喜歡啃咬植物，選對品種至關重要',
      },
      {
        url: 'https://images.unsplash.com/photo-1510006489044-919e5b3bdc50?auto=format&fit=crop&w=1000&q=80',
        caption: '🌺 朱槿 / 扶桑花——鸚鵡最愛的可食用花卉',
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80',
        caption: '🌼 金蓮花・蒲公英——全株可食且無農藥',
      },
      {
        url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80',
        caption: '🎋 竹子・蘋果枝葉——天然磨喙玩具，須無農藥',
      },
    ],
    tags: ['鸚鵡', '可食用花卉', '無農藥', '磨喙植物'],
    updatedAt: '2025 年 4 月',
    readTime: '5 分鐘',
    intro:
      '鳥類的呼吸道與消化道非常敏感，天生喜歡啃咬樹枝與葉片來磨喙。種植給鸚鵡的植物，絕對不能使用任何農藥或化學肥料：',
    groups: [
      {
        label: '可啃咬花卉',
        items: [
          { zh: '朱槿 / 扶桑花', en: 'Hibiscus', icon: '🌺' },
          { zh: '金蓮花', en: 'Nasturtium', icon: '🌼' },
          { zh: '萬壽菊', en: 'Marigold', icon: '🌼' },
          { zh: '蒲公英', en: 'Dandelion', icon: '🌼' },
        ],
      },
      {
        label: '枝葉類',
        items: [
          { zh: '竹子', en: 'Bamboo', icon: '🎋', note: '須無農藥' },
          { zh: '蘋果樹枝葉', en: 'Apple branches', icon: '🍃', note: '須無農藥' },
        ],
      },
      {
        label: '室內盆栽',
        items: [
          { zh: '吊蘭', en: 'Spider Plant', icon: '🪴' },
          { zh: '非洲堇', en: 'African Violet', icon: '🌸' },
          { zh: '秋海棠', en: 'Begonia', icon: '🌸' },
        ],
      },
    ],
  },
  {
    key: 'rabbit',
    name: '兔子',
    en: 'Rabbits',
    emoji: '🐰',
    photo: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=320&q=70',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80',
        caption: '🐰 兔子是草食性動物，對植物有天然好奇心',
      },
      {
        url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1000&q=80',
        caption: '🌾 提摩西草・果園草——最理想的主食牧草',
      },
      {
        url: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&w=1000&q=80',
        caption: '🌿 香菜・薄荷・巴西里——兔子的健康小零食',
      },
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=1000&q=80',
        caption: '🌼 蒲公英・玫瑰花瓣・金盞花——確保無農藥可安心食用',
      },
    ],
    tags: ['兔子', '牧草', '可食用植物', '草食動物'],
    updatedAt: '2025 年 4 月',
    readTime: '4 分鐘',
    intro: '兔子是草食性動物，種植的花草很多時候會直接變成牠們的「零食」或「下午茶」：',
    groups: [
      {
        label: '主食牧草類',
        items: [
          { zh: '提摩西草', en: 'Timothy grass', icon: '🌾', note: '可買種子自種' },
          { zh: '果園草', en: 'Orchard grass', icon: '🌾', note: '可買種子自種' },
        ],
      },
      {
        label: '香草與蔬菜',
        items: [
          { zh: '香菜', en: 'Cilantro', icon: '🌿' },
          { zh: '荷蘭芹 / 巴西里', en: 'Parsley', icon: '🌿' },
          { zh: '薄荷', en: 'Mint', icon: '🌿' },
          { zh: '羅勒', en: 'Basil', icon: '🌿' },
        ],
      },
      {
        label: '安全花卉',
        items: [
          { zh: '玫瑰花瓣', en: 'Rose petals', icon: '🌹', note: '須確保無農藥' },
          { zh: '蒲公英', en: 'Dandelion', icon: '🌼' },
          { zh: '金盞花', en: 'Calendula', icon: '🌼' },
        ],
      },
    ],
  },
  {
    key: 'rodent',
    name: '寵物鼠',
    en: 'Rats / Hamsters / Guinea Pigs',
    emoji: '🐹',
    photo: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=320&q=70',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=1000&q=80',
        caption: '🐹 小型囓齒類喜歡躲藏與咀嚼，植物是最好的環境豐富化',
      },
      {
        url: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=1000&q=80',
        caption: '☘️ 三葉草・苜蓿草——小鼠最愛的天然零食',
      },
      {
        url: 'https://images.unsplash.com/photo-1456428746267-a1756408f782?auto=format&fit=crop&w=1000&q=80',
        caption: '🌿 羅勒・薄荷・百里香——少量提供，香氣十足的安全香草',
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80',
        caption: '🌼 萬壽菊・金盞花——可安心食用的鮮豔花卉',
      },
    ],
    tags: ['倉鼠', '天竺鼠', '囓齒類', '草本植物'],
    updatedAt: '2025 年 3 月',
    readTime: '3 分鐘',
    intro: '小型囓齒類動物喜歡躲藏與咀嚼，可以種一些小巧且無毒的植物讓牠們偶爾加菜：',
    groups: [
      {
        label: '草本與葉菜',
        items: [
          { zh: '三葉草 / 苜蓿草', en: 'Clover / Alfalfa', icon: '☘️' },
          { zh: '蒲公英', en: 'Dandelion', icon: '🌼', note: '全株可食，非常受歡迎' },
        ],
      },
      {
        label: '香草類',
        items: [
          { zh: '羅勒', en: 'Basil', icon: '🌿' },
          { zh: '薄荷', en: 'Mint', icon: '🌿' },
          { zh: '百里香', en: 'Thyme', icon: '🌿' },
        ],
      },
      {
        label: '花卉',
        items: [
          { zh: '萬壽菊', en: 'Marigold', icon: '🌼' },
          { zh: '金盞花', en: 'Calendula', icon: '🌼' },
        ],
      },
    ],
  },
]

const activeKey = ref('cat')
const active = computed(() => pets.find((p) => p.key === activeKey.value))

watch(activeKey, () => {
  photoIdx.value = 0
})

function nextPhoto() {
  const total = active.value?.photos?.length || 1
  photoIdx.value = (photoIdx.value + 1) % total
}
function prevPhoto() {
  const total = active.value?.photos?.length || 1
  photoIdx.value = (photoIdx.value - 1 + total) % total
}
</script>

<template>
  <div>
    <BannerCarousel :banners="slides" kicker="毛孩安全植物" />

    <div class="container pets">
      <header class="pets__head">
        <p class="pets__kicker">MUSEN ㅤPET-SAFE</p>
        <h1>毛孩安全植物</h1>
        <p class="pets__sub">與毛孩共享綠意生活，先從挑對植物開始。選擇你的毛孩，看看哪些花草安全又療癒。</p>
      </header>

      <!-- 寵物分頁 -->
      <nav class="tabs">
        <button
          v-for="p in pets"
          :key="p.key"
          class="tab"
          :class="{ active: activeKey === p.key }"
          @click="activeKey = p.key"
        >
          <span class="tab__emoji">{{ p.emoji }}</span>{{ p.name }}
        </button>
      </nav>

      <!-- 當前寵物 -->
      <article v-if="active" class="panel">
        <!-- 部落格 meta -->
        <div class="blog-meta">
          <div class="blog-tags">
            <span v-for="t in active.tags" :key="t" class="blog-tag">{{ t }}</span>
          </div>
          <span class="blog-date">{{ active.updatedAt }} · 閱讀約 {{ active.readTime }}</span>
        </div>

        <!-- 照片輪播 -->
        <div class="photo-carousel">
          <div class="photo-carousel__frame">
            <div
              v-for="(p, i) in active.photos"
              :key="i"
              class="photo-carousel__slide"
              :class="{ active: photoIdx === i }"
            >
              <img :src="p.url" :alt="p.caption" loading="lazy" />
              <p class="photo-carousel__caption">{{ p.caption }}</p>
            </div>
          </div>
          <button class="photo-carousel__nav prev" aria-label="上一張" @click="prevPhoto">‹</button>
          <button class="photo-carousel__nav next" aria-label="下一張" @click="nextPhoto">›</button>
        </div>

        <!-- 縮圖列 -->
        <div class="photo-thumbs">
          <button
            v-for="(p, i) in active.photos"
            :key="i"
            class="photo-thumb"
            :class="{ active: photoIdx === i }"
            :aria-label="`第 ${i + 1} 張`"
            @click="photoIdx = i"
          >
            <img :src="p.url" :alt="p.caption" loading="lazy" />
          </button>
        </div>

        <!-- 寵物介紹 -->
        <div class="panel__intro">
          <span class="pet-badge">
            <img
              v-if="active.photo && !imgFailed[active.key]"
              :src="active.photo"
              :alt="active.name"
              @error="imgFailed[active.key] = true"
            />
            <span v-else>{{ active.emoji }}</span>
          </span>
          <div>
            <h2>{{ active.name }}<small>{{ active.en }}</small></h2>
            <p class="lede">{{ active.intro }}</p>
          </div>
        </div>

        <!-- 植物群組 -->
        <div v-for="g in active.groups" :key="g.label" class="group">
          <h3 class="group__label">{{ g.label }}</h3>
          <div class="plants">
            <div v-for="(it, i) in g.items" :key="i" class="plant">
              <span class="plant__ic">{{ it.icon }}</span>
              <div class="plant__info">
                <strong>{{ it.zh }}</strong>
                <small>{{ it.en }}</small>
                <em v-if="it.note">{{ it.note }}</em>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- 共同提醒 -->
      <section class="warn">
        <h3>💡 共同的重要提醒</h3>
        <p>
          不論是哪一種寵物，只要牠們有機會接觸或啃咬植物，種植時就<strong>必須全程使用有機土</strong>，並
          <strong>絕對禁止化學殺蟲劑、除草劑或化學肥料</strong>。
        </p>
        <p>
          若是剛從花市買回來的盆栽，建議先在寵物碰不到的地方<strong>隔離養護 1～2 週</strong>，並用清水沖洗葉片，
          以去除表面殘留的農藥。
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pets {
  padding: 2.2rem 1rem 3rem;
  max-width: 960px;
}
.pets__head {
  text-align: center;
  margin-bottom: 1.6rem;
}
.pets__kicker {
  margin: 0 0 0.3rem;
  letter-spacing: 0.3em;
  font-size: 0.76rem;
  color: var(--color-muted);
}
.pets__head h1 {
  margin: 0;
  letter-spacing: 0.08em;
}
.pets__sub {
  margin: 0.7rem auto 0;
  max-width: 560px;
  color: var(--color-muted);
  line-height: 1.8;
}

/* 分頁 */
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1.8rem;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font-size: 0.95rem;
  transition: all 0.18s;
}
.tab:hover {
  border-color: var(--color-primary);
}
.tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.tab__emoji {
  font-size: 1.15rem;
}

/* 部落格 meta */
.blog-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.blog-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.blog-tag {
  font-size: 0.72rem;
  padding: 0.22rem 0.7rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: #fff;
  letter-spacing: 0.04em;
  font-weight: 500;
}
.blog-date {
  font-size: 0.78rem;
  color: var(--color-muted);
  margin-left: auto;
}

/* 照片輪播 */
.photo-carousel {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #d8e4d4;
  margin-bottom: 0.6rem;
  aspect-ratio: 16 / 7;
}
.photo-carousel__frame {
  position: relative;
  width: 100%;
  height: 100%;
}
.photo-carousel__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.65s ease;
  pointer-events: none;
}
.photo-carousel__slide.active {
  opacity: 1;
  pointer-events: auto;
}
.photo-carousel__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.photo-carousel__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.2rem 1.4rem 0.9rem;
  background: linear-gradient(transparent, rgba(20, 30, 20, 0.65));
  color: #fff;
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
  letter-spacing: 0.02em;
}
.photo-carousel__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 1.5rem;
  backdrop-filter: blur(4px);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s;
  line-height: 1;
}
.photo-carousel__nav:hover {
  background: rgba(255, 255, 255, 0.42);
}
.photo-carousel__nav.prev {
  left: 12px;
}
.photo-carousel__nav.next {
  right: 12px;
}

/* 縮圖列 */
.photo-thumbs {
  display: flex;
  gap: 6px;
  margin-bottom: 1.6rem;
}
.photo-thumb {
  flex: 1;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s, opacity 0.2s;
  background: #d8e4d4;
}
.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.62;
  transition: opacity 0.2s;
}
.photo-thumb.active,
.photo-thumb:hover {
  border-color: var(--color-primary);
}
.photo-thumb.active img,
.photo-thumb:hover img {
  opacity: 1;
}

/* 面板 */
.panel__intro {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 16px;
  padding: 1.4rem 1.5rem;
  margin-bottom: 1.8rem;
}
.pet-badge {
  flex: 0 0 auto;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #eef3ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  overflow: hidden;
  box-shadow: 0 0 0 3px rgba(156, 175, 148, 0.45);
}
.pet-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.panel__intro h2 {
  margin: 0 0 0.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}
.panel__intro h2 small {
  font-size: 0.85rem;
  color: var(--color-muted);
  font-weight: 400;
}
.lede {
  margin: 0;
  color: #3e4e3e;
  line-height: 1.9;
  font-size: 1.02rem;
}

.group {
  margin-bottom: 1.6rem;
}
.group__label {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: var(--color-primary);
  border-left: 4px solid var(--color-accent);
  padding-left: 0.6rem;
}
.plants {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.8rem;
}
.plant {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.plant:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}
.plant__ic {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eef3ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.plant__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.plant__info strong {
  line-height: 1.3;
}
.plant__info small {
  color: var(--color-muted);
  font-size: 0.78rem;
}
.plant__info em {
  font-style: normal;
  font-size: 0.76rem;
  color: var(--color-accent);
  margin-top: 0.15rem;
}

/* 共同提醒 */
.warn {
  margin-top: 2rem;
  background: #fff7ec;
  border: 1px solid #f0d8a8;
  border-radius: 14px;
  padding: 1.3rem 1.5rem;
}
.warn h3 {
  margin: 0 0 0.6rem;
  color: #8a5a00;
}
.warn p {
  margin: 0.4rem 0;
  color: #6b5326;
  line-height: 1.9;
}

@media (max-width: 600px) {
  .photo-carousel {
    aspect-ratio: 4 / 3;
  }
  .photo-thumbs {
    gap: 4px;
  }
  .photo-thumb {
    border-radius: 6px;
  }
  .panel__intro {
    flex-direction: column;
    text-align: center;
  }
  .panel__intro h2 {
    justify-content: center;
  }
  .blog-date {
    margin-left: 0;
    width: 100%;
  }
  .photo-carousel__nav {
    display: none;
  }
}
</style>
