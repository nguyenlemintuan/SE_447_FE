import { createRouter, createWebHistory } from "vue-router";
import checkAdminLogin from "./checkAdminLogin";
import checkUserLogin from "./checkUserLogin";

const routes = [
  // Trang công khai: ai cũng xem được, không cần đăng nhập
  {
    path: "/",
    component: () => import("../components/web/homepage/index.vue"),
  },
  {
    path: "/web/san-pham",
    component: () => import("../components/web/products/index.vue"),
  },
  {
    path: "/web/chi-tiet-san-pham/:id",
    component: () => import("../components/web/chi_tiet_san_pham/index.vue"),
    props: true,
  },
  {
    path: "/web/so-sanh",
    component: () => import("../components/web/so_sanh/index.vue"),
  },
  {
    path: "/web/goi-y",
    component: () => import("../components/web/goi_y/index.vue"),
  },
  {
    path: "/web/ve-chung-toi",
    component: () => import("../components/web/veChungToi/index.vue"),
  },
  {
    path: "/web/about-us",
    redirect: "/web/ve-chung-toi",
  },
  {
    path: "/web/bai-viet",
    component: () => import("../components/web/veChungToi/index.vue"),
  },
  {
    path: "/web/quen-mat-khau",
    component: () => import("../components/web/quen_mat_khau/index.vue"),
    meta: { layout: "blank" },
  },
  {
    path: "/web/gio-hang",
    component: () => import("../components/web/gio_hang/index.vue"),
  },
  {
    path: "/dat_hang/success",
    component: () => import("../components/web/dat_hang/success.vue"),
  },
  {
    path: "/web/danh-gia",
    redirect: "/web/san-pham",
  },
  {
    path: "/web/danh-gia/:id",
    component: () => import("../components/web/danhGia/index.vue"),
    props: (route) => ({ productId: Number(route.params.id) }),
  },

  // Trang xác thực
  {
    path: "/dang-nhap",
    component: () => import("../components/users/dang_nhap/index.vue"),
    meta: { layout: "blank" },
  },
  {
    path: "/users/dang-nhap",
    redirect: "/dang-nhap",
  },
  {
    path: "/users/dang-ky",
    component: () => import("../components/users/dang_ky/index.vue"),
    meta: { layout: "blank" },
  },
  {
    path: "/users/dang-nhap",
    component: () => import("../components/users/dang_nhap/index.vue"),
    meta: { layout: "blank" },
  },
  {
    path: "/users/doi-mat-khau",
    component: () => import("../components/users/doi_mat_khau/index.vue"),
    meta: { layout: "blank", requiresAuth: true },
  },

  // Trang cần đăng nhập khách hàng
  {
    path: "/web/dat-hang",
    component: () => import("../components/web/dat_hang/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/web/profile",
    component: () => import("../components/web/profile/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/web/lich-su-mua-hang",
    component: () => import("../components/web/lich_su/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/order/:id",
    component: () => import("../components/web/order_detail/index.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/web/theo-doi-don-hang",
    component: () => import("../components/web/theo_doi/index.vue"),
    meta: { requiresAuth: true },
  },

  // Trang quản trị
  {
    path: "/admin/dashboard",
    component: () => import("../components/admin/dashboard/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/products",
    component: () => import("../components/admin/products/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/orders",
    component: () => import("../components/admin/orders/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/addproduct",
    component: () => import("../components/admin/addproduct/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/account",
    component: () => import("../components/admin/account/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/user-account",
    component: () => import("../components/admin/userAccount/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/voucher",
    component: () => import("../components/admin/voucher/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/thong-ke",
    component: () => import("../components/admin/thong_ke/index.vue"),
    meta: { layout: "admin", requiresAdmin: true },
  },
  {
    path: "/admin/dang-nhap",
    redirect: "/dang-nhap",
  },
  {
    path: "/admin/quen-mat-khau",
    component: () => import("../components/admin/quen_mat_khau/index.vue"),
    meta: { layout: "blank" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      // vue-router 4.0 chưa hỗ trợ { el, top } nên tự tính vị trí scroll
      const el = document.querySelector(to.hash);
      if (el) return { top: el.getBoundingClientRect().top + window.scrollY - 96 };
    }
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) return checkAdminLogin(to, from, next);
  if (to.meta.requiresAuth) return checkUserLogin(to, from, next);
  next();
});

export default router;
