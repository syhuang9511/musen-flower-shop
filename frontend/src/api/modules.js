import http from './http'

/** 商品（前台） */
export const productApi = {
  list: (params) => http.get('/products', { params }),
  detail: (id) => http.get(`/products/${id}`),
  featured: () => http.get('/products/featured'),
}

/** 商品（後台上架管理） */
export const adminProductApi = {
  list: () => http.get('/admin/products'),
  create: (payload) => http.post('/admin/products', payload),
  update: (id, payload) => http.put(`/admin/products/${id}`, payload),
  toggleActive: (id, active) => http.patch(`/admin/products/${id}/active`, null, { params: { active } }),
  toggleFeatured: (id, featured) => http.patch(`/admin/products/${id}/featured`, null, { params: { featured } }),
  remove: (id) => http.delete(`/admin/products/${id}`),
}

/** 認證 / 會員 */
export const authApi = {
  me: () => http.get('/auth/me'),
  loginByEmail: (payload) => http.post('/auth/login', payload),
  oauth: (provider, code) => http.post(`/auth/oauth/${provider}`, { code }),
  sendEmailCode: (email) => http.post('/auth/email/send-code', { email }),
  verifyEmailCode: (payload) => http.post('/auth/email/verify', payload),
  logout: () => http.post('/auth/logout'),
}

/** 會員中心 */
export const memberApi = {
  me: () => http.get('/member/me'),
  updateMe: (payload) => http.put('/member/me', payload),
  addresses: () => http.get('/member/addresses'),
  addAddress: (payload) => http.post('/member/addresses', payload),
  updateAddress: (id, payload) => http.put(`/member/addresses/${id}`, payload),
  deleteAddress: (id) => http.delete(`/member/addresses/${id}`),
  setDefaultAddress: (id) => http.patch(`/member/addresses/${id}/default`),
}

/** 購物車 / 結帳 */
export const cartApi = {
  validateLogistics: (items) => http.post('/cart/logistics-check', { items }),
  checkout: (payload) => http.post('/orders', payload),
}

/** 優惠券 */
export const couponApi = {
  validate: (payload) => http.post('/coupons/validate', payload),
}

/** 收藏 */
export const wishlistApi = {
  list: () => http.get('/wishlist'),
  add: (productId) => http.post('/wishlist', { productId }),
  remove: (productId) => http.delete(`/wishlist/${productId}`),
  merge: (productIds) => http.post('/wishlist/merge', { productIds }),
}

/** 訂單（前台會員） */
export const orderApi = {
  list: () => http.get('/orders'),
  detail: (id) => http.get(`/orders/${id}`),
}

/** 養護 Q&A（前台） */
export const qaApi = {
  categories: () => http.get('/qa/categories'),
  articles: (params) => http.get('/qa/articles', { params }),
  detail: (id) => http.get(`/qa/articles/${id}`),
}

/** 養護 Q&A（後台管理） */
export const adminQaApi = {
  list: () => http.get('/admin/qa'),
  create: (payload) => http.post('/admin/qa', payload),
  update: (id, payload) => http.put(`/admin/qa/${id}`, payload),
  remove: (id) => http.delete(`/admin/qa/${id}`),
}

/** 訂單（後台管理） */
export const adminOrderApi = {
  list: () => http.get('/admin/orders'),
  detail: (id) => http.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => http.patch(`/admin/orders/${id}/status`, { status }),
}
