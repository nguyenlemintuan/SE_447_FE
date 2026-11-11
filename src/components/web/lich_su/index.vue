<template>
  <div class="lt-container lt-page orders-page">
    <nav class="crumb" aria-label="breadcrumb">
      <router-link to="/">Trang chủ</router-link>
      <i class="bx bx-chevron-right"></i>
      <router-link to="/web/profile">Tài khoản</router-link>
      <i class="bx bx-chevron-right"></i>
      <span>Đơn hàng</span>
    </nav>

    <div class="lt-section-head">
      <div>
        <span class="lt-eyebrow"><i class="bx bx-receipt"></i> Đơn hàng</span>
        <h1 class="lt-section-title">Đơn hàng của tôi</h1>
        <p class="lt-section-sub">Theo dõi trạng thái và xem lại lịch sử mua hàng của bạn.</p>
      </div>
      <router-link to="/web/san-pham" class="lt-btn lt-btn-outline">
        <i class="bx bx-store"></i> Tiếp tục mua sắm
      </router-link>
    </div>

    <div class="lt-chips status-chips">
      <button v-for="tab in statusTabs" :key="tab.value" type="button" class="lt-chip"
        :class="{ 'is-active': selectedStatus === tab.value }" @click="selectedStatus = tab.value">
        {{ tab.label }}
        <span class="chip-count">{{ countByStatus(tab.value) }}</span>
      </button>
    </div>

    <div v-if="loading" class="order-list">
      <div v-for="n in 3" :key="n" class="lt-card order-card">
        <div class="lt-skeleton" style="height: 150px"></div>
      </div>
    </div>

    <div v-else-if="filteredOrders.length" class="order-list">
      <article v-for="order in filteredOrders" :key="order.id" class="lt-card order-card">
        <header class="order-head">
          <div class="order-code">
            <span class="code">{{ order.ma_don_hang || "Đơn hàng" }}</span>
            <span class="date">
              <i class="bx bx-calendar"></i>
              {{ formatDate(order.created_at) }}
            </span>
          </div>
          <span class="lt-badge" :class="statusMeta(order.tinh_trang).badge">
            <i class="bx" :class="statusMeta(order.tinh_trang).icon"></i>
            {{ statusMeta(order.tinh_trang).label }}
          </span>
        </header>

        <div class="order-body">
          <button type="button" class="thumb" @click="goToOrderDetail(order.id)">
            <img :src="order.hinh_anh || fallbackImage" :alt="'Đơn hàng ' + order.ma_don_hang"
              @error="onImageError" />
          </button>

          <div class="order-info">
            <h3>{{ order.ma_don_hang ? `Đơn hàng ${order.ma_don_hang}` : "Đơn hàng LifeTech" }}</h3>
            <p class="recipient">
              <i class="bx bx-user"></i>
              {{ order.ten_nguoi_nhan || "Người nhận" }}
              <span v-if="order.so_dien_thoai" class="phone">· {{ order.so_dien_thoai }}</span>
            </p>
            <p class="meta">
              <span><i class="bx bx-package"></i> {{ order.so_luong || 0 }} sản phẩm</span>
              <span class="lt-badge" :class="Number(order.is_thanh_toan) === 1 ? 'lt-badge-green' : 'lt-badge-neutral'">
                <i class="bx" :class="Number(order.is_thanh_toan) === 1 ? 'bx-check-circle' : 'bx-credit-card'"></i>
                {{ Number(order.is_thanh_toan) === 1 ? "Đã thanh toán" : "Thanh toán khi nhận hàng" }}
              </span>
            </p>
          </div>

          <div class="order-total">
            <span class="total-label">Tổng tiền</span>
            <span class="lt-price">{{ formatVND(order.tong_tien) }}</span>
          </div>
        </div>

        <footer class="order-foot">
          <span class="status-hint">
            <i class="bx" :class="statusMeta(order.tinh_trang).icon"></i>
            {{ statusMeta(order.tinh_trang).hint }}
          </span>
          <div class="order-actions">
            <router-link :to="`/order/${order.id}`" class="lt-btn lt-btn-primary lt-btn-sm">
              Xem chi tiết <i class="bx bx-right-arrow-alt"></i>
            </router-link>
          </div>
        </footer>
      </article>
    </div>

    <div v-else class="lt-empty">
      <div class="lt-empty-icon"><i class="bx bx-receipt"></i></div>
      <h3>Chưa có đơn hàng nào</h3>
      <p>
        {{ selectedStatus === "all" ? "Bạn chưa đặt đơn hàng nào tại LifeTech." : "Không có đơn hàng ở trạng thái này." }}
      </p>
      <router-link v-if="selectedStatus === 'all'" to="/web/san-pham" class="lt-btn lt-btn-primary">
        <i class="bx bx-store"></i> Khám phá sản phẩm
      </router-link>
      <button v-else type="button" class="lt-btn lt-btn-outline" @click="selectedStatus = 'all'">
        Xem tất cả đơn hàng
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#f1f5f9"/><text x="80" y="86" font-family="Arial" font-size="14" fill="#94a3b8" text-anchor="middle">LifeTech</text></svg>'
  );

