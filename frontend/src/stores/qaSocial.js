import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

/**
 * 植栽養護文章的「社群互動」store：點讚 + 會員留言 + 管理員回覆。
 *
 * 資料分三份存於 LocalStorage：
 *  - likes  : { [articleId]: 累計讚數 }
 *  - liked  : [articleId]    ← 此瀏覽器已按讚的文章（用來切換/防止重複）
 *  - comments: 留言陣列，每筆含管理員回覆陣列
 *
 * ⚠️ 留言作者目前取自前台會員登入狀態（auth store）。後端會員 JWT 串接後，
 *    新留言會自動帶入真實會員；管理員回覆則取自後台登入（adminAuth）。
 *    此處的 SEED 為示範資料，方便在後端就緒前展示前台留言與後台管理。
 */
const LIKES_KEY = 'floral_qa_likes'
const LIKED_KEY = 'floral_qa_liked'
const COMMENTS_KEY = 'floral_qa_comments'

// 示範會員留言（articleId 對應 qaAdmin 的 SEED：1=澆水 2=光照 3=施肥 4=大型植栽）
const SEED_COMMENTS = [
  {
    id: 1,
    articleId: 1,
    author: '宜蓁',
    body: '原來手指插進去兩個指節是這樣判斷的！之前都用猜的，難怪我的黃金葛一直爛根 🥲',
    createdAt: '2026-05-28T10:12:00',
    replies: [
      {
        id: 1,
        adminUsername: 'yun',
        adminName: '小花',
        body: '是的～寧可乾一點也不要積水喔！爛根通常都是澆太多造成的。下次澆完記得把底盤的水倒掉 🌿',
        createdAt: '2026-05-28T14:30:00',
      },
    ],
  },
  {
    id: 2,
    articleId: 1,
    author: 'Kevin',
    body: '請問多肉冬天也是一樣等完全乾才澆嗎？',
    createdAt: '2026-05-30T09:05:00',
    replies: [],
  },
  {
    id: 3,
    articleId: 2,
    author: '小敏',
    body: '我家只有北面窗戶，這樣算明亮散射光嗎？擔心光線不夠 😣',
    createdAt: '2026-06-01T20:41:00',
    replies: [
      {
        id: 2,
        adminUsername: 'admin',
        adminName: '大明',
        body: '北面窗通常光線穩定柔和，很適合大多數觀葉植物！如果葉色變淡或徒長，再考慮補一盞植物燈就好。',
        createdAt: '2026-06-02T08:15:00',
      },
    ],
  },
]

export const useQaSocialStore = defineStore('qaSocial', () => {
  const likes = ref(loadJson(LIKES_KEY, {}))
  const likedIds = ref(loadJson(LIKED_KEY, []))
  const comments = ref(loadComments())

  function loadJson(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || 'null')
      return v ?? fallback
    } catch {
      return fallback
    }
  }

  function loadComments() {
    try {
      const saved = JSON.parse(localStorage.getItem(COMMENTS_KEY) || 'null')
      if (Array.isArray(saved)) return saved
    } catch {
      /* ignore */
    }
    return SEED_COMMENTS
  }

  watch(likes, (v) => localStorage.setItem(LIKES_KEY, JSON.stringify(v)), { deep: true })
  watch(likedIds, (v) => localStorage.setItem(LIKED_KEY, JSON.stringify(v)), { deep: true })
  watch(comments, (v) => localStorage.setItem(COMMENTS_KEY, JSON.stringify(v)), { deep: true })

  // ---- 點讚 ----
  function likeCount(articleId) {
    return likes.value[articleId] || 0
  }
  function hasLiked(articleId) {
    return likedIds.value.includes(articleId)
  }
  function toggleLike(articleId) {
    if (hasLiked(articleId)) {
      likes.value[articleId] = Math.max(0, likeCount(articleId) - 1)
      likedIds.value = likedIds.value.filter((id) => id !== articleId)
    } else {
      likes.value[articleId] = likeCount(articleId) + 1
      likedIds.value = [...likedIds.value, articleId]
    }
  }

  // ---- 留言 ----
  function commentsFor(articleId) {
    return comments.value
      .filter((c) => c.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  function commentCount(articleId) {
    return comments.value.filter((c) => c.articleId === articleId).length
  }
  function nextCommentId() {
    return comments.value.reduce((max, c) => Math.max(max, c.id), 0) + 1
  }
  function addComment(articleId, author, body) {
    const text = (body || '').trim()
    if (!text) return
    comments.value = [
      ...comments.value,
      {
        id: nextCommentId(),
        articleId,
        author: author || '匿名會員',
        body: text,
        createdAt: new Date().toISOString(),
        replies: [],
      },
    ]
  }
  function removeComment(commentId) {
    comments.value = comments.value.filter((c) => c.id !== commentId)
  }

  // ---- 管理員回覆 ----
  function nextReplyId() {
    return (
      comments.value.reduce(
        (max, c) => Math.max(max, ...c.replies.map((r) => r.id), 0),
        0,
      ) + 1
    )
  }
  function addReply(commentId, admin, body) {
    const text = (body || '').trim()
    if (!text) return
    const c = comments.value.find((x) => x.id === commentId)
    if (!c) return
    c.replies.push({
      id: nextReplyId(),
      adminUsername: admin?.username || '',
      adminName: admin?.name || '管理員',
      body: text,
      createdAt: new Date().toISOString(),
    })
  }
  function removeReply(commentId, replyId) {
    const c = comments.value.find((x) => x.id === commentId)
    if (c) c.replies = c.replies.filter((r) => r.id !== replyId)
  }

  // 後台用：全部留言（新到舊）
  const allComments = computed(() =>
    [...comments.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  )

  function resetToSeed() {
    localStorage.removeItem(COMMENTS_KEY)
    comments.value = SEED_COMMENTS
  }

  return {
    likes,
    comments,
    allComments,
    likeCount,
    hasLiked,
    toggleLike,
    commentsFor,
    commentCount,
    addComment,
    removeComment,
    addReply,
    removeReply,
    resetToSeed,
  }
})
