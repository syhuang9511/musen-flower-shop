<script setup>
import { computed, ref } from 'vue'
import BannerCarousel from '@/components/ui/BannerCarousel.vue'

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
]

const pets = [
  {
    key: 'cat',
    name: '貓咪',
    en: 'Cats',
    emoji: '🐱',
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
      <section v-if="active" class="panel">
        <div class="panel__intro">
          <span class="pet-badge">{{ active.emoji }}</span>
          <div>
            <h2>{{ active.name }}<small>{{ active.en }}</small></h2>
            <p>{{ active.intro }}</p>
          </div>
        </div>

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
      </section>

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

/* 面板 */
.panel__intro {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 16px;
  padding: 1.4rem 1.5rem;
  margin-bottom: 1.6rem;
}
.pet-badge {
  flex: 0 0 auto;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #eef3ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  box-shadow: inset 0 0 0 3px rgba(156, 175, 148, 0.4);
}
.panel__intro h2 {
  margin: 0 0 0.4rem;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}
.panel__intro h2 small {
  font-size: 0.85rem;
  color: var(--color-muted);
  font-weight: 400;
}
.panel__intro p {
  margin: 0;
  color: #4a514a;
  line-height: 1.8;
}

.group {
  margin-bottom: 1.5rem;
}
.group__label {
  margin: 0 0 0.7rem;
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
  .panel__intro {
    flex-direction: column;
    text-align: center;
  }
  .panel__intro h2 {
    justify-content: center;
  }
}
</style>
