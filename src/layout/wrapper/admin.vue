<template>
  <div class="admin-wrapper d-flex">

    <!-- SIDEBAR -->
    <aside class="admin-sidebar d-flex flex-column">

      <div class="logo-box">
        <div class="logo-icon-wrap">
          <img :src="logoMark" alt="Logo LifeTech" />
        </div>
        <div class="logo-text">
          <span class="logo-name">Life<span class="logo-accent">Tech</span></span>
          <span class="logo-badge">Admin Suite</span>
        </div>
      </div>

      <nav class="menu flex-grow-1">

        <div class="menu-title">BÁO CÁO &amp; THỐNG KÊ</div>

        <router-link to="/admin/dashboard" class="menu-item">
          <i class="bx bx-bar-chart-alt-2"></i>
          <span>Tổng quan doanh thu</span>
        </router-link>

        <router-link to="/admin/thong-ke" class="menu-item">
          <i class="bx bx-user-pin"></i>
          <span>Thống kê khách hàng</span>
        </router-link>

        <div class="menu-title mt-4">QUẢN TRỊ HỆ THỐNG</div>

        <router-link to="/admin/products" class="menu-item">
          <i class="bx bx-box"></i>
          <span>Quản lý sản phẩm</span>
        </router-link>

        <router-link to="/admin/orders" class="menu-item">
          <i class="bx bx-receipt"></i>
          <span>Quản lý đơn hàng</span>
        </router-link>

        <router-link to="/admin/voucher" class="menu-item">
          <i class="bx bx-purchase-tag-alt"></i>
          <span>Mã giảm giá (Voucher)</span>
        </router-link>

        <div class="menu-title mt-4">TÀI KHOẢN &amp; BẢO MẬT</div>

        <router-link to="/admin/user-account" class="menu-item">
          <i class="bx bx-group"></i>
          <span>Khách hàng thành viên</span>
        </router-link>

        <router-link to="/admin/account" class="menu-item">
          <i class="bx bx-shield-quarter"></i>
          <span>Tài khoản Quản trị</span>
        </router-link>

      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="Logout">
          <i class="bx bx-log-out-circle"></i>
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>

    </aside>

    <!-- MAIN BODY -->
    <div class="admin-main-wrap flex-grow-1 d-flex flex-column">

      <!-- TOP NAVBAR -->
      <header class="admin-topbar d-flex align-items-center justify-content-between px-4 py-3">
        <div class="topbar-search">
          <i class="bx bx-search"></i>
          <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, sản phẩm, khách hàng..." />
        </div>
        <div class="topbar-actions d-flex align-items-center gap-3">
          <router-link to="/" class="topbar-store-btn" target="_blank" title="Xem cửa hàng">
            <i class="bx bx-store-alt"></i>
            <span>Xem Storefront</span>
          </router-link>
          <div class="topbar-user d-flex align-items-center gap-2">
            <span class="topbar-avatar">A</span>
            <div class="topbar-user-info d-none d-md-flex flex-column">
              <strong class="user-name">Quản trị viên</strong>
              <small class="user-role">Super Admin</small>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT VIEW -->
      <main class="admin-content flex-grow-1">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script>
import axios from "axios";
import logoMark from "../../assets/img/logo.svg";

export default {
  data() {
    return { logoMark };
  },
  methods: {
    Logout() {
      axios
        .get("http://127.0.0.1:8000/api/admin/logout", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token_admin"),
          },
        })
        .then(() => {
          localStorage.removeItem("token_admin");
          this.$router.push("/admin/dang-nhap");
        })
        .catch(() => {
          localStorage.removeItem("token_admin");
          this.$router.push("/admin/dang-nhap");
        });
    },
  },
};
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  font-family: var(--lt-font, "Be Vietnam Pro", system-ui, sans-serif);
}

/* SIDEBAR */
.admin-sidebar {
  width: 270px;
  background: #0f172a;
  color: #94a3b8;
  padding: 24px 18px 20px;
  border-right: 1px solid #1e293b;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

/* LOGO */
.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding: 6px 8px;
}

.logo-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.logo-icon-wrap img {
  width: 26px;
  height: 26px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-size: 19px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.logo-accent {
  color: #f97316;
}

.logo-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-top: 2px;
}

/* MENU TITLE */
.menu-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #475569;
  padding: 0 12px;
  margin-bottom: 8px;
}

/* MENU ITEM */
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  transition: all 180ms ease;
  margin-bottom: 3px;
}

.menu-item i {
  font-size: 19px;
  color: #64748b;
  transition: color 180ms ease;
}

.menu-item:hover {
  background: #1e293b;
  color: #f1f5f9;
}

.menu-item:hover i {
  color: #f1f5f9;
}

.router-link-active {
  background: #f97316 !important;
  color: #fff !important;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3) !important;
}

.router-link-active i {
  color: #fff !important;
}

/* SIDEBAR FOOTER & LOGOUT */
.sidebar-footer {
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid #1e293b;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 180ms ease;
}

.logout-btn i {
  font-size: 18px;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: #ef4444;
  color: #fca5a5;
}

/* MAIN WRAP & TOPBAR */
.admin-main-wrap {
  overflow-x: hidden;
  min-width: 0;
}

.admin-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  min-height: 68px;
  position: sticky;
  top: 0;
  z-index: 20;
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 7px 14px;
  width: 380px;
  max-width: 100%;
  transition: all 180ms ease;
}

.topbar-search:focus-within {
  background: #fff;
  border-color: #cbd5e1;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05);
}

.topbar-search i {
  font-size: 18px;
  color: #94a3b8;
}

.topbar-search input {
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  font-size: 13.5px;
  color: #0f172a;
}

.topbar-store-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #e2e8f0;
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  background: #f8fafc;
  transition: all 180ms ease;
}

.topbar-store-btn:hover {
  color: #0f172a;
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.topbar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #64748b;
}

/* CONTENT CONTAINER */
.admin-content {
  padding: 32px 40px;
  background: #f8fafc;
}

@media (max-width: 992px) {
  .admin-sidebar {
    width: 74px;
    padding: 18px 10px;
  }

  .logo-text,
  .menu-title,
  .menu-item span,
  .logout-btn span {
    display: none;
  }

  .logo-box,
  .menu-item,
  .logout-btn {
    justify-content: center;
    padding-inline: 0;
  }

  .admin-content {
    padding: 20px 18px;
  }

  .topbar-search {
    width: 240px;
  }
}
</style>
