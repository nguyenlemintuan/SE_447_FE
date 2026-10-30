<template>
  <div class="admin-wrapper d-flex">

    <!-- SIDEBAR -->
    <aside class="admin-sidebar d-flex flex-column">

      <div class="logo-box">
        <i class="fa-solid fa-cart-shopping me-2"></i>
        <span>LifeTech</span>
      </div>

      <nav class="menu flex-grow-1">

        <div class="menu-title">THỐNG KÊ</div>

        <router-link to="/admin/dashboard" class="menu-item">
          <i class="fa-solid fa-chart-line"></i>
          <span>Doanh thu</span>
        </router-link>

        <router-link to="/admin/thong-ke" class="menu-item">
          <i class="fa-solid fa-user-group"></i>
          <span>Khách hàng</span>
        </router-link>

        <div class="menu-title mt-3">QUẢN LÝ</div>

        <router-link to="/admin/products" class="menu-item">
          <i class="fa-solid fa-box-open"></i>
          <span>Sản phẩm</span>
        </router-link>

        <router-link to="/admin/orders" class="menu-item">
          <i class="fa-solid fa-truck-fast"></i>
          <span>Đơn hàng</span>
        </router-link>

        <router-link to="/admin/voucher" class="menu-item">
          <i class="fa-solid fa-ticket"></i>
          <span>Mã giảm giá</span>
        </router-link>

        <router-link to="/admin/user-account" class="menu-item">
          <i class="fa-solid fa-users"></i>
          <span>User Account</span>
        </router-link>

        <router-link to="/admin/account" class="menu-item">
          <i class="fa-solid fa-user-lock"></i>
          <span>Admin Account</span>
        </router-link>

      </nav>

      <button class="logout-btn" @click="Logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        Đăng xuất
      </button>

    </aside>

    <!-- CONTENT -->
    <main class="admin-content flex-grow-1">
      <router-view />
    </main>

  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    Logout() {
      console.log("Bắt đầu logout...");
      axios
        .post(
          "http://127.0.0.1:8000/api/admin/logout",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("admin_login"),
            },
          }
        )
        .then((res) => {
          console.log("Response từ server:", res.data);
          if (res.data.status) {
            this.$toast.success("Đăng xuất thành công!");
            localStorage.removeItem("admin_login");
            localStorage.removeItem("admin_data");
            this.$router.push("/admin/dang-nhap");
          } else {
            this.$toast.error("Đăng xuất thất bại!");
          }
        })
        .catch((err) => {
          console.error("Lỗi:", err);
          this.$toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        });
    },
  },
};
</script>
<style scoped>
/* ===== BACKGROUND ===== */

.admin-wrapper {
  min-height: 100vh;
  background: #f1f3f7;
}

/* ===== SIDEBAR ===== */

.admin-sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e293b, #0f172a);
  color: #cbd5e1;
  padding: 25px 18px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
}

/* LOGO */

.logo-box {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 35px;
  color: white;
  letter-spacing: 1px;
}

/* MENU TITLE */

.menu-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 18px 8px 6px;
  opacity: .6;
}

/* MENU ITEM */

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
  transition: .25s;
  font-size: 14px;
}

.menu-item:hover {
  background: #334155;
  color: white;
  transform: translateX(4px);
}

.router-link-active {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(99, 102, 241, .4);
}

/* ===== LOGOUT ===== */

.logout-btn {
  border: none;
  background: #111827;
  color: #cbd5e1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  transition: .25s;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

/* ===== CONTENT ===== */

.admin-content {
  padding: 30px;
}

/* CARD */

.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

/* TABLE */

.table {
  border-radius: 12px;
  overflow: hidden;
}

.table thead {
  background: #111827;
  color: white;
}

.table tbody tr:hover {
  background: #f8fafc;
}

/* BUTTON */

.btn-primary {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border: none;
}

.btn-success {
  background: #22c55e;
  border: none;
}

.btn-danger {
  background: #ef4444;
  border: none;
}
</style>