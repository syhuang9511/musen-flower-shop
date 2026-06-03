import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminAuthStore } from '@/stores/adminAuth'

const routes = [
  // ---- 前台 ----
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  {
    path: '/products',
    name: 'product-list',
    component: () => import('@/views/product/ProductListView.vue'),
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/product/ProductDetailView.vue'),
    props: true,
  },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/qa', name: 'qa', component: () => import('@/views/QaView.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
  { path: '/service', name: 'service', component: () => import('@/views/ServiceView.vue') },

  // ---- 會員 ----
  { path: '/login', name: 'login', component: () => import('@/views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('@/views/auth/RegisterView.vue') },
  {
    path: '/auth/:provider/callback',
    name: 'oauth-callback',
    component: () => import('@/views/auth/OAuthCallbackView.vue'),
  },
  {
    path: '/member',
    component: () => import('@/views/member/MemberLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'member-orders', component: () => import('@/views/member/OrdersView.vue') },
      { path: 'addresses', name: 'member-addresses', component: () => import('@/views/member/AddressesView.vue') },
      { path: 'rewards', name: 'member-rewards', component: () => import('@/views/member/RewardsView.vue') },
      { path: 'wishlist', name: 'member-wishlist', component: () => import('@/views/member/WishlistView.vue') },
    ],
  },

  // ---- 後台 ----
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/AdminLoginView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'products', name: 'admin-products', component: () => import('@/views/admin/ProductsView.vue') },
      { path: 'cms', name: 'admin-cms', component: () => import('@/views/admin/CmsView.vue') },
      { path: 'coupons', name: 'admin-coupons', component: () => import('@/views/admin/CouponsView.vue') },
      { path: 'members', name: 'admin-members', component: () => import('@/views/admin/MembersView.vue') },
      { path: 'analytics', name: 'admin-analytics', component: () => import('@/views/admin/AnalyticsView.vue') },
    ],
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
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

export default router
