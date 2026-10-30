<template>
  <div class="wrapper">
    <!-- Header -->

    <header class="header-wrapper shadow-sm">
      <div class="topbar">
        <!-- Logo -->
        <div class="topbar-logo-header">
          <h4 class="logo-text mb-0 fw-bold">
            <a href="/" class="logo-link text-decoration-none fa-solid fa-cart-shopping fa-bounce">
              LifeTech
            </a>
          </h4>
        </div>

        <!-- Nút mở menu khi thu nhỏ -->
        <i class="fa-solid fa-bars menu-toggle" @click="toggleMenu"></i>

        <!-- Navigation -->
        <nav class="navbar-center" :class="{ open: menuOpen }">
          <ul class="navbar-nav">
            <li>
              <a class="nav-link" href="/"><i class="fa-solid fa-home"></i> Trang chủ</a>
            </li>
            <li>
              <a class="nav-link" href="/web/san-pham"><i class="bx bx-cookie"></i> Sản phẩm</a>
            </li>
            <!-- <li>
              <a class="nav-link" href="/web/bai-viet"><i class="fa-solid fa-file-invoice"></i> Bài viết</a>
            </li> -->
            <li>
              <a class="nav-link" href="/web/lich-su-mua-hang"><i class="fa-solid fa-clock-rotate-left"></i> Lịch sử</a>
            </li>
            <li>
              <a class="nav-link" href="/web/gio-hang"><i class="fa-solid fa-cart-shopping"></i> Giỏ hàng</a>
            </li>
          </ul>
        </nav>

        <!-- User -->
        <div class="user-box dropdown">
          <a class="d-flex align-items-center nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
            style="gap: 10px">
            <img :src="userImage" class="user-img rounded-circle border" alt="user avatar" />
            <div class="user-info text-start">
              <p class="user-name mb-0 fw-bold">
                {{ user.ho_va_ten || "Guest" }}
              </p>
              <small class="text-muted">Khách hàng</small>
            </div>
          </a>

          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li>
              <router-link to="/web/profile" class="dropdown-item"><i class="bx bx-user me-2"></i> Profile</router-link>
            </li>
            <li>
              <router-link to="/users/doi-mat-khau" class="dropdown-item"><i class="fa-solid fa-key"></i> Đổi mật
                khẩu</router-link>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <a class="dropdown-item text-danger" @click="Logout"><i class="bx bx-log-out-circle me-2"></i> Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="page-wrapper">
      <div class="page-content p-4">
        <router-view></router-view>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <!-- Cột 1: Tổng đài hỗ trợ -->
        <div class="footer-col">
          <h5>Tổng đài hỗ trợ</h5>
          <p>
            Gọi mua: <a href="tel:1900232460">1900 232 460</a> (8:00 - 21:30)
          </p>
          <p>Khiếu nại: <a href="tel:18001062">1800 1062</a> (8:00 - 21:30)</p>
          <p>
            Bảo hành: <a href="tel:1900232464">1900 232 464</a> (8:00 - 21:00)
          </p>
        </div>

        <!-- Cột 2: Về công ty -->
        <div class="footer-col">
          <h5>Về công ty</h5>
          <ul>
            <li><a href="#">Giới thiệu SHOP SE397P</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Góp ý & Khiếu nại</a></li>
            <li><a href="#">Tìm cửa hàng</a></li>
          </ul>
        </div>

        <!-- Cột 3: Chính sách -->
        <div class="footer-col">
          <h5>Chính sách & Hỗ trợ</h5>
          <ul>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách giao hàng</a></li>
            <li><a href="#">Bảo mật thông tin</a></li>
          </ul>
        </div>

        <!-- Cột 4: Mạng xã hội -->
        <div class="footer-col">
          <h5>Kết nối với chúng tôi</h5>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-github"></i></a>
          </div>


        </div>
      </div>

      <!-- Dòng cuối -->
      <div class="footer-bottom">
        <p>© 2026 LifeTech | Thiết kế & phát triển bởi nhóm <b>SE397P</b></p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Giữ cố định thanh header khi cuộn */
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  /* đảm bảo luôn nằm trên cùng */
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Tạo khoảng trống để nội dung không bị che bởi header */
.page-wrapper {
  margin-top: 50px;
  /* cao hơn tổng chiều cao header + thanh cảnh báo */
}

.topbar {
  background: #fff;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  /* font-family: "Roboto", sans-serif; */
}

/* Logo */
.logo-link {
  color: #ff7f00 !important;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-decoration: none;
}

.logo-link:hover {
  color: #ff9933 !important;
}

/* Menu chính giữa */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;
  list-style: none;
}

