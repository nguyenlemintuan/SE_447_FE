<template>
  <div class="lt-page">
    <div class="lt-container">
      <nav class="breadcrumb-line">
        <router-link to="/">Trang chủ</router-link>
        <i class="bx bx-chevron-right"></i>
        <span>Giỏ hàng</span>
      </nav>

      <div class="page-head">
        <h1>Giỏ hàng của bạn</h1>
        <p v-if="list_order.length">
          Bạn đang có <b>{{ list_order.length }}</b> sản phẩm trong giỏ hàng.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="cart-layout">
        <div class="cart-items">
          <div v-for="n in 2" :key="n" class="cart-skeleton">
            <div class="lt-skeleton cart-skeleton-img"></div>
            <div class="cart-skeleton-lines">
              <div class="lt-skeleton" style="height: 16px; width: 70%"></div>
              <div class="lt-skeleton" style="height: 14px; width: 40%"></div>
              <div class="lt-skeleton" style="height: 34px; width: 150px; margin-top: 8px"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!list_order.length" class="lt-empty">
        <span class="lt-empty-icon"><i class="bx bxs-cart"></i></span>
        <h3>Giỏ hàng đang trống</h3>
        <p>Thêm vài sản phẩm công nghệ chính hãng để bắt đầu mua sắm nhé.</p>
        <router-link to="/web/san-pham" class="lt-btn lt-btn-primary">
          <i class="bx bx-store-alt"></i> Khám phá sản phẩm
        </router-link>
      </div>

      <!-- Cart content -->
      <div v-else class="cart-layout">
        <div class="cart-items">
          <article v-for="(item, index) in list_order" :key="item.id" class="cart-item">
            <router-link :to="`/web/chi-tiet-san-pham/${item.product_id || item.id}`" class="cart-item-image">
              <img :src="item.hinh_anh || fallbackImage" :alt="item.title" @error="onImageError" />
            </router-link>

            <div class="cart-item-info">
              <span class="cart-item-brand">{{ item.brand || "LifeTech" }}</span>
              <h3>{{ item.title }}</h3>
              <p class="cart-item-sub">
                <span v-if="item.warranty"><i class="bx bx-shield"></i> Bảo hành {{ item.warranty }} tháng</span>
                <span class="cart-item-stock" :class="{ 'is-low': item.quantity > 0 && item.quantity <= 3 }">
                  <i class="bx bx-check-circle"></i> Còn {{ item.quantity }} sản phẩm
                </span>
              </p>

              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button type="button" aria-label="Giảm" @click="giamQuantity(index)">
                    <i class="bx bx-minus"></i>
                  </button>
                  <input v-model.number="item.buyQuantity" type="number" :min="1" :max="item.quantity || 1"
                    aria-label="Số lượng" @change="checkQuantity(index)" />
                  <button type="button" aria-label="Tăng" @click="tangQuantity(index)">
                    <i class="bx bx-plus"></i>
                  </button>
                </div>

                <button type="button" class="cart-remove" @click="chonXoa(index)">
                  <i class="bx bx-trash"></i> Xoá
                </button>
              </div>
            </div>

            <div class="cart-item-price">
              <strong>{{ formatVND(item.tien_hang * item.buyQuantity) }}</strong>
              <small>{{ formatVND(item.tien_hang) }} / sản phẩm</small>
            </div>
          </article>

          <router-link to="/web/san-pham" class="cart-continue">
            <i class="bx bx-left-arrow-alt"></i> Tiếp tục mua sắm
          </router-link>
        </div>

        <!-- Summary -->
        <aside class="cart-summary">
          <h2>Tóm tắt đơn hàng</h2>

          <div class="summary-row">
            <span>Tạm tính ({{ totalQuantity }} sản phẩm)</span>
            <strong>{{ formatVND(subtotal) }}</strong>
          </div>

          <div class="summary-voucher">
            <label for="voucher">Mã khuyến mãi</label>
            <select id="voucher" v-model="selectedVoucher">
              <option :value="null">Chọn mã giảm giá</option>
              <option v-for="voucher in vouchers" :key="voucher.id" :value="voucher">
                {{ voucher.ma_code }} – {{ voucherLabel(voucher) }}
              </option>
            </select>
          </div>

          <div v-if="selectedVoucher" class="summary-row is-discount">
            <span>Giảm giá ({{ selectedVoucher.ma_code }})</span>
            <strong>-{{ formatVND(discountAmount) }}</strong>
          </div>

          <div class="summary-row">
            <span>Phí vận chuyển</span>
            <strong class="text-success">Miễn phí</strong>
          </div>

          <hr class="lt-divider" />

          <div class="summary-total">
            <span>Tổng cộng</span>
            <strong>{{ formatVND(totalPrice) }}</strong>
          </div>
          <small class="summary-vat">Đã bao gồm VAT</small>

          <button type="button" class="lt-btn lt-btn-primary lt-btn-lg lt-btn-block" @click="proceedToCheckout">
            Tiến hành thanh toán <i class="bx bx-right-arrow-alt"></i>
          </button>

          <div class="summary-trust">
            <span><i class="bx bx-lock-alt"></i> Thanh toán an toàn</span>
            <span><i class="bx bx-refresh"></i> Đổi trả 7 ngày</span>
          </div>
        </aside>
      </div>
    </div>

    <!-- Delete modal -->
    <div class="modal fade" id="modalXoa" tabindex="-1" aria-labelledby="modalXoaLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content cart-modal">
          <div class="cart-modal-body">
            <span class="cart-modal-icon"><i class="bx bx-trash"></i></span>
            <h3>Xoá sản phẩm?</h3>
            <p>
              Bạn có chắc muốn xoá <strong>{{ del_order?.title }}</strong> khỏi giỏ hàng?
            </p>
            <div class="cart-modal-actions">
              <button type="button" class="lt-btn lt-btn-outline" data-bs-dismiss="modal">Huỷ</button>
              <button type="button" class="lt-btn cart-btn-danger" data-bs-dismiss="modal" @click="xoaOrder">
                Xoá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23f8fafc'/%3E%3Crect x='105' y='80' width='90' height='140' rx='14' fill='none' stroke='%23cbd5e1' stroke-width='6'/%3E%3C/svg%3E";

