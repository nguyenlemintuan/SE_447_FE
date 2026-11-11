<template>
  <div class="sf-app">
    <!-- Header -->
    <header class="sf-header">
      <div class="lt-container sf-header-main">
        <router-link to="/" class="sf-brand" @click="menuOpen = false">
          <img class="sf-brand-mark" :src="logoMark" alt="Logo LifeTech" />
          <span class="sf-brand-text">
            <span class="sf-brand-line">Life<span class="sf-brand-accent">Tech</span></span>
            <small>Công nghệ chính hãng</small>
          </span>
        </router-link>

        <form class="sf-search" @submit.prevent="submitSearch">
          <i class="bx bx-search"></i>
          <input v-model="searchTerm" type="search" placeholder="Bạn muốn tìm sản phẩm gì?" aria-label="Tìm kiếm sản phẩm" />
          <button type="submit">Tìm kiếm</button>
        </form>

        <div class="sf-actions">
          <router-link v-if="loggedIn" to="/web/lich-su-mua-hang" class="sf-action" title="Đơn hàng của tôi">
            <span class="sf-action-icon"><i class="fa-solid fa-clock-rotate-left"></i></span>
            <span class="sf-action-text"><small>Theo dõi</small><strong>Đơn hàng</strong></span>
          </router-link>

          <div v-if="loggedIn" class="dropdown sf-user">
            <a class="sf-user-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="userImage" class="sf-avatar" alt="Ảnh đại diện" />
              <span class="sf-user-name">
                <small>Xin chào</small>
                <strong>{{ user.ho_va_ten || "Khách" }}</strong>
              </span>
              <i class="bx bx-chevron-down sf-user-caret"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end sf-dropdown">
              <li class="sf-dropdown-head">
                <span class="sf-avatar sf-avatar-lg">{{ initials }}</span>
                <div>
                  <strong>{{ user.ho_va_ten || "Khách hàng" }}</strong>
                  <small>{{ user.email }}</small>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link to="/web/profile" class="dropdown-item">
                  <i class="bx bx-user"></i> Hồ sơ của tôi
                </router-link>
              </li>
              <li>
                <router-link to="/web/lich-su-mua-hang" class="dropdown-item">
                  <i class="bx bx-receipt"></i> Lịch sử mua hàng
                </router-link>
              </li>
              <li>
                <router-link to="/users/doi-mat-khau" class="dropdown-item">
                  <i class="bx bx-lock-alt"></i> Đổi mật khẩu
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item is-danger" href="#" @click.prevent="Logout">
                  <i class="bx bx-log-out-circle"></i> Đăng xuất
                </a>
              </li>
            </ul>
          </div>

          <div v-else class="sf-auth">
            <router-link to="/dang-nhap" class="sf-auth-login">Đăng nhập</router-link>
            <router-link to="/users/dang-ky" class="sf-auth-register">Đăng ký</router-link>
          </div>

          <button class="sf-menu-btn" type="button" aria-label="Mở menu" @click="menuOpen = !menuOpen">
            <i :class="menuOpen ? 'bx bx-x' : 'bx bx-menu'"></i>
          </button>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sf-nav" :class="{ 'is-open': menuOpen }">
        <div class="lt-container sf-nav-inner">
          <router-link to="/" class="sf-nav-link" :class="{ active: isActive('/') }" @click="menuOpen = false">
            <i class="bx bx-home-alt"></i> Trang chủ
          </router-link>
          <router-link to="/web/san-pham" class="sf-nav-link" :class="{ active: isActive('/web/san-pham') }"
            @click="menuOpen = false">
            <i class="bx bx-grid-alt"></i> Sản phẩm
          </router-link>
          <router-link to="/web/so-sanh" class="sf-nav-link" :class="{ active: isActive('/web/so-sanh') }"
            @click="menuOpen = false">
            <i class="bx bx-git-compare"></i> So sánh AI
          </router-link>
          <router-link to="/web/goi-y" class="sf-nav-link" :class="{ active: isActive('/web/goi-y') }"
            @click="menuOpen = false">
            <i class="bx bx-bulb"></i> Gợi ý AI
          </router-link>
          <router-link to="/web/ve-chung-toi" class="sf-nav-link" :class="{ active: isActive('/web/ve-chung-toi') }"
            @click="menuOpen = false">
            <i class="bx bx-store-alt"></i> Về chúng tôi
          </router-link>
          <router-link v-if="loggedIn" to="/web/lich-su-mua-hang" class="sf-nav-link"
            :class="{ active: isActive('/web/lich-su-mua-hang') }" @click="menuOpen = false">
            <i class="bx bx-receipt"></i> Đơn hàng
          </router-link>

          <span class="sf-spacer"></span>

          <router-link to="/web/gio-hang" class="sf-nav-highlight" @click="menuOpen = false">
            <i class="bx bxs-cart-alt"></i> Giỏ hàng của bạn
            <b v-if="cartCount > 0" class="sf-cart-count">{{ cartCount }}</b>
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Content -->
    <main class="sf-main">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="sf-footer">
      <div class="lt-container">
        <div class="sf-footer-top">
          <div class="sf-footer-brand">
            <router-link to="/" class="sf-brand sf-brand-light">
              <img class="sf-brand-mark" :src="logoMark" alt="Logo LifeTech" />
              <span class="sf-brand-text">
                <span class="sf-brand-line">Life<span class="sf-brand-accent">Tech</span></span>
                <small>Công nghệ chính hãng</small>
              </span>
            </router-link>
            <p>
              LifeTech mang đến điện thoại, laptop và thiết bị công nghệ chính hãng
              với giá tốt, bảo hành minh bạch và trải nghiệm mua sắm đơn giản.
            </p>
            <div class="sf-socials">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
              <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
            </div>
          </div>

          <div class="sf-footer-col">
            <h4>Hỗ trợ khách hàng</h4>
            <p>Gọi mua: <a href="tel:1900232460">1900 232 460</a> (8:00 – 21:30)</p>
            <p>Khiếu nại: <a href="tel:18001062">1800 1062</a> (8:00 – 21:30)</p>
            <p>Bảo hành: <a href="tel:1900232464">1900 232 464</a> (8:00 – 21:00)</p>
            <p>Email: <a href="mailto:support@lifetech.vn">support@lifetech.vn</a></p>
          </div>

          <div class="sf-footer-col">
            <h4>Về LifeTech</h4>
            <router-link to="/web/ve-chung-toi">Giới thiệu công ty</router-link>
            <router-link to="/web/ve-chung-toi#doi-ngu">Đội ngũ &amp; giá trị</router-link>
            <router-link to="/web/san-pham">Sản phẩm</router-link>
            <router-link to="/web/so-sanh">So sánh bằng AI</router-link>
            <router-link to="/web/goi-y">Gợi ý theo nhu cầu</router-link>
            <router-link to="/web/lich-su-mua-hang">Tra cứu đơn hàng</router-link>
          </div>

          <div class="sf-footer-col">
            <h4>Chính sách</h4>
            <a href="#">Chính sách bảo hành</a>
            <a href="#">Chính sách đổi trả</a>
            <a href="#">Chính sách giao hàng</a>
            <a href="#">Bảo mật thông tin</a>
          </div>

          <div class="sf-footer-col sf-footer-news">
            <h4>Nhận ưu đãi mới</h4>
            <p>Đăng ký email để nhận khuyến mãi và sản phẩm mới sớm nhất.</p>
            <form class="sf-newsletter" @submit.prevent="subscribeNewsletter">
              <input v-model="newsletterEmail" type="email" required placeholder="Email của bạn" aria-label="Email" />
              <button type="submit" aria-label="Đăng ký"><i class="bx bx-paper-plane"></i></button>
            </form>
            <small class="sf-news-note">Chúng tôi tôn trọng quyền riêng tư của bạn.</small>
          </div>
        </div>

        <div class="sf-footer-bottom">
          <p>© 2026 LifeTech. Thiết kế &amp; phát triển bởi <b>Group 11 SE447 E</b>.</p>
          <div class="sf-payments">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>MoMo</span>
            <span>VNPay</span>
          </div>
        </div>
      </div>
    </footer>

    <ChatBox />
  </div>
