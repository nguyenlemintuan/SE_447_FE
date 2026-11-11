<template>
  <div class="lt-container lt-page order-detail-page">
    <nav class="crumb" aria-label="breadcrumb">
      <router-link to="/">Trang chủ</router-link>
      <i class="bx bx-chevron-right"></i>
      <router-link to="/web/lich-su-mua-hang">Đơn hàng</router-link>
      <i class="bx bx-chevron-right"></i>
      <span>Chi tiết</span>
    </nav>

    <div v-if="loading" class="detail-shell">
      <div class="lt-skeleton" style="height: 96px; border-radius: 22px"></div>
      <div class="detail-grid">
        <div class="lt-skeleton" style="height: 340px; border-radius: 22px"></div>
        <div class="lt-skeleton" style="height: 240px; border-radius: 22px"></div>
      </div>
    </div>

    <div v-else-if="!order" class="lt-empty">
      <div class="lt-empty-icon"><i class="bx bx-package"></i></div>
      <h3>Không tìm thấy đơn hàng</h3>
      <p>Đơn hàng có thể đã bị xóa hoặc không tồn tại.</p>
      <router-link to="/web/lich-su-mua-hang" class="lt-btn lt-btn-primary">
        <i class="bx bx-arrow-back"></i> Về danh sách đơn hàng
      </router-link>
    </div>

    <div v-else class="detail-shell">
      <div class="detail-head">
        <div>
          <span class="lt-eyebrow"><i class="bx bx-package"></i> Chi tiết đơn hàng</span>
          <h1 class="lt-section-title">{{ order.ma_don_hang || "Đơn hàng LifeTech" }}</h1>
          <p class="lt-section-sub">Đặt lúc {{ formatDate(order.created_at) }}</p>
        </div>
        <button type="button" class="lt-btn lt-btn-outline" @click="goBack">
          <i class="bx bx-arrow-back"></i> Quay lại
        </button>
      </div>

      <div class="status-banner" :class="'is-' + status.key">
        <span class="status-icon"><i class="bx" :class="status.icon"></i></span>
        <div class="status-copy">
          <strong>{{ status.label }}</strong>
          <p>{{ status.hint }}</p>
        </div>
        <span class="lt-badge status-pay"
          :class="Number(order.is_thanh_toan) === 1 ? 'lt-badge-green' : 'lt-badge-neutral'">
          <i class="bx" :class="Number(order.is_thanh_toan) === 1 ? 'bx-check-circle' : 'bx-wallet'"></i>
          {{ Number(order.is_thanh_toan) === 1 ? "Đã thanh toán" : "Chưa thanh toán" }}
        </span>
      </div>

      <div v-if="status.key !== 'cancelled'" class="lt-panel stepper-panel">
        <ol class="stepper">
          <li v-for="step in steps" :key="step.label" class="step" :class="'is-' + step.state">
            <span class="step-dot">
              <i class="bx" :class="step.state === 'done' ? 'bx-check' : step.icon"></i>
            </span>
            <span class="step-label">{{ step.label }}</span>
          </li>
        </ol>
      </div>

      <div class="detail-grid">
        <section class="lt-panel">
          <h2 class="lt-panel-title"><i class="bx bx-shopping-bag"></i> Sản phẩm</h2>

          <div class="line-item">
            <div class="line-thumb">
              <img :src="order.hinh_anh || fallbackImage" alt="Sản phẩm trong đơn" @error="onImageError" />
            </div>
            <div class="line-info">
              <h3>{{ order.ma_don_hang }}</h3>
              <p class="lt-muted mb-1">Số lượng: {{ order.so_luong || 0 }}</p>
              <p class="unit-price">Đơn giá: {{ formatVND(order.tien_hang) }}</p>
            </div>
            <div class="line-total">
              <span class="lt-muted">Thành tiền</span>
              <strong>{{ formatVND(order.tong_tien) }}</strong>
            </div>
          </div>

          <hr class="lt-divider" />

          <dl class="totals">
            <div>
              <dt>Tạm tính</dt>
              <dd>{{ formatVND(order.tien_hang * (order.so_luong || 0)) }}</dd>
            </div>
            <div v-if="savings > 0" class="is-discount">
              <dt>Giảm giá</dt>
              <dd>-{{ formatVND(savings) }}</dd>
            </div>
            <div>
              <dt>Phí vận chuyển</dt>
              <dd class="is-free">Miễn phí</dd>
            </div>
            <div class="is-total">
              <dt>Tổng cộng</dt>
              <dd>{{ formatVND(order.tong_tien) }}</dd>
            </div>
          </dl>
        </section>

        <aside class="detail-side">
          <section class="lt-panel">
            <h2 class="lt-panel-title"><i class="bx bx-map"></i> Thông tin nhận hàng</h2>
            <ul class="info-list">
              <li>
                <i class="bx bx-user"></i>
                <div>
                  <span>Người nhận</span>
                  <strong>{{ order.ten_nguoi_nhan || "Chưa cập nhật" }}</strong>
                </div>
              </li>
              <li>
                <i class="bx bx-phone"></i>
                <div>
                  <span>Số điện thoại</span>
                  <strong>{{ order.so_dien_thoai || "Chưa cập nhật" }}</strong>
                </div>
              </li>
              <li>
                <i class="bx bx-calendar"></i>
                <div>
                  <span>Ngày đặt hàng</span>
                  <strong>{{ formatDate(order.created_at) }}</strong>
                </div>
              </li>
              <li>
                <i class="bx bx-credit-card"></i>
                <div>
                  <span>Thanh toán</span>
                  <strong>{{ Number(order.is_thanh_toan) === 1 ? "Đã thanh toán" : "Thanh toán khi nhận hàng" }}</strong>
                </div>
              </li>
            </ul>
          </section>

          <section class="lt-panel support-panel">
            <h2 class="lt-panel-title"><i class="bx bx-support"></i> Cần hỗ trợ?</h2>
            <p class="lt-muted mb-3">Liên hệ tổng đài LifeTech nếu bạn có thắc mắc về đơn hàng.</p>
            <a href="tel:1900232460" class="support-line">
              <i class="bx bx-phone-call"></i>
              <div>
                <strong>1900 232 460</strong>
                <span>8:00 – 21:30 hằng ngày</span>
              </div>
            </a>
            <router-link to="/web/san-pham" class="lt-btn lt-btn-outline lt-btn-block mt-3">
              <i class="bx bx-store"></i> Tiếp tục mua sắm
            </router-link>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#f1f5f9"/><text x="100" y="106" font-family="Arial" font-size="16" fill="#94a3b8" text-anchor="middle">LifeTech</text></svg>'
  );