export default {
  data() {
    return {
      loading: true,
      list_order: [],
      del_index: null,
      del_order: null,
      vouchers: [],
      selectedVoucher: null,
      fallbackImage: FALLBACK_IMAGE,
    };
  },
  computed: {
    subtotal() {
      return this.list_order.reduce(
        (sum, item) => sum + item.tien_hang * item.buyQuantity,
        0
      );
    },
    totalQuantity() {
      return this.list_order.reduce(
        (sum, item) => sum + Number(item.buyQuantity || 0),
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
  },
  mounted() {
    if (!localStorage.getItem("users_login")) {
      this.loading = false;
      return;
    }
    this.loadData();
    this.loadVouchers();
  },
  methods: {
    loadData() {
      this.loading = true;
      axios
        .get("http://127.0.0.1:8000/api/customer/gio-hang/data", {
          headers: { Authorization: "Bearer " + localStorage.getItem("users_login") },
        })
        .then((res) => {
          const items = res.data?.data || [];
          this.list_order = items.map((order) => ({
            id: order.id,
            product_id: order.product_id || order.product?.id,
            title: order.product?.title || "Không có tên",
            tien_hang: Number(order.price || order.tien_hang || 0),
            hinh_anh: order.product?.images,
            brand: order.product?.brand || "",
            warranty: order.product?.warranty || "",
            status: order.status || "",
            quantity: Number(order.product?.quantity || 0),
            buyQuantity: Number(order.quantity || 1),
          }));
        })
        .catch((err) => {
          console.error("Lỗi load giỏ hàng:", err);
          this.list_order = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadVouchers() {
      axios
        .get("http://127.0.0.1:8000/api/customer/voucher/data", {
          headers: { Authorization: "Bearer " + localStorage.getItem("users_login") },
        })
        .then((res) => {
          this.vouchers = res.data?.data || [];
        })
        .catch((err) => console.error("Lỗi load voucher:", err));
    },
    formatVND(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(Number(value) || 0);
    },
    voucherLabel(voucher) {
      return voucher.loai_giam
        ? `${voucher.so_giam_gia}%`
        : this.formatVND(voucher.so_giam_gia);
    },
    async updateQuantity(item) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/customer/gio-hang/update-quantity/${item.id}`,
          { quantity: item.buyQuantity },
          {
            headers: { Authorization: "Bearer " + localStorage.getItem("users_login") },
          }
        );
        window.dispatchEvent(new Event("cart:updated"));
      } catch (err) {
        console.error(err);
      }
    },
    tangQuantity(index) {
      const item = this.list_order[index];
      if (item.buyQuantity < item.quantity) {
        item.buyQuantity++;
        this.updateQuantity(item);
      } else {
        this.$toast.warning("Bạn đã đạt tối đa số lượng tồn kho!");
      }
    },
    giamQuantity(index) {
      const item = this.list_order[index];
      if (item.buyQuantity > 1) {
        item.buyQuantity--;
        this.updateQuantity(item);
      }
    },
    checkQuantity(index) {
      const item = this.list_order[index];
      const value = Math.round(Number(item.buyQuantity) || 1);
      item.buyQuantity = Math.min(Math.max(value, 1), item.quantity || 1);
      this.updateQuantity(item);
    },
    chonXoa(index) {
      this.del_index = index;
      this.del_order = this.list_order[index];
    },
    xoaOrder() {
      if (this.del_index === null) return;
      const cartId = this.list_order[this.del_index].id;
      axios
        .post(
          `http://127.0.0.1:8000/api/customer/gio-hang/delete/${cartId}`,
          {},
          {
            headers: { Authorization: "Bearer " + localStorage.getItem("users_login") },
          }
        )
        .then((res) => {
          if (res.data.status) {
            this.list_order.splice(this.del_index, 1);
            this.del_index = null;
            this.del_order = null;
            this.$toast.success("Đã xoá sản phẩm khỏi giỏ hàng.");
            window.dispatchEvent(new Event("cart:updated"));
          } else {
            this.$toast.error("Xoá thất bại!");
          }
        })
        .catch((err) => {
          console.error("Lỗi xoá giỏ hàng:", err);
          this.$toast.error("Có lỗi xảy ra khi xoá sản phẩm.");
        });
    },
    proceedToCheckout() {
      const checkoutData = {
        list_order: this.list_order,
        selectedVoucher: this.selectedVoucher,
      };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      this.$router.push("/web/dat-hang");
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

.page-head b {
  color: var(--lt-ink);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
  transition: border-color var(--lt-transition), box-shadow var(--lt-transition);
}

.cart-item:hover {
  border-color: #d7dee8;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.cart-item-image {
  width: 112px;
  height: 112px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  padding: 8px;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-brand {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lt-orange-dark);
}

.cart-item-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 3px 0 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-sub {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--lt-muted);
}

.cart-item-sub span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.cart-item-sub i {
  font-size: 14px;
  color: #94a3b8;
}

.cart-item-stock i {
  color: var(--lt-success);
}

.cart-item-stock.is-low i {
  color: var(--lt-warning);
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.qty-stepper {
  display: inline-flex;
  align-items: center;
  height: 38px;
  border: 1px solid var(--lt-line);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.qty-stepper button {
  width: 34px;
  height: 100%;
  border: 0;
  background: transparent;
  color: var(--lt-ink-soft);
  font-size: 15px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--lt-transition);
}

.qty-stepper button:hover {
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
}

.qty-stepper input {
  width: 42px;
  height: 100%;
  border: 0;
  border-left: 1px solid var(--lt-line);
  border-right: 1px solid var(--lt-line);
  text-align: center;
  font-family: var(--lt-font);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lt-ink);
  outline: 0;
}

.qty-stepper input::-webkit-outer-spin-button,
.qty-stepper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.cart-remove {
  border: 0;
  background: transparent;
  color: var(--lt-muted);
  font-family: var(--lt-font);
  font-size: 12.5px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  transition: all var(--lt-transition);
}

.cart-remove:hover {
  color: var(--lt-danger);
  background: var(--lt-danger-soft);
}

.cart-item-price {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;
  min-width: 130px;
}

.cart-item-price strong {
  font-size: 16px;
  font-weight: 800;
  color: var(--lt-ink);
  letter-spacing: -0.02em;
}

.cart-item-price small {
  font-size: 11.5px;
  color: var(--lt-muted);
}

.cart-continue {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-size: 13px;
  font-weight: 600;
  color: var(--lt-ink-soft);
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid var(--lt-line);
  background: #fff;
  transition: all var(--lt-transition);
}

.cart-continue:hover {
  border-color: var(--lt-orange-line);
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
}

/* Summary */
.cart-summary {
  position: sticky;
  top: 140px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius-lg);
  padding: 24px;
  box-shadow: var(--lt-shadow-sm);
}

.cart-summary h2 {
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

.summary-voucher {
  margin: 16px 0;
}

.summary-voucher label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--lt-ink-soft);
  margin-bottom: 7px;
}

.summary-voucher select {
  width: 100%;
  border: 1px solid var(--lt-line);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: var(--lt-font);
  font-size: 13px;
  color: var(--lt-ink);
  background: #fff;
  outline: 0;
  cursor: pointer;
}

.summary-voucher select:focus {
  border-color: var(--lt-orange);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12);
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

.summary-trust {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--lt-line);
  font-size: 11.5px;
  color: var(--lt-muted);
}

.summary-trust span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.summary-trust i {
  font-size: 14px;
  color: var(--lt-success);
}

/* Skeleton */
.cart-skeleton {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
}

.cart-skeleton-img {
  width: 112px;
  height: 112px;
  border-radius: 12px;
  flex-shrink: 0;
}

.cart-skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Modal */
.cart-modal {
  border: 0;
  border-radius: var(--lt-radius-lg);
  box-shadow: var(--lt-shadow-lg);
}

.cart-modal-body {
  padding: 28px 24px 22px;
  text-align: center;
}

.cart-modal-icon {
  width: 58px;
  height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--lt-danger-soft);
  color: var(--lt-danger);
  font-size: 26px;
  margin-bottom: 14px;
}

.cart-modal-body h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.cart-modal-body p {
  color: var(--lt-muted);
  font-size: 13.5px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.cart-modal-body p strong {
  color: var(--lt-ink);
}

.cart-modal-actions {
  display: flex;
  gap: 10px;
}

.cart-modal-actions .lt-btn {
  flex: 1;
}

.cart-btn-danger {
  background: var(--lt-danger);
  color: #fff;
}

.cart-btn-danger:hover {
  background: #dc2626;
  color: #fff;
}

@media (max-width: 992px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-item {
    flex-wrap: wrap;
  }

  .cart-item-image {
    width: 84px;
    height: 84px;
  }

  .cart-item-price {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    border-top: 1px solid #f1f5f9;
    padding-top: 10px;
  }

  .cart-item-price small {
    display: none;
  }
}
</style>