</template>

<script>
import "../../assets/js/bootstrap.bundle.min.js";
import axios from "axios";
import ChatBox from "../../components/chat/ChatBox.vue";
import logoMark from "../../assets/img/logo.svg";

const FALLBACK_AVATAR =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23fff3e8'/%3E%3Ccircle cx='48' cy='38' r='17' fill='%23f97316'/%3E%3Cpath d='M18 84c3-16 15-25 30-25s27 9 30 25z' fill='%23f97316'/%3E%3C/svg%3E";

export default {
  components: { ChatBox },
  data() {
    return {
      logoMark,
      user: {},
      loggedIn: false,
      menuOpen: false,
      searchTerm: "",
      cartCount: 0,
      newsletterEmail: "",
    };
  },
  computed: {
    userImage() {
      return this.user.avatar || FALLBACK_AVATAR;
    },
    initials() {
      const name = (this.user.ho_va_ten || "K").trim();
      return name
        .split(/\s+/)
        .slice(-2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    },
  },
  mounted() {
    const userData = localStorage.getItem("users_data");
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (error) {
        console.error("Dữ liệu người dùng không hợp lệ:", error);
      }
    }
    this.layThongTinLogin();
    this.loadCartCount();
    window.addEventListener("cart:updated", this.loadCartCount);
    window.addEventListener("user:updated", this.layThongTinLogin);
  },
  beforeUnmount() {
    window.removeEventListener("cart:updated", this.loadCartCount);
    window.removeEventListener("user:updated", this.layThongTinLogin);
  },
  methods: {
    isActive(path) {
      if (path === "/") return this.$route.path === "/";
      return this.$route.path.startsWith(path);
    },
    submitSearch() {
      const query = this.searchTerm.trim();
      this.menuOpen = false;
      this.$router.push({
        path: "/web/san-pham",
        query: query ? { q: query } : {},
      });
    },
    loadCartCount() {
      const token = localStorage.getItem("users_login");
      if (!token) {
        this.cartCount = 0;
        return;
      }
      axios
        .get("http://127.0.0.1:8000/api/customer/gio-hang/data", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          const items = res.data?.data || [];
          this.cartCount = items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
          );
        })
        .catch(() => {
          this.cartCount = 0;
        });
    },
    layThongTinLogin() {
      const token = localStorage.getItem("users_login");
      this.loggedIn = !!token;
      if (!token) return;
      axios
        .get("http://127.0.0.1:8000/api/customer/profile", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status) {
            this.user = res.data.data;
            localStorage.setItem("users_data", JSON.stringify(res.data.data));
          }
        })
        .catch((err) => console.error("Lỗi tải dữ liệu:", err));
    },
    Logout() {
      const token = localStorage.getItem("users_login");
      axios
        .post(
          "http://127.0.0.1:8000/api/customer/logout",
          {},
          { headers: { Authorization: "Bearer " + token } }
        )
        .catch(() => {})
        .finally(() => {
          localStorage.removeItem("users_login");
          localStorage.removeItem("users_data");
          localStorage.removeItem("checkoutData");
          this.user = {};
          this.loggedIn = false;
          this.cartCount = 0;
          this.$toast.success("Đăng xuất thành công!");
          this.$router.push("/dang-nhap");
        });
    },
    subscribeNewsletter() {
      this.$toast.success("Đăng ký nhận tin thành công!");
      this.newsletterEmail = "";
    },
  },
};
</script>