.nav-link {
  color: #000;
  font-weight: 500;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-link:hover {
  background: #ff7f00;
  color: #fff !important;
}

/* Nút 3 gạch */
.menu-toggle {
  display: none;
  font-size: 26px;
  color: #ff7f00;
  cursor: pointer;
}

/* Responsive menu */
@media (max-width: 992px) {
  .navbar-center {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: #fff;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid #ddd;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.3s ease forwards;
  }

  .navbar-center.open {
    display: flex;
  }

  .navbar-nav {
    flex-direction: column;
    gap: 15px;
    padding: 20px 0;
  }

  .menu-toggle {
    display: block;
  }
}

/* Animation trượt mượt */
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🟢 XÓA ĐƯỜNG LINE NGĂN GIỮA LOGO VÀ MENU */
.topbar-logo-header,
.navbar-center {
  border: none !important;
  border-right: none !important;
  border-left: none !important;
  box-shadow: none !important;
}

.header-wrapper,
.topbar {
  box-shadow: none !important;
  border: none !important;
}

.topbar>* {
  border: none !important;
}

.footer {
  background-color: #1a1a1a;
  color: #f5f5f5;
  font-family: "Segoe UI", sans-serif;
  margin-top: 40px;
  padding-top: 40px;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  padding: 0 40px 30px;
}

.footer-col h5 {
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #f97316;
}

.footer-col p,
.footer-col li,
.footer-col a {
  color: #ddd;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s;
}

.footer-col a:hover {
  color: #f97316;
  text-decoration: underline;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 8px;
}

/* Icon mạng xã hội */
.social-links {
  margin-top: 10px;
}

.social-links a {
  display: inline-block;
  margin-right: 10px;
  color: #fff;
  font-size: 22px;
  background-color: #333;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  text-align: center;
  line-height: 36px;
  transition: all 0.3s;
}

.social-links a:hover {
  background-color: #f97316;
  transform: translateY(-2px);
}

/* Logo đối tác */
.partners {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
}

.partners img {
  height: 28px;
  filter: brightness(0) invert(1);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.partners img:hover {
  filter: none;
  opacity: 1;
  transform: scale(1.1);
}

/* Dòng cuối */
.footer-bottom {
  background-color: #111;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #ccc;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom b {
  color: #f97316;
}

@media (max-width: 768px) {
  .footer-container {
    padding: 0 20px 20px;
  }

  .footer-col h5 {
    text-align: center;
  }

  .footer-col {
    text-align: center;
  }

  .partners {
    justify-content: center;
  }
}
</style>

<script>
import "../../assets/js/bootstrap.bundle.min.js";
import "../../assets/js/jquery.min.js";
import "../../assets/plugins/simplebar/js/simplebar.min.js";
import "../../assets/plugins/metismenu/js/metisMenu.min.js";
import "../../assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js";
import "../../assets/plugins/vectormap/jquery-jvectormap-2.0.2.min.js";
import "../../assets/plugins/vectormap/jquery-jvectormap-world-mill-en.js";
import "../../assets/plugins/chartjs/js/Chart.min.js";
import "../../assets/plugins/chartjs/js/Chart.extension.js";
import "../../assets/js/index.js";
import "../../assets/js/app.js";
import "../../assets/js/pace.min.js";
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      menuOpen: false,
    };
  },
  computed: {
    userImage() {
      return this.user.avatar
        ? this.user.avatar
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS_sLYpyeShGPeBAdNVXbZOIBYTN1Vv5qCBQ&s";
    },
  },
  mounted() {
    this.layThongTinLogin();
    const userData = localStorage.getItem("users_data");
    if (userData) this.user = JSON.parse(userData);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    layThongTinLogin() {
      const token = localStorage.getItem("users_login");
      axios
        .get("http://127.0.0.1:8000/api/customer/profile", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status) this.user = res.data.data;
        })
        .catch((err) => console.error("Lỗi tải dữ liệu:", err));
    },
    Logout() {
      const token = localStorage.getItem("users_login");
      axios
        .post(
          "http://127.0.0.1:8000/api/customer/logout",
          {},
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => {
          if (res.data.status) {
            this.$toast.success("Đăng xuất thành công!");
            localStorage.removeItem("users_login");
            localStorage.removeItem("users_data");
            this.user = {};
            this.$router.push("/users/dang-nhap");
          } else {
            this.$toast.error("Đăng xuất thất bại!");
          }
        })
        .catch(() => this.$toast.error("Có lỗi xảy ra, vui lòng thử lại!"));
    },
  },
};
</script>
<style>
@import "../../assets/plugins/vectormap/jquery-jvectormap-2.0.2.css";
@import "../../assets/plugins/simplebar/css/simplebar.css";
@import "../../assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css";
@import "../../assets/plugins/metismenu/css/metisMenu.min.css";
@import "../../assets/css/pace.min.css";
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/bootstrap-extended.css";
@import "../../assets/css/app.css";
@import "../../assets/css/icons.css";
@import "../../assets/css/dark-theme.css";
@import "../../assets/css/semi-dark.css";
@import "../../assets/css/header-colors.css";

@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css");
</style>
