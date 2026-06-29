import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminAuthStore } from '@/stores/adminAuth'

/**
 * 包裝 lazy import：當動態 chunk 載入失敗（最常見於重新部署後，
 * 使用者瀏覽器仍持有舊 index.html，去抓已不存在的舊 chunk hash），
 * 自動重新整理一次取得新版本，避免「點分頁白屏、需手動重整」。
 */
function lazy(loader) {
  return () =>
    loader().catch((err) => {
      const KEY = 'chunk-reload-at'
      const last = Number(sessionStorage.getItem(KEY) || 0)
      // 10 秒內只自動重整一次，避免無限迴圈
      if (Date.now() - last > 10000) {
        sessionStorage.setItem(KEY, String(Date.now()))
        window.location.reload()
        return new Promise(() => {}) // 卡住，等待 reload
      }
      throw err
    })
}

const routes = [
  // ---- 前台 ----
  { path: '/', name: 'home', component: lazy(() => import('@/views/HomeView.vue')) },
  {
    path: '/products',
    name: 'product-list',
    component: lazy(() => import('@/views/product/ProductListView.vue')),
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: lazy(() => import('@/views/product/ProductDetailView.vue')),
    props: true,
  },
  { path: '/cart', name: 'cart', component: lazy(() => import('@/views/CartView.vue')) },
  {
    path: '/checkout',
    name: 'checkout',
    component: lazy(() => import('@/views/checkout/CheckoutView.vue')),
    meta: { requiresAuth: true },
  },
  { path: '/qa', name: 'qa', component: lazy(() => import('@/views/QaView.vue')) },
  {
    path: '/qa/:id',
    name: 'qa-detail',
    component: lazy(() => import('@/views/QaDetailView.vue')),
    props: true,
  },
  { path: '/pet-safe', name: 'pet-safe', component: lazy(() => import('@/views/PetSafeView.vue')) },
  { path: '/events', name: 'events', component: lazy(() => import('@/views/EventsView.vue')) },
  { path: '/contact', name: 'contact', component: lazy(() => import('@/views/ContactView.vue')) },
  { path: '/service', name: 'service', component: lazy(() => import('@/views/ServiceView.vue')) },
  { path: '/return-policy', name: 'return-policy', component: lazy(() => import('@/views/ReturnPolicyView.vue')) },

  // ---- 會員 ----
  { path: '/login', name: 'login', component: lazy(() => import('@/views/auth/LoginView.vue')) },
  { path: '/register', name: 'register', component: lazy(() => import('@/views/auth/RegisterView.vue')) },
  {
    path: '/auth/:provider/callback',
    name: 'oauth-callback',
    component: lazy(() => import('@/views/auth/OAuthCallbackView.vue')),
  },
  {
    path: '/member',
    component: lazy(() => import('@/views/member/MemberLayout.vue')),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'member-orders', component: lazy(() => import('@/views/member/OrdersView.vue')) },
      { path: 'addresses', name: 'member-addresses', component: lazy(() => import('@/views/member/AddressesView.vue')) },
      { path: 'rewards', name: 'member-rewards', component: lazy(() => import('@/views/member/RewardsView.vue')) },
      { path: 'wishlist', name: 'member-wishlist', component: lazy(() => import('@/views/member/WishlistView.vue')) },
    ],
  },

  // ---- 後台 ----
  {
    path: '/admin/login',
    name: 'admin-login',
    component: lazy(() => import('@/views/admin/AdminLoginView.vue')),
  },
  {
    path: '/admin',
    component: lazy(() => import('@/views/admin/AdminLayout.vue')),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin-dashboard', component: lazy(() => import('@/views/admin/DashboardView.vue')) },
      { path: 'orders', name: 'admin-orders', component: lazy(() => import('@/views/admin/OrdersView.vue')) },
      { path: 'products', name: 'admin-products', component: lazy(() => import('@/views/admin/ProductsView.vue')) },
      { path: 'banners', name: 'admin-banners', component: lazy(() => import('@/views/admin/BannersView.vue')) },
      { path: 'cms', name: 'admin-cms', component: lazy(() => import('@/views/admin/CmsView.vue')) },
      { path: 'comments', name: 'admin-comments', component: lazy(() => import('@/views/admin/QaCommentsView.vue')) },
      { path: 'coupons', name: 'admin-coupons', component: lazy(() => import('@/views/admin/CouponsView.vue')) },
      { path: 'members', name: 'admin-members', component: lazy(() => import('@/views/admin/MembersView.vue')) },
      { path: 'analytics', name: 'admin-analytics', component: lazy(() => import('@/views/admin/AnalyticsView.vue')) },
    ],
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: lazy(() => import('@/views/NotFoundView.vue')) },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// 會員區（非後台）暫以 DEMO 放行，待後端 JWT 串接後改為 false。
// 後台則一律需要管理員登入。
const DEMO_BYPASS_MEMBER = true

router.beforeEach((to) => {
  // 後台：必須管理員登入
  if (to.meta.requiresAdmin) {
    const admin = useAdminAuthStore()
    if (!admin.isLoggedIn) {
      return { name: 'admin-login', query: { redirect: to.fullPath } }
    }
    return
  }

  // 一般會員區
  if (to.meta.requiresAuth && !DEMO_BYPASS_MEMBER) {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
})

// 導航成功後清除 chunk 重整旗標
router.afterEach(() => {
  sessionStorage.removeItem('chunk-reload-at')
})

// 雙保險：路由層級的動態載入錯誤也觸發重整一次
router.onError((err) => {
  const msg = err?.message || ''
  if (/dynamically imported module|Importing a module script failed|Failed to fetch/i.test(msg)) {
    const KEY = 'chunk-reload-at'
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last > 10000) {
      sessionStorage.setItem(KEY, String(Date.now()))
      window.location.reload()
    }
  }
})

export default router