<style scoped>
/* ================= HEADER ================= */
.sf-header {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--lt-line);
}

.sf-header-main {
  display: flex;
  align-items: center;
  gap: 26px;
  min-height: 72px;
}

.sf-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}

.sf-brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.3);
}

.sf-brand-text {
  display: flex;
  flex-direction: column;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--lt-ink);
  white-space: nowrap;
}

.sf-brand-line {
  display: inline-flex;
}

.sf-brand-accent {
  color: var(--lt-orange);
}

.sf-brand-text small {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lt-muted);
  margin-top: 3px;
}

.sf-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 560px;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 5px 5px 5px 18px;
  transition: all var(--lt-transition);
}

.sf-search:focus-within {
  background: #fff;
  border-color: var(--lt-orange-line);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.sf-search i {
  color: var(--lt-muted);
  font-size: 19px;
}

.sf-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: var(--lt-font);
  font-size: 14px;
  color: var(--lt-ink);
}

.sf-search button {
  border: 0;
  border-radius: 999px;
  background: var(--lt-ink);
  color: #fff;
  font-family: var(--lt-font);
  font-size: 13px;
  font-weight: 600;
  padding: 9px 18px;
  cursor: pointer;
  transition: background var(--lt-transition);
}

.sf-search button:hover {
  background: var(--lt-orange);
}

