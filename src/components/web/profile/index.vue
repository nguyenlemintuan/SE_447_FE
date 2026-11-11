<template>
  <div class="lt-container lt-page account-page">
    <nav class="crumb" aria-label="breadcrumb">
      <router-link to="/">Trang chủ</router-link>
      <i class="bx bx-chevron-right"></i>
      <span>Tài khoản</span>
    </nav>

    <div class="lt-section-head">
      <div>
        <span class="lt-eyebrow"><i class="bx bx-user-circle"></i> Tài khoản</span>
        <h1 class="lt-section-title">Tài khoản của tôi</h1>
        <p class="lt-section-sub">Quản lý thông tin cá nhân và theo dõi hoạt động mua sắm của bạn.</p>
      </div>
      <router-link to="/web/san-pham" class="lt-btn lt-btn-outline">
        <i class="bx bx-store"></i> Tiếp tục mua sắm
      </router-link>
    </div>

    <div v-if="loading" class="account-grid">
      <div class="lt-panel">
        <div class="lt-skeleton" style="width: 84px; height: 84px; border-radius: 50%"></div>
        <div class="lt-skeleton mt-3" style="height: 18px; width: 60%"></div>
        <div class="lt-skeleton mt-2" style="height: 14px; width: 80%"></div>
        <div class="lt-skeleton mt-4" style="height: 120px"></div>
      </div>
      <div class="lt-panel">
        <div class="lt-skeleton" style="height: 22px; width: 40%"></div>
        <div class="lt-skeleton mt-3" style="height: 44px"></div>
        <div class="lt-skeleton mt-3" style="height: 44px"></div>
        <div class="lt-skeleton mt-3" style="height: 44px"></div>
        <div class="lt-skeleton mt-3" style="height: 84px"></div>
      </div>
    </div>

    <div v-else class="account-grid">
      <aside class="lt-panel account-summary">
        <div class="account-avatar">{{ initials }}</div>
        <h2 class="account-name">{{ user.ho_va_ten || "Khách hàng" }}</h2>
        <p class="account-mail">{{ user.email || "Chưa cập nhật email" }}</p>
        <span class="lt-badge lt-badge-orange"><i class="bx bx-crown"></i> Thành viên LifeTech</span>

        <div class="account-stats">
          <div class="stat">
            <strong>{{ stats.total }}</strong>
            <span>Tổng đơn</span>
          </div>
          <div class="stat">
            <strong>{{ stats.delivered }}</strong>
            <span>Đã giao</span>
          </div>
          <div class="stat">
            <strong>{{ stats.shipping }}</strong>
            <span>Đang giao</span>
          </div>
        </div>

        <hr class="lt-divider" />

        <nav class="account-nav">
          <router-link to="/web/profile" class="account-link is-active">
            <i class="bx bx-user"></i> Thông tin cá nhân
            <i class="bx bx-chevron-right end"></i>
          </router-link>
          <router-link to="/web/lich-su-mua-hang" class="account-link">
            <i class="bx bx-receipt"></i> Đơn hàng của tôi
            <i class="bx bx-chevron-right end"></i>
          </router-link>
          <router-link to="/web/gio-hang" class="account-link">
            <i class="bx bx-cart"></i> Giỏ hàng
            <i class="bx bx-chevron-right end"></i>
          </router-link>
          <router-link to="/users/doi-mat-khau" class="account-link">
            <i class="bx bx-lock-alt"></i> Đổi mật khẩu
            <i class="bx bx-chevron-right end"></i>
          </router-link>
          <button type="button" class="account-link is-danger" @click="Logout">
            <i class="bx bx-log-out-circle"></i> Đăng xuất
          </button>
        </nav>
      </aside>

      <section class="lt-panel account-form">
        <div class="form-head">
          <div>
            <h2 class="lt-panel-title mb-1"><i class="bx bx-edit-alt"></i> Thông tin cá nhân</h2>
            <p class="lt-muted mb-0">Cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn.</p>
          </div>
          <span class="lt-badge lt-badge-neutral"><i class="bx bx-shield-quarter"></i> Bảo mật</span>
        </div>

        <hr class="lt-divider" />

        <form @submit.prevent="capNhatProfile" class="form-grid">
          <div class="form-field">
            <label class="form-label" for="pf-name">Họ và tên</label>
            <input id="pf-name" type="text" class="form-control" v-model.trim="form.ho_va_ten"
              placeholder="Nhập họ và tên" />
          </div>

          <div class="form-field">
            <label class="form-label" for="pf-phone">Số điện thoại</label>
            <input id="pf-phone" type="tel" class="form-control" v-model.trim="form.so_dien_thoai"
              placeholder="Nhập số điện thoại" />
          </div>

          <div class="form-field form-field-full">
            <label class="form-label" for="pf-email">Email</label>
            <input id="pf-email" type="email" class="form-control" v-model.trim="form.email"
              placeholder="Nhập email" />
          </div>

          <div class="form-field form-field-full">
            <label class="form-label" for="pf-address">Địa chỉ</label>
            <textarea id="pf-address" class="form-control" rows="3" v-model.trim="form.dia_chi"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"></textarea>
          </div>

          <div class="form-actions form-field-full">
            <button type="submit" class="lt-btn lt-btn-primary" :disabled="saving">
              <i class="bx" :class="saving ? 'bx-loader-alt bx-spin' : 'bx-save'"></i>
              {{ saving ? "Đang lưu..." : "Lưu thay đổi" }}
            </button>
            <button type="button" class="lt-btn lt-btn-outline" :disabled="saving" @click="resetForm">
              Hủy thay đổi
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default {
  name: "UserProfile",
  data() {
    return {
      loading: true,
      saving: false,
      user: {},
      form: {
        ho_va_ten: "",
        email: "",
        so_dien_thoai: "",
        dia_chi: "",
      },
      stats: { total: 0, delivered: 0, shipping: 0 },
    };
  },
  computed: {
    initials() {
      const name = (this.user.ho_va_ten || "").trim();
      if (!name) return "LT";
      const parts = name.split(/\s+/);
      return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
    },
    authHeader() {
      return { Authorization: "Bearer " + localStorage.getItem("users_login") };
    },
  },
  mounted() {
    this.layThongTinLogin();
    this.loadStats();
  },
  methods: {
    layThongTinLogin() {
      this.loading = true;
      axios
        .get(`${API}/customer/profile`, { headers: this.authHeader })
        .then((res) => {
          if (res.data.status) {
            this.user = res.data.data;
            this.resetForm();
            localStorage.setItem("users_data", JSON.stringify(this.user));
          } else {
            this.$toast.error(res.data.message || "Không tải được thông tin tài khoản.");
          }
        })
        .catch(() => this.$toast.error("Không tải được thông tin tài khoản."))
        .finally(() => {
          this.loading = false;
        });
    },
    loadStats() {
      axios
        .get(`${API}/khach-hang/order/data`, { headers: this.authHeader })
        .then((res) => {
          const orders = res.data.data || [];
          this.stats = {
            total: orders.length,
            delivered: orders.filter((o) => Number(o.tinh_trang) === 1).length,
            shipping: orders.filter((o) => ![0, 1].includes(Number(o.tinh_trang))).length,
          };
        })
        .catch(() => {
          /* thống kê không quan trọng, bỏ qua lỗi */
        });
    },
    resetForm() {
      this.form = {
        ho_va_ten: this.user.ho_va_ten || "",
        email: this.user.email || "",
        so_dien_thoai: this.user.so_dien_thoai || "",
        dia_chi: this.user.dia_chi || "",
      };
    },
    capNhatProfile() {
      if (!this.form.ho_va_ten) {
        this.$toast.warning("Vui lòng nhập họ và tên.");
        return;
      }

      this.saving = true;
      axios
        .post(`${API}/customer/profile/update-profile`, this.form, { headers: this.authHeader })
        .then((res) => {
          if (res.data.status) {
            this.$toast.success(res.data.message || "Cập nhật thông tin thành công.");
            this.layThongTinLogin();
            window.dispatchEvent(new Event("user:updated"));
          } else {
            this.$toast.error(res.data.message || "Cập nhật thất bại.");
          }
        })
        .catch(() => this.$toast.error("Có lỗi khi cập nhật thông tin."))
        .finally(() => {
          this.saving = false;
        });
    },
    Logout() {
      axios
        .post(`${API}/customer/logout`, {}, { headers: this.authHeader })
        .catch(() => {})
        .finally(() => {
          localStorage.removeItem("users_login");
          localStorage.removeItem("users_data");
          localStorage.removeItem("checkoutData");
          this.$toast.success("Đăng xuất thành công!");
          this.$router.push("/dang-nhap");
        });
    },
  },
};
</script>