export default {
  name: "OrderHistory",
  data() {
    return {
      loading: true,
      orders: [],
      selectedStatus: "all",
      fallbackImage: FALLBACK_IMAGE,
      statusTabs: [
        { value: "all", label: "Tất cả" },
        { value: "shipping", label: "Đang giao" },
        { value: "delivered", label: "Đã giao" },
        { value: "cancelled", label: "Đã hủy" },
      ],
    };
  },
  computed: {
    filteredOrders() {
      if (this.selectedStatus === "all") return this.orders;
      return this.orders.filter((o) => this.statusKey(o.tinh_trang) === this.selectedStatus);
    },
  },
  mounted() {
    this.loadOrders();
  },
  methods: {
    loadOrders() {
      this.loading = true;
      axios
        .get(`${API}/khach-hang/order/data`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("users_login") },
        })
        .then((res) => {
          const data = res.data.data || [];
          this.orders = [...data].sort(
            (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
          );
        })
        .catch(() => this.$toast.error("Không tải được danh sách đơn hàng."))
        .finally(() => {
          this.loading = false;
        });
    },
    statusKey(tinhTrang) {
      const value = Number(tinhTrang);
      if (value === 0) return "cancelled";
      if (value === 1) return "delivered";
      return "shipping";
    },
    statusMeta(tinhTrang) {
      const key = this.statusKey(tinhTrang);
      if (key === "cancelled") {
        return {
          label: "Đã hủy",
          badge: "lt-badge-red",
          icon: "bx-x-circle",
          hint: "Đơn hàng đã bị hủy.",
        };
      }
      if (key === "delivered") {
        return {
          label: "Đã giao",
          badge: "lt-badge-green",
          icon: "bx-check-circle",
          hint: "Đơn hàng đã được giao thành công.",
        };
      }
      return {
        label: "Đang giao",
        badge: "lt-badge-yellow",
        icon: "bx-cycling",
        hint: "Đơn hàng đang trên đường tới bạn.",
      };
    },
    countByStatus(status) {
      if (status === "all") return this.orders.length;
      return this.orders.filter((o) => this.statusKey(o.tinh_trang) === status).length;
    },
    formatVND(value) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        Number(value) || 0
      );
    },
    formatDate(value) {
      if (!value) return "Không rõ ngày";
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
    goToOrderDetail(orderId) {
      this.$router.push(`/order/${orderId}`);
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

.status-chips {
  margin-bottom: 20px;
}

.chip-count {
  margin-left: 4px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
  background: #eef2f7;
  color: var(--lt-muted);
}

.lt-chip.is-active .chip-count {
  background: #fff;
  color: var(--lt-orange-dark);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 18px 36px -18px rgba(15, 23, 42, 0.25);
  transform: translateY(-1px);
}

.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--lt-line);
  background: #fbfcfe;
}

.order-code {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.order-code .code {
  font-weight: 700;
  font-size: 14.5px;
  letter-spacing: 0.01em;
}

.order-code .date {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--lt-muted);
}

.order-body {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 18px 20px;
}

.thumb {
  border: 1px solid var(--lt-line);
  background: #fff;
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
  width: 92px;
  height: 92px;
  cursor: pointer;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.order-info h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
  word-break: break-word;
}

.recipient {
  font-size: 13.5px;
  color: var(--lt-ink-soft);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.recipient i {
  color: var(--lt-muted);
}

.recipient .phone {
  color: var(--lt-muted);
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--lt-muted);
  margin: 0;
}

.meta > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.order-total {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.total-label {
  font-size: 12px;
  color: var(--lt-muted);
}

.order-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid var(--lt-line);
  background: #fbfcfe;
  flex-wrap: wrap;
}

.status-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--lt-muted);
}

.order-actions {
  display: flex;
  gap: 8px;
}

.lt-btn.lt-btn-sm {
  padding: 0.45rem 0.9rem;
  font-size: 13px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .order-body {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 14px;
  }

  .thumb {
    width: 72px;
    height: 72px;
  }

  .order-total {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding-top: 10px;
    border-top: 1px dashed var(--lt-line);
    min-width: 0;
  }

  .order-foot {
    flex-direction: column;
    align-items: stretch;
  }

  .order-actions .lt-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .order-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
