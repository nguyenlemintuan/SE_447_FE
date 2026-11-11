<template>
  <div class="lt-page">
    <div class="lt-container">
      <nav class="breadcrumb-line">
        <router-link to="/">Trang chủ</router-link>
        <i class="bx bx-chevron-right"></i>
        <router-link to="/web/gio-hang">Giỏ hàng</router-link>
        <i class="bx bx-chevron-right"></i>
        <span>Thanh toán</span>
      </nav>

      <div class="page-head">
        <h1>Thanh toán</h1>
        <p>Kiểm tra thông tin nhận hàng và xác nhận đơn của bạn.</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="checkout-layout">
        <div class="checkout-main">
          <div class="checkout-skeleton">
            <div class="lt-skeleton" style="height: 20px; width: 35%"></div>
            <div class="lt-skeleton" style="height: 100px"></div>
          </div>
          <div class="checkout-skeleton">
            <div class="lt-skeleton" style="height: 20px; width: 30%"></div>
            <div class="lt-skeleton" style="height: 140px"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!danhSachDonHang.length" class="lt-empty">
        <span class="lt-empty-icon"><i class="bx bx-receipt"></i></span>
        <h3>Chưa có sản phẩm để thanh toán</h3>
        <p>Giỏ hàng của bạn đang trống. Hãy chọn sản phẩm trước khi thanh toán.</p>
        <router-link to="/web/san-pham" class="lt-btn lt-btn-primary">
          <i class="bx bx-store-alt"></i> Mua sắm ngay
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="checkout-layout">
        <div class="checkout-main">
          <!-- Recipient -->
          <section class="checkout-card">
            <div class="checkout-card-head">
              <h2><i class="bx bx-map-pin"></i> Thông tin nhận hàng</h2>
              <router-link to="/web/profile" class="checkout-edit">
                Chỉnh sửa <i class="bx bx-edit-alt"></i>
              </router-link>
            </div>
            <div class="recipient">
              <span class="recipient-avatar">{{ userInitials }}</span>
              <div>
                <strong>{{ user.ho_va_ten || "Khách hàng" }}</strong>
                <p>
                  <span><i class="bx bx-phone"></i> {{ user.so_dien_thoai || "Chưa cập nhật" }}</span>
                  <span v-if="user.email"><i class="bx bx-envelope"></i> {{ user.email }}</span>
                </p>
                <p class="recipient-address">
                  <i class="bx bx-home-alt"></i>
                  {{ user.dia_chi || "Chưa cập nhật địa chỉ nhận hàng" }}
                </p>
              </div>
            </div>
          </section>

          <!-- Items -->
          <section class="checkout-card">
            <div class="checkout-card-head">
              <h2><i class="bx bx-package"></i> Sản phẩm ({{ totalQuantity }})</h2>
              <router-link to="/web/gio-hang" class="checkout-edit">
                Sửa giỏ hàng <i class="bx bx-right-arrow-alt"></i>
              </router-link>
            </div>

            <ul class="checkout-items">
              <li v-for="(item, index) in danhSachDonHang" :key="index" class="checkout-item">
                <span class="checkout-item-image">
                  <img :src="item.hinh_anh || fallbackImage" :alt="item.title" @error="onImageError" />
                </span>
                <div class="checkout-item-info">
                  <strong>{{ item.title }}</strong>
                  <small>Số lượng: {{ item.so_luong }}</small>
                </div>
                <span class="checkout-item-price">{{ formatVND(item.tien_hang * item.so_luong) }}</span>
              </li>
            </ul>
          </section>

          <!-- Payment -->
          <section class="checkout-card">
            <div class="checkout-card-head">
              <h2><i class="bx bx-credit-card"></i> Phương thức thanh toán</h2>
            </div>
            <div class="payment-method">
              <span class="payment-logo">QR</span>
              <div>
                <strong>Chuyển khoản ngân hàng</strong>
                <p>Quét mã VietQR để thanh toán nhanh chóng và an toàn.</p>
              </div>
              <span class="payment-check"><i class="bx bx-check"></i></span>
            </div>
            <div class="payment-note">
              <i class="bx bx-info-circle"></i>
              Sau khi đặt hàng, hệ thống sẽ hiển thị mã QR kèm nội dung chuyển khoản.
              Đơn hàng được xác nhận tự động khi nhận được thanh toán.
            </div>
          </section>
        </div>

        <!-- Summary -->
        <aside class="checkout-summary">
          <h2>Chi tiết thanh toán</h2>

          <div class="summary-row">
            <span>Tạm tính</span>
            <strong>{{ formatVND(subtotal) }}</strong>
          </div>

          <div v-if="selectedVoucher" class="summary-row is-discount">
            <span>Voucher {{ selectedVoucher.ma_code }}</span>
            <strong>-{{ formatVND(discountAmount) }}</strong>
          </div>

          <div class="summary-row">
            <span>Phí vận chuyển</span>
            <strong class="text-success">Miễn phí</strong>
          </div>

          <hr class="lt-divider" />

          <div class="summary-total">
            <span>Tổng thanh toán</span>
            <strong>{{ formatVND(totalPrice) }}</strong>
          </div>
          <small class="summary-vat">Đã bao gồm VAT</small>

          <button type="button" class="lt-btn lt-btn-primary lt-btn-lg lt-btn-block" :disabled="isLoading"
            @click="placeOrder">
            <span v-if="isLoading"><i class="bx bx-loader-alt bx-spin"></i> Đang xử lý...</span>
            <span v-else><i class="bx bx-lock-alt"></i> Đặt hàng</span>
          </button>

          <p class="summary-agree">
            Bằng việc đặt hàng, bạn đồng ý với điều khoản dịch vụ và chính sách của LifeTech.
          </p>
        </aside>
      </div>
    </div>

    <!-- QR modal -->
    <div class="modal fade" id="thanhToanModal" tabindex="-1" aria-hidden="true" ref="thanhToanModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content payment-modal">
          <div class="payment-modal-head">
            <div>
              <span class="payment-modal-eyebrow">Cổng thanh toán</span>
              <h3>Quét mã để thanh toán</h3>
            </div>
            <button type="button" class="payment-modal-close" data-bs-dismiss="modal" aria-label="Đóng">
              <i class="bx bx-x"></i>
            </button>
          </div>

          <div class="payment-modal-body">
            <div class="qr-box">
              <img v-if="linkQR" :src="linkQR" alt="Mã QR thanh toán" class="qr-image" />
              <div v-else class="qr-placeholder"><i class="bx bx-barcode"></i></div>
              <span class="qr-code">Mã đơn: <b>{{ ma_don.ma_don_hang }}</b></span>
            </div>

            <div class="payment-amount">
              <small>Số tiền cần thanh toán</small>
              <strong>{{ formatVND(totalPrice) }}</strong>
            </div>

            <div class="payment-steps">
              <p><span>1</span> Mở ứng dụng ngân hàng bất kỳ</p>
              <p><span>2</span> Quét mã VietQR bên trên</p>
              <p><span>3</span> Giữ nguyên nội dung chuyển khoản</p>
            </div>

            <div class="payment-status">
              <i class="bx bx-time-five"></i>
              Đang chờ xác nhận thanh toán...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23f8fafc'/%3E%3Crect b='105' y='80' width='90' height='140' rx='14' fill='none' stroke='%23cbd5e1' stroke-width='6'/%3E%3C/svg%3E";