export default {
  name: "OrderDetail",
  data() {
    return {
      loading: true,
      order: null,
      fallbackImage: FALLBACK_IMAGE,
    };
  },
  computed: {
    statusKey() {
      const value = Number(this.order?.tinh_trang);
      if (value === 0) return "cancelled";
      if (value === 1) return "delivered";
      return "shipping";
    },
    status() {
      if (this.statusKey === "cancelled") {
        return {
          key: "cancelled",
          label: "Đơn hàng đã hủy",
          hint: "Đơn hàng này đã bị hủy. Nếu cần hỗ trợ, vui lòng liên hệ tổng đài.",
          icon: "bx-x-circle",
        };
      }
      if (this.statusKey === "delivered") {
        return {
          key: "delivered",
          label: "Giao hàng thành công",
          hint: "Đơn hàng đã được giao tới bạn. Cảm ơn bạn đã mua sắm tại LifeTech.",
          icon: "bx-check-circle",
        };
      }
      return {
        key: "shipping",
        label: "Đơn hàng đang giao",
        hint: "Đơn hàng đang trên đường tới bạn. Vui lòng chờ điện thoại để nhận hàng.",
        icon: "bx-cycling",
      };
    },
    steps() {
      const labels = [
        { label: "Đã đặt hàng", icon: "bx-shopping-bag" },
        { label: "Đã xác nhận", icon: "bx-check-shield" },
        { label: "Đang giao", icon: "bx-package" },
        { label: "Đã giao", icon: "bx-home" },
      ];
      const activeIndex = this.statusKey === "delivered" ? 4 : 2;
      return labels.map((step, index) => ({
        ...step,
        state: index < activeIndex ? "done" : index === activeIndex ? "active" : "pending",
      }));
    },
    savings() {
      if (!this.order) return 0;
      const gross = Number(this.order.tien_hang || 0) * Number(this.order.so_luong || 0);
      return Math.max(gross - Number(this.order.tong_tien || 0), 0);
    },
  },
  mounted() {
    this.fetchOrderDetail();
  },
  methods: {
    fetchOrderDetail() {
      this.loading = true;
      axios
        .get(`${API}/admin/order/${this.$route.params.id}`)
        .then((res) => {
          this.order = res.data.status ? res.data.data : null;
        })
        .catch(() => {
          this.order = null;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatVND(value) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        Number(value) || 0
      );
    },
    formatDate(value) {
      if (!value) return "Không rõ";
      return new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    onImageError(event) {
      event.target.src = this.fallbackImage;
    },
    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push("/web/lich-su-mua-hang");
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

.detail-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-radius: var(--lt-radius-lg);
  border: 1px solid transparent;
  flex-wrap: wrap;
}

.status-banner.is-shipping {
  background: #fffbe6;
  border-color: #fde68a;
}

.status-banner.is-delivered {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.status-banner.is-cancelled {
  background: #fef2f2;
  border-color: #fecaca;
}

.status-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  background: #fff;
  flex: 0 0 auto;
}

.is-shipping .status-icon {
  color: var(--lt-warning);
}

.is-delivered .status-icon {
  color: var(--lt-success);
}

.is-cancelled .status-icon {
  color: var(--lt-danger);
}

.status-copy {
  flex: 1 1 240px;
}

.status-copy strong {
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.status-copy p {
  margin: 2px 0 0;
  font-size: 13.5px;
  color: var(--lt-ink-soft);
}

.status-pay {
  margin-left: auto;
}

.stepper-panel {
  padding: 22px;
}

.stepper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

.step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.step::before {
  content: "";
  position: absolute;
  top: 17px;
  left: -50%;
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  z-index: 0;
}

.step:first-child::before {
  display: none;
}

.step.is-done::before,
.step.is-active::before {
  background: var(--lt-orange);
}

.step-dot {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #f1f5f9;
  color: #94a3b8;
  border: 2px solid #e2e8f0;
}

.step.is-done .step-dot {
  background: var(--lt-orange);
  border-color: var(--lt-orange);
  color: #fff;
}

.step.is-active .step-dot {
  background: #fff;
  border-color: var(--lt-orange);
  color: var(--lt-orange);
  box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.14);
}

.step-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--lt-muted);
}

.step.is-done .step-label,
.step.is-active .step-label {
  color: var(--lt-ink);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.detail-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.line-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
}

.line-thumb {
  width: 96px;
  height: 96px;
  border: 1px solid var(--lt-line);
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.line-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.line-info h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
  word-break: break-word;
}

.unit-price {
  font-size: 13px;
  color: var(--lt-muted);
  margin: 0;
}

.line-total {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.line-total strong {
  font-size: 17px;
  font-weight: 800;
}

.line-total .lt-muted {
  font-size: 12px;
}

.totals {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.totals > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.totals dt {
  font-weight: 500;
  color: var(--lt-ink-soft);
  font-size: 14px;
}

.totals dd {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
}

.totals .is-free {
  color: var(--lt-success);
}

.totals .is-discount dd {
  color: var(--lt-danger);
}

.totals .is-total {
  border-top: 1px dashed var(--lt-line);
  padding-top: 12px;
}

.totals .is-total dt {
  font-weight: 700;
  color: var(--lt-ink);
  font-size: 15px;
}

.totals .is-total dd {
  font-size: 22px;
  font-weight: 800;
  color: var(--lt-orange-dark);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-list > li > i {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 11px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.info-list span {
  display: block;
  font-size: 12px;
  color: var(--lt-muted);
}

.info-list strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--lt-ink);
  word-break: break-word;
}

.support-line {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  background: #f8fafc;
  border: 1px solid var(--lt-line);
  border-radius: 14px;
  padding: 12px 14px;
  transition: all 0.2s ease;
}

.support-line:hover {
  border-color: var(--lt-orange-line);
  background: var(--lt-orange-soft);
}

.support-line i {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--lt-orange);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.support-line strong {
  display: block;
  color: var(--lt-ink);
  font-size: 15px;
  line-height: 1.2;
}

.support-line span {
  font-size: 12px;
  color: var(--lt-muted);
}

@media (max-width: 960px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .line-item {
    grid-template-columns: 76px minmax(0, 1fr);
  }

  .line-thumb {
    width: 76px;
    height: 76px;
  }

  .line-total {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    border-top: 1px dashed var(--lt-line);
    padding-top: 10px;
  }

  .stepper {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 18px;
  }

  .step::before {
    display: none;
  }

  .status-pay {
    margin-left: 0;
  }
}
</style>