.sf-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.sf-action {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 12px;
  color: var(--lt-ink);
  transition: background var(--lt-transition);
}

.sf-action:hover {
  background: #f1f5f9;
  color: var(--lt-ink);
}

.sf-action:hover .sf-action-icon {
  color: var(--lt-orange-dark);
}

.sf-action-icon {
  position: relative;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 17px;
}

.sf-cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--lt-danger);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.sf-action-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.sf-action-text small {
  font-size: 11px;
  color: var(--lt-muted);
}

.sf-action-text strong {
  font-size: 13px;
  font-weight: 600;
}

.sf-auth {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.sf-auth a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 16px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  transition: all var(--lt-transition);
}

.sf-auth-login {
  color: var(--lt-ink);
  background: var(--lt-surface);
  border: 1.5px solid var(--lt-line);
}

.sf-auth-login:hover {
  color: var(--lt-orange);
  background: var(--lt-orange-soft);
  border-color: var(--lt-orange-line);
}

.sf-auth-register {
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  border: 1.5px solid transparent;
  box-shadow: 0 6px 14px rgba(249, 115, 22, 0.28);
}

.sf-auth-register:hover {
  color: #fff;
  background: linear-gradient(135deg, var(--lt-orange), var(--lt-orange-dark));
}

.sf-user-toggle {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 5px 8px 5px 5px;
  border-radius: 999px;
  color: var(--lt-ink);
  transition: background var(--lt-transition);
}

.sf-user-toggle:hover {
  background: #f1f5f9;
  color: var(--lt-ink);
}

.sf-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px var(--lt-line);
  background: var(--lt-orange-soft);
}

.sf-avatar-lg {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--lt-orange-dark);
}

.sf-user-name {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.sf-user-name small {
  font-size: 11px;
  color: var(--lt-muted);
}

.sf-user-name strong {
  font-size: 13px;
  max-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sf-user-caret {
  color: var(--lt-muted);
  font-size: 15px;
}

.sf-dropdown {
  border: 1px solid var(--lt-line);
  border-radius: 14px;
  box-shadow: var(--lt-shadow-lg);
  padding: 8px;
  min-width: 250px;
  margin-top: 12px !important;
}

.sf-dropdown-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 10px;
}

.sf-dropdown-head strong,
.sf-dropdown-head small {
  display: block;
}

.sf-dropdown-head strong {
  font-size: 13.5px;
}

.sf-dropdown-head small {
  font-size: 12px;
  color: var(--lt-muted);
}

.sf-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 9px;
  padding: 9px 11px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--lt-ink-soft);
}

.sf-dropdown .dropdown-item i {
  font-size: 16px;
}

.sf-dropdown .dropdown-item:hover {
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
}

.sf-dropdown .dropdown-item.is-danger {
  color: var(--lt-danger);
}

.sf-dropdown .dropdown-item.is-danger:hover {
  background: var(--lt-danger-soft);
  color: var(--lt-danger);
}

.sf-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--lt-line);
  border-radius: 11px;
  background: #fff;
  color: var(--lt-ink);
  font-size: 22px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ================= NAV ================= */
.sf-nav {
  border-top: 1px solid #f1f5f9;
}

.sf-nav-inner {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
}

.sf-nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 13px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lt-ink-soft);
  border-bottom: 2px solid transparent;
  transition: color var(--lt-transition), border-color var(--lt-transition);
}

.sf-nav-link i {
  font-size: 16px;
}

.sf-nav-link:hover {
  color: var(--lt-orange-dark);
  border-bottom-color: var(--lt-orange-line);
}

.sf-nav-link.active {
  color: var(--lt-orange-dark);
  border-bottom-color: var(--lt-orange);
}

.sf-spacer {
  flex: 1;
}

.sf-nav-highlight {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 13px;
  font-weight: 600;
  transition: all var(--lt-transition);
}