export default {
  data() {
    return {
      loading: true,
      danhSachDonHang: [],
      list_order: [],
      selectedVoucher: null,
      voucherId: null,
      user: {},
      ma_don: {},
      isLoading: false,
      pollingInterval: null,
      fallbackImage: FALLBACK_IMAGE,
    };
  },
  computed: {
    subtotal() {
      return this.danhSachDonHang.reduce(
        (sum, item) => sum + item.tien_hang * item.so_luong,
        0
      );
    },
    totalQuantity() {
      return this.danhSachDonHang.reduce(
        (sum, item) => sum + Number(item.so_luong || 0),
        0
      );
    },
    discountAmount() {
      if (!this.selectedVoucher) return 0;
      return this.selectedVoucher.loai_giam
        ? (this.subtotal * this.selectedVoucher.so_giam_gia) / 100
        : this.selectedVoucher.so_giam_gia;
    },
    totalPrice() {
      return Math.max(this.subtotal - this.discountAmount, 0);
    },
    linkQR() {
      if (!this.ma_don.ma_don_hang || !this.ma_don.tong_tien) return "";
      return `https://img.vietqr.io/image/MB-9997616666-compact2.png?amount=${this.ma_don.tong_tien}&addInfo=${this.ma_don.ma_don_hang}`;
    },
    userInitials() {
      const name = (this.user.ho_va_ten || "KH").trim();
      return name
        .split(/\s+/)
        .slice(-2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    },
  },
  mounted() {
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "null");
    if (checkoutData) {
      this.list_order = checkoutData.list_order || [];
      this.selectedVoucher = checkoutData.selectedVoucher || null;
      this.voucherId = this.selectedVoucher ? this.selectedVoucher.id : null;
    }
    this.layThongTinLogin();
    this.fetchDonHang();
  },
  beforeUnmount() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  },
  methods: {
    fetchDonHang() {
      const token = localStorage.getItem("users_login");
      this.loading = true;
      axios
        .get("http://127.0.0.1:8000/api/customer/gio-hang/data", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status) {
            this.danhSachDonHang = (res.data.data || []).map((item) => ({
              id: item.id,
              product_id: item.product_id || item.product?.id,
              title: item.product?.title || "Sản phẩm",
              tien_hang: Number(item.price || 0),
              hinh_anh: item.product?.images || "",
              so_luong: Number(item.quantity || 1),
            }));
          }
        })
        .catch((err) => console.error("Lỗi lấy giỏ hàng:", err))
        .finally(() => {
          this.loading = false;
        });
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
        .catch((err) => console.error("Lỗi lấy profile:", err));
    },
    formatVND(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(Number(value) || 0);
    },
    placeOrder() {
      const token = localStorage.getItem("users_login");
      this.isLoading = true;
      const payload = {
        items: this.danhSachDonHang.map((item) => ({
          product_id: item.product_id || item.id,
          quantity: item.so_luong,
        })),
        voucher_id: this.voucherId,
      };

      axios
        .post("http://127.0.0.1:8000/api/customer/gio-hang/checkout", payload, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (!res.data.status) {
            this.$toast.error(res.data.message || "Không thể tạo đơn hàng.");
            return;
          }
          const orders = res.data.data || [];
          this.ma_don = orders[0] || {};
          this.danhSachDonHang = orders.map((item) => ({
            ...item,
            so_luong: item.so_luong || 1,
            tien_hang: Number(item.tien_hang || 0),
          }));
          localStorage.removeItem("checkoutData");

          const modal = new Modal(this.$refs.thanhToanModal);
          modal.show();

          if (this.pollingInterval) clearInterval(this.pollingInterval);
          this.pollingInterval = setInterval(this.checkPaymentStatus, 5000);
        })
        .catch((err) => {
          console.error("Lỗi khi checkout:", err);
          this.$toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    checkPaymentStatus() {
      if (!this.ma_don.ma_don_hang) return;
      axios
        .post(
          "https://citations-wellington-strip-resume.trycloudflare.com/sepay/webhook/check-status",
          { code: this.ma_don.ma_don_hang }
        )
        .then((res) => {
          if (res.data.status && res.data.paid) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            this.$toast.success("Thanh toán thành công!");
            window.dispatchEvent(new Event("cart:updated"));
            const modal = Modal.getInstance(this.$refs.thanhToanModal);
            if (modal) modal.hide();
            this.$router.push("/dat_hang/success?ma_don=" + this.ma_don.ma_don_hang);
          }
        })
        .catch((err) => console.error("Lỗi kiểm tra thanh toán:", err));
    },
    onImageError(event) {
      event.target.src = FALLBACK_IMAGE;
    },
  },
};
</script>

