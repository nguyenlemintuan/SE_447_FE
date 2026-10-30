import { createRouter, createWebHistory } from "vue-router";
import checkAdminLogin from "./checkAdminLogin";
import checkUserLogin from "./checkUserLogin";
import OrderDetail from "../components/web/order_detail/index.vue";
import ProductList from "../components/web/products/index.vue";
import ProductDetail from "../components/web/chi_tiet_san_pham/index.vue";
const routes = [
  {
    path: "/",
    component: () => import("../components/web/homepage/index.vue"),
  },
  {
    path: "/web/san-pham",
    component: () => import("../components/web/products/index.vue"),
    //beforeEnter: checkUserLogin,
  },
  {
    path: "/web/gio-hang",
    component: () => import("../components/web/gio_hang/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/about-us",
    component: () => import("../components/web/about_us/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/ve-chung-toi",
    component: () => import("../components/web/veChungToi/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/chi-tiet-san-pham/:id",
    component: () => import("../components/web/chi_tiet_san_pham/index.vue"),
    beforeEnter: checkUserLogin,
    props: true,
  },
  {
    path: "/web/danh-gia",
    component: () => import("../components/web/danhGia/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/danh-gia/:id", // thêm :id
    component: () => import("../components/web/danhGia/index.vue"),
    props: (route) => ({ productId: Number(route.params.id) }),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/bai-viet",
    component: () => import("../components/web/veChungToi/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/lich-su-mua-hang",
    component: () => import("../components/web/lich_su/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/profile",
    component: () => import("../components/web/profile/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/dat-hang",
    component: () => import("../components/web/dat_hang/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/dat_hang/success",
    component: () => import("../components/web/dat_hang/success.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/web/theo-doi-don-hang",
    component: () => import("../components/web/theo_doi/index.vue"),
    beforeEnter: checkUserLogin,
  },
  {
    path: "/order/:id",
    component: OrderDetail,
    props: true,
  },
  {
    path: "/web/quen-mat-khau",
    component: () => import("../components/web/quen_mat_khau/index.vue"),
    meta: { layout: "blank" },
  },

  // đây là người dùng
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
    meta: { layout: "blank" },
  },
  // đây là admin
  {
    path: "/admin/dashboard",
    component: () => import("../components/admin/dashboard/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/products",
    component: () => import("../components/admin/products/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/orders",
    component: () => import("../components/admin/orders/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/addproduct",
    component: () => import("../components/admin/addproduct/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/account",
    component: () => import("../components/admin/account/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/user-account",
    component: () => import("../components/admin/userAccount/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/voucher",
    component: () => import("../components/admin/voucher/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/thong-ke",
    component: () => import("../components/admin/thong_ke/index.vue"),
    meta: { layout: "admin" },
    beforeEnter: checkAdminLogin,
  },
  {
    path: "/admin/dang-nhap",
    component: () => import("../components/admin/dang_nhap/index.vue"),
    meta: { layout: "blank" },
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
});

export default router;