.sf-nav-highlight .sf-cart-count {
  top: -6px;
  right: -4px;
  border: 2px solid #fff;
}

.sf-nav-highlight:hover {
  background: var(--lt-orange);
  color: #fff;
}

/* ================= MAIN ================= */
.sf-main {
  flex: 1;
}

/* ================= FOOTER ================= */
.sf-footer {
  background: #0b1220;
  color: #94a3b8;
  margin-top: 56px;
  font-size: 13.5px;
}

.sf-footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 0.9fr 0.9fr 1.3fr;
  gap: 40px;
  padding: 52px 0 40px;
}

.sf-footer-brand p {
  margin: 16px 0 18px;
  line-height: 1.7;
  color: #94a3b8;
}

.sf-brand-light .sf-brand-text {
  color: #fff;
}

.sf-brand-light .sf-brand-text small {
  color: #94a3b8;
}

.sf-socials {
  display: flex;
  gap: 9px;
}

.sf-socials a {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  color: #cbd5e1;
  font-size: 15px;
  transition: all var(--lt-transition);
}

.sf-socials a:hover {
  background: var(--lt-orange);
  color: #fff;
  transform: translateY(-2px);
}

.sf-footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sf-footer-col h4 {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.01em;
}

.sf-footer-col a,
.sf-footer-col p {
  color: #94a3b8;
  line-height: 1.6;
}

.sf-footer-col a {
  width: fit-content;
  background: linear-gradient(currentColor, currentColor) no-repeat 0 100% / 0% 1px;
  transition: color var(--lt-transition), background-size 0.25s ease;
}

.sf-footer-col a:hover {
  color: var(--lt-orange);
  background-size: 100% 1px;
}

.sf-newsletter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px 4px 4px 12px;
  margin-top: 2px;
}

.sf-newsletter input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font-family: var(--lt-font);
  font-size: 13px;
  padding: 7px 0;
}

.sf-newsletter input::placeholder {
  color: #64748b;
}

.sf-newsletter button {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 9px;
  background: var(--lt-orange);
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  transition: background var(--lt-transition);
}

.sf-newsletter button:hover {
  background: var(--lt-orange-dark);
}

.sf-news-note {
  color: #64748b;
  font-size: 11.5px;
}

.sf-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 0;
  font-size: 12.5px;
  color: #64748b;
}

.sf-footer-bottom b {
  color: var(--lt-orange);
}

.sf-payments {
  display: flex;
  gap: 8px;
}

.sf-payments span {
  padding: 4px 9px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #cbd5e1;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 1180px) {
  .sf-action-text,
  .sf-user-name {
    display: none;
  }

  .sf-header-main {
    gap: 16px;
  }
}

@media (max-width: 992px) {

  .sf-header-main {
    min-height: 64px;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
    gap: 12px;
  }

  .sf-search {
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }

  .sf-search button {
    display: none;
  }

  .sf-menu-btn {
    display: inline-flex;
  }

  .sf-nav {
    display: none;
  }

  .sf-nav.is-open {
    display: block;
    background: #fff;
    border-top: 1px solid var(--lt-line);
    box-shadow: 0 18px 30px rgba(15, 23, 42, 0.1);
  }

  .sf-nav.is-open .sf-nav-inner {
    flex-direction: column;
    align-items: stretch;
    padding: 10px 0 16px;
    min-height: 0;
  }

  .sf-nav.is-open .sf-nav-link {
    padding: 12px 10px;
    border-bottom: 1px solid #f1f5f9;
    border-radius: 8px;
  }

  .sf-nav.is-open .sf-nav-highlight {
    justify-content: center;
    margin-top: 8px;
  }

  .sf-footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .sf-footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .sf-auth a {
    padding: 8px 12px;
    font-size: 12.5px;
  }

  .sf-brand-text small {
    display: none;
  }

  .sf-brand-text {
    font-size: 19px;
  }

  .sf-brand-mark {
    width: 38px;
    height: 38px;
  }

  .sf-action:first-child {
    display: none;
  }

  .sf-footer-top {
    grid-template-columns: 1fr;
    padding: 40px 0 28px;
  }

  .sf-footer-bottom {
    justify-content: center;
    text-align: center;
  }
}
</style>

<style>
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/icons.css";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css");
</style>