<style scoped>
.breadcrumb-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--lt-muted);
  margin-bottom: 14px;
}

.breadcrumb-line a {
  color: var(--lt-muted);
}

.breadcrumb-line a:hover {
  color: var(--lt-orange-dark);
}

.breadcrumb-line i {
  font-size: 16px;
}

.page-head {
  margin-bottom: 24px;
}

.page-head h1 {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 4px;
}

.page-head p {
  color: var(--lt-muted);
  font-size: 14px;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.checkout-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkout-card {
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
  padding: 22px;
}

.checkout-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.checkout-card-head h2 {
  font-size: 15.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.checkout-card-head h2 i {
  color: var(--lt-orange);
  font-size: 19px;
}

.checkout-edit {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--lt-orange-dark);
}

.checkout-edit:hover {
  text-decoration: underline;
}

.recipient {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.recipient-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 15px;
  font-weight: 700;
}

.recipient strong {
  font-size: 14.5px;
}

.recipient p {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--lt-muted);
  margin-top: 5px;
}

.recipient p span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.recipient p i {
  font-size: 14px;
  color: #94a3b8;
}

.recipient-address {
  color: var(--lt-ink-soft) !important;
}

.checkout-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.checkout-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.checkout-item-image {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 10px;
  padding: 5px;
}