<style scoped>
.crumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: var(--lt-muted);
  margin-bottom: 18px;
}

.crumb a {
  color: var(--lt-muted);
  text-decoration: none;
}

.crumb a:hover {
  color: var(--lt-orange);
}

.account-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.account-summary {
  text-align: center;
}

.account-avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  box-shadow: 0 12px 26px rgba(249, 115, 22, 0.3);
  letter-spacing: 0.02em;
}

.account-name {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 4px;
}

.account-mail {
  font-size: 13.5px;
  color: var(--lt-muted);
  margin-bottom: 12px;
  word-break: break-word;
}

.account-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 20px;
}

.stat {
  background: #f8fafc;
  border: 1px solid var(--lt-line);
  border-radius: 12px;
  padding: 12px 6px;
}

.stat strong {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: var(--lt-ink);
  line-height: 1.2;
}

.stat span {
  font-size: 11.5px;
  color: var(--lt-muted);
}

.account-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.account-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 500;
  color: var(--lt-ink-soft);
  text-decoration: none;
  border: 0;
  background: transparent;
  width: 100%;
  transition: all 0.18s ease;
}

.account-link i:first-child {
  font-size: 18px;
  color: var(--lt-muted);
}

.account-link .end {
  margin-left: auto;
  font-size: 16px;
  color: #cbd5e1;
}

.account-link:hover {
  background: #f8fafc;
  color: var(--lt-ink);
}

.account-link.is-active {
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-weight: 600;
}

.account-link.is-active i:first-child {
  color: var(--lt-orange);
}

.account-link.is-danger {
  color: var(--lt-danger);
}

.account-link.is-danger i:first-child {
  color: var(--lt-danger);
}

.account-link.is-danger:hover {
  background: #fef2f2;
}

.form-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-field-full {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

@media (max-width: 960px) {
  .account-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .lt-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