.checkout-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.checkout-item-info {
  flex: 1;
  min-width: 0;
}

.checkout-item-info strong {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-item-info small {
  font-size: 12px;
  color: var(--lt-muted);
}

.checkout-item-price {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--lt-ink);
  white-space: nowrap;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  border: 1.5px solid var(--lt-orange);
  border-radius: 12px;
  background: #fff9f3;
}

.payment-logo {
  width: 46px;
  height: 34px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: var(--lt-ink);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.payment-method strong {
  display: block;
  font-size: 13.5px;
}

.payment-method p {
  font-size: 12px;
  color: var(--lt-muted);
  margin-top: 2px;
}

.payment-check {
  margin-left: auto;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--lt-orange);
  color: #fff;
  font-size: 14px;
}

.payment-note {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--lt-muted);
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
}

.payment-note i {
  color: var(--lt-orange);
  font-size: 16px;
  flex-shrink: 0;
}

/* Summary */
.checkout-summary {
  position: sticky;
  top: 140px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius-lg);
  padding: 24px;
  box-shadow: var(--lt-shadow-sm);
}

.checkout-summary h2 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 18px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13.5px;
  color: var(--lt-muted);
  margin-bottom: 12px;
}

.summary-row strong {
  color: var(--lt-ink);
  font-weight: 600;
}

.summary-row.is-discount strong {
  color: var(--lt-success);
}

.text-success {
  color: var(--lt-success) !important;
}

.summary-total {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.summary-total span {
  font-size: 14px;
  font-weight: 600;
  color: var(--lt-ink-soft);
}

.summary-total strong {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--lt-orange-dark);
}

.summary-vat {
  display: block;
  text-align: right;
  font-size: 11.5px;
  color: var(--lt-muted);
  margin-bottom: 18px;
}

.summary-agree {
  margin-top: 14px;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--lt-muted);
  text-align: center;
}

.checkout-skeleton {
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Modal */
.payment-modal {
  border: 0;
  border-radius: var(--lt-radius-lg);
  overflow: hidden;
  box-shadow: var(--lt-shadow-lg);
}

.payment-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 24px;
  background: var(--lt-ink);
  color: #fff;
}

.payment-modal-eyebrow {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fdba74;
}

.payment-modal-head h3 {
  color: #fff;
  font-size: 18px;
  margin-top: 5px;
}

.payment-modal-close {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9px;
  background: transparent;
  color: #fff;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.payment-modal-body {
  padding: 24px;
  text-align: center;
}

.qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qr-image {
  width: 220px;
  max-width: 100%;
  border-radius: 12px;
  border: 1px solid var(--lt-line);
  padding: 8px;
  background: #fff;
}

.qr-placeholder {
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px dashed var(--lt-line);
  color: #cbd5e1;
  font-size: 48px;
}

.qr-code {
  font-size: 12.5px;
  color: var(--lt-muted);
}

.qr-code b {
  color: var(--lt-ink);
}

.payment-amount {
  margin: 18px 0;
  padding: 14px;
  border-radius: 12px;
  background: var(--lt-orange-soft);
}

.payment-amount small {
  display: block;
  font-size: 11.5px;
  color: #9a3412;
  margin-bottom: 2px;
}

.payment-amount strong {
  font-size: 24px;
  font-weight: 800;
  color: var(--lt-orange-dark);
  letter-spacing: -0.02em;
}

.payment-steps {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.payment-steps p {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12.5px;
  color: var(--lt-ink-soft);
}

.payment-steps span {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
  font-size: 11px;
  font-weight: 700;
  color: var(--lt-ink-soft);
}

.payment-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 999px;
  background: var(--lt-warning-soft);
  color: var(--lt-warning);
  font-size: 12.5px;
  font-weight: 600;
}

@media (max-width: 992px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .checkout-card {
    padding: 18px;
  }

  .recipient {
    flex-direction: column;
  }
}
</style>
