<template>
  <div class="lt-page detail-page">
    <div class="lt-container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb-line">
        <router-link to="/">Trang chủ</router-link>
        <i class="bx bx-chevron-right"></i>
        <router-link to="/web/san-pham">Sản phẩm</router-link>
        <i class="bx bx-chevron-right"></i>
        <span>{{ product.title || "Chi tiết sản phẩm" }}</span>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="detail-grid">
        <div class="lt-skeleton detail-skeleton-image"></div>
        <div class="detail-skeleton-info">
          <div class="lt-skeleton skeleton-line lg"></div>
          <div class="lt-skeleton skeleton-line"></div>
          <div class="lt-skeleton skeleton-line short"></div>
          <div class="lt-skeleton skeleton-block"></div>
        </div>
      </div>

      <!-- Content -->
      <template v-else-if="product.id">
        <div class="detail-grid">
          <!-- Gallery -->
          <div class="gallery-panel">
            <span class="gallery-flag">
              <i class="bx bx-badge-check"></i> Chính hãng 100%
            </span>
            <img :src="product.images || fallbackImage" :alt="product.title" @error="onImageError" />
            <div class="gallery-note">
              <span><i class="bx bx-package"></i> Đóng gói cẩn thận</span>
              <span><i class="bx bx-refresh"></i> Đổi trả 7 ngày</span>
            </div>
          </div>

          <!-- Info -->
          <div class="info-panel">
            <div class="info-top">
              <span class="lt-badge lt-badge-orange">{{ product.brand || "LifeTech" }}</span>
              <h1>{{ product.title }}</h1>

              <div class="info-meta">
                <span class="info-rating">
                  <i class="bx bxs-star"></i>
                  <strong>{{ product.avgRating || 0 }}</strong>
                  <small>({{ product.reviewCount || 0 }} đánh giá)</small>
                </span>
                <span class="info-divider"></span>
                <span><strong>{{ product.sold_quantity || 0 }}</strong> đã bán</span>
                <span class="info-divider"></span>
                <span v-if="inStock" class="text-success">
                  <i class="bx bx-check-circle"></i> Còn {{ stock }} sản phẩm
                </span>
                <span v-else class="text-danger">
                  <i class="bx bx-x-circle"></i> Tạm hết hàng
                </span>
              </div>
            </div>

            <div class="price-box">
              <div>
                <small>Giá bán</small>
                <strong>{{ formatCurrency(product.price) }}</strong>
              </div>
              <span class="price-vat">Đã bao gồm VAT</span>
            </div>

            <p class="info-desc">
              {{ product.description || "Sản phẩm công nghệ chính hãng, được kiểm định chất lượng trước khi giao đến tay khách hàng." }}
            </p>

            <div class="info-highlights">
              <span><i class="bx bx-check"></i> Bảo hành {{ product.warranty || 12 }} tháng</span>
              <span><i class="bx bx-check"></i> Hỗ trợ trả góp 0%</span>
              <span><i class="bx bx-check"></i> Miễn phí giao hàng đơn từ 500K</span>
            </div>

            <router-link class="ai-compare-link" :to="`/web/so-sanh?ids=${product.id}`">
              <i class="bx bx-git-compare"></i>
              <span>So sánh mẫu này với máy khác bằng AI</span>
              <i class="bx bx-right-arrow-alt"></i>
            </router-link>

            <div class="buy-row">
              <div class="qty-stepper">
                <button type="button" aria-label="Giảm số lượng" :disabled="quantity <= 1" @click="changeQuantity(-1)">
                  <i class="bx bx-minus"></i>
                </button>
                <input v-model.number="quantity" type="number" min="1" :max="stock || 1" aria-label="Số lượng"
                  @change="normalizeQuantity" />
                <button type="button" aria-label="Tăng số lượng" :disabled="!inStock || quantity >= stock"
                  @click="changeQuantity(1)">
                  <i class="bx bx-plus"></i>
                </button>
              </div>

              <button type="button" class="lt-btn lt-btn-outline lt-btn-lg" :disabled="!inStock || adding"
                @click="addToCart(false)">
                <i class="bx bxs-cart-add"></i>
                {{ adding ? "Đang thêm..." : "Thêm vào giỏ" }}
              </button>

              <button type="button" class="lt-btn lt-btn-primary lt-btn-lg" :disabled="!inStock || adding"
                @click="addToCart(true)">
                Mua ngay <i class="bx bx-right-arrow-alt"></i>
              </button>
            </div>

            <div class="assurance">
              <div class="assurance-item">
                <i class="bx bx-shield-quarter"></i>
                <div><strong>Bảo hành chính hãng</strong><small>Theo tiêu chuẩn nhà sản xuất.</small></div>
              </div>
              <div class="assurance-item">
                <i class="bx bx-wallet"></i>
                <div><strong>Thanh toán an toàn</strong><small>QR ngân hàng, thẻ, ví điện tử.</small></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <section class="tabs-panel">
          <div class="tabs-head">
            <button v-for="tab in tabs" :key="tab.key" type="button" class="tab-btn"
              :class="{ 'is-active': activeTab === tab.key }" @click="activeTab = tab.key">
              {{ tab.label }}
            </button>
          </div>

          <div class="tab-body">
            <!-- Specs -->
            <div v-if="activeTab === 'specs'">
              <ul v-if="specs.length" class="spec-list">
                <li v-for="(spec, index) in specs" :key="index">
                  <span>{{ spec.key }}</span>
                  <strong>{{ spec.value }}</strong>
                </li>
              </ul>
              <div v-else class="tab-empty">
                <i class="bx bx-info-circle"></i>
                <p>Thông số kỹ thuật đang được cập nhật.</p>
              </div>
            </div>

            <!-- Description -->
            <div v-else-if="activeTab === 'description'" class="description-content">
              <p>{{ product.description || "Sản phẩm chưa có mô tả chi tiết. Vui lòng liên hệ tư vấn viên để biết thêm thông tin." }}</p>
              <div class="description-tags">
                <span><i class="bx bx-purchase-tag"></i> Thương hiệu: {{ product.brand || "Đang cập nhật" }}</span>
                <span><i class="bx bx-shield"></i> Bảo hành: {{ product.warranty || 12 }} tháng</span>
                <span><i class="bx bx-hash"></i> Mã sản phẩm: {{ product.slug || product.id }}</span>
              </div>
            </div>

            <!-- Reviews -->
            <div v-else>
              <div class="review-summary">
                <div class="review-score">
                  <strong>{{ product.avgRating || 0 }}</strong>
                  <div class="review-stars">
                    <i v-for="star in 5" :key="star" class="bx"
                      :class="star <= Math.round(product.avgRating || 0) ? 'bxs-star' : 'bx-star'"></i>
                  </div>
                  <small>{{ product.reviewCount || 0 }} đánh giá</small>
                </div>
                <p class="review-summary-note">
                  Đánh giá từ khách hàng đã mua sản phẩm tại LifeTech.
                </p>
              </div>

              <ul v-if="reviews.length" class="review-list">
                <li v-for="(review, index) in reviews" :key="review.id || index" class="review-item">
                  <span class="review-avatar">{{ reviewerInitials(review) }}</span>
                  <div class="review-content">
                    <div class="review-head">
                      <strong>{{ review.user?.name || review.user?.ho_va_ten || "Khách hàng" }}</strong>
                      <span class="review-date">{{ formatDate(review.created_at) }}</span>
                    </div>
                    <div class="review-item-stars">
                      <i v-for="star in 5" :key="star" class="bx"
                        :class="star <= (review.rating || 0) ? 'bxs-star' : 'bx-star'"></i>
                    </div>
                    <p>{{ review.comment }}</p>
                  </div>
                </li>
              </ul>
              <div v-else class="tab-empty">
                <i class="bx bx-comment-dots"></i>
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm!</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Related -->
        <section v-if="relatedProducts.length" class="related-section">
          <div class="lt-section-head">
            <div>
              <span class="lt-eyebrow">Có thể bạn thích</span>
              <h2 class="lt-section-title">Sản phẩm tương tự</h2>
            </div>
            <router-link to="/web/san-pham" class="lt-btn lt-btn-outline">
              Xem tất cả <i class="bx bx-right-arrow-alt"></i>
            </router-link>
          </div>
          <div class="related-grid">
            <ProductCard v-for="item in relatedProducts" :key="item.id" :product="item" @add="addRelatedToCart" />
          </div>
        </section>
      </template>

      <!-- Not found -->
      <div v-else class="lt-empty">
        <span class="lt-empty-icon"><i class="bx bx-error-circle"></i></span>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>Sản phẩm có thể đã ngừng bán hoặc đường dẫn không hợp lệ.</p>
        <router-link to="/web/san-pham" class="lt-btn lt-btn-primary">Xem sản phẩm khác</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import ProductCard from "../ProductCard.vue";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='%23f8fafc'/%3E%3Crect x='175' y='140' width='150' height='235' rx='22' fill='none' stroke='%23cbd5e1' stroke-width='10'/%3E%3Ccircle cx='250' cy='330' r='10' fill='%23cbd5e1'/%3E%3C/svg%3E";

export default {
  components: { ProductCard },
  data() {
    return {
      loading: true,
      product: {},
      reviews: [],
      relatedProducts: [],
      activeTab: "specs",
      quantity: 1,
      adding: false,
      fallbackImage: FALLBACK_IMAGE,
      specLabels: {
        pin: "Dung lượng pin",
        cong_suat: "Hỗ trợ sạc tối đa",
        dientich: "Diện tích làm sạch",
        ketnoi: "Cổng kết nối / sạc",
        thoi_gian_sac: "Thời gian sạc",
        tinh_nang: "Tính năng",
        man_hinh: "Màn hình",
        camera: "Camera",
        chip: "Chip xử lý",
        ram: "RAM",
        storage: "Dung lượng lưu trữ",
        rom: "Bộ nhớ trong",
        he_dieu_hanh: "Hệ điều hành",
        trong_luong: "Trọng lượng",
      },
      tabs: [
        { key: "specs", label: "Thông số kỹ thuật" },
        { key: "description", label: "Mô tả sản phẩm" },
        { key: "reviews", label: "Đánh giá" },
      ],
    };
  },
  computed: {
    stock() {
      return Number(this.product.quantity) || 0;
    },
    inStock() {
      return this.stock > 0;
    },
    specs() {
      const raw = this.product.specs;
      if (!raw) return [];
      let parsed = raw;
      if (typeof raw === "string") {
        try {
          parsed = JSON.parse(raw);
        } catch (error) {
          return [];
        }
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          key: item.key || item.name || "",
          value: item.value || "",
        }));
      }
      if (typeof parsed === "object") {
        return Object.entries(parsed).map(([key, value]) => ({
          key: this.specLabels[key] || key,
          value,
        }));
      }
      return [];
    },
  },
  watch: {
    "$route.params.id"() {
      this.loadProduct();
    },
  },
  mounted() {
    this.loadProduct();
  },
  methods: {
    loadProduct() {
      const productId = this.$route.params.id;
      this.loading = true;
      this.activeTab = "specs";
      this.quantity = 1;

      api
        .get(`/admin/products/${productId}`)
        .then((res) => {
          if (res.data.status) {
            this.product = res.data.data;
            this.fetchReviews();
            this.fetchRelated();
          }
        })
        .catch((err) => console.error("Lỗi tải chi tiết sản phẩm:", err))
        .finally(() => {
          this.loading = false;
        });
    },
    fetchReviews() {
      api
        .get(`/customer/products/${this.$route.params.id}/reviews`)
        .then((res) => {
          this.reviews = res.data?.data || [];
        })
        .catch((err) => console.error("Lỗi tải đánh giá:", err));
    },
    fetchRelated() {
      api
        .get("/customer/products/data")
        .then((res) => {
          const products = res.data?.data || [];
          const sameBrand = products.filter(
            (item) =>
              item.id !== this.product.id &&
              Number(item.quantity) > 0 &&
              item.brand === this.product.brand
          );
          const others = products.filter(
            (item) =>
              item.id !== this.product.id &&
              Number(item.quantity) > 0 &&
              item.brand !== this.product.brand
          );
          this.relatedProducts = [...sameBrand, ...others].slice(0, 4);
        })
        .catch((err) => console.error("Lỗi tải sản phẩm liên quan:", err));
    },
    normalizeQuantity() {
      const max = Math.max(this.stock, 1);
      const value = Math.round(Number(this.quantity) || 1);
      this.quantity = Math.min(Math.max(value, 1), max);
    },
    changeQuantity(delta) {
      const next = this.quantity + delta;
      if (next < 1) return;
      if (this.stock && next > this.stock) {
        this.$toast.warning("Bạn đã chọn tối đa số lượng tồn kho.");
        return;
      }
      this.quantity = next;
    },
    addToCart(redirectToCart) {
      const token = localStorage.getItem("users_login");
      if (!token) {
        this.$toast.warning("Vui lòng đăng nhập để mua sản phẩm.");
        this.$router.push("/dang-nhap");
        return;
      }

      this.adding = true;
      api
        .post(
          "/customer/gio-hang/add",
          { product_id: this.product.id, quantity: this.quantity },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then(() => {
          this.$toast.success("Đã thêm sản phẩm vào giỏ hàng!");
          window.dispatchEvent(new Event("cart:updated"));
          if (redirectToCart) this.$router.push("/web/gio-hang");
        })
        .catch((err) => {
          console.error("Lỗi thêm giỏ hàng:", err);
          this.$toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
        })
        .finally(() => {
          this.adding = false;
        });
    },
    addRelatedToCart(product) {
      const token = localStorage.getItem("users_login");
      if (!token) {
        this.$toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
        this.$router.push("/dang-nhap");
        return;
      }
      api
        .post(
          "/customer/gio-hang/add",
          { product_id: product.id, quantity: 1 },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then(() => {
          this.$toast.success("Đã thêm sản phẩm vào giỏ hàng!");
          window.dispatchEvent(new Event("cart:updated"));
        })
        .catch((err) => console.error("Lỗi thêm giỏ hàng:", err));
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(Number(value) || 0);
    },
    formatDate(value) {
      if (!value) return "";
      return new Date(value).toLocaleDateString("vi-VN");
    },
    reviewerInitials(review) {
      const name = review.user?.name || review.user?.ho_va_ten || "KH";
      return name
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    },
    onImageError(event) {
      event.target.src = FALLBACK_IMAGE;
    },
  },
};
</script>

<style scoped>
.detail-page {
  padding-top: 20px;
}

.breadcrumb-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--lt-muted);
  margin-bottom: 18px;
  flex-wrap: wrap;
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

.breadcrumb-line span {
  color: var(--lt-ink-soft);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}

.detail-skeleton-image {
  aspect-ratio: 1 / 0.9;
  border-radius: var(--lt-radius-lg);
}

.detail-skeleton-info {
  padding-top: 10px;
}

.skeleton-line {
  height: 16px;
  margin-bottom: 14px;
}

.skeleton-line.lg {
  height: 34px;
  width: 85%;
}

.skeleton-line.short {
  width: 55%;
}

.skeleton-block {
  height: 140px;
  border-radius: var(--lt-radius);
  margin-top: 20px;
}

/* ================= GALLERY ================= */
.gallery-panel {
  position: relative;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius-lg);
  padding: 28px;
  box-shadow: var(--lt-shadow-sm);
}

.gallery-panel img {
  width: 100%;
  height: 460px;
  object-fit: contain;
}

.gallery-flag {
  position: absolute;
  top: 18px;
  left: 18px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--lt-orange-soft);
  border: 1px solid var(--lt-orange-line);
  color: var(--lt-orange-dark);
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 999px;
}

.gallery-flag i {
  font-size: 14px;
}

.gallery-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px dashed var(--lt-line);
  font-size: 12px;
  color: var(--lt-muted);
}

.gallery-note span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.gallery-note i {
  color: var(--lt-orange);
  font-size: 16px;
}

/* ================= INFO ================= */
.info-panel h1 {
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02em;
  margin: 12px 0 12px;
}

.info-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--lt-muted);
}

.info-meta strong {
  color: var(--lt-ink);
}

.info-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #b45309;
}

.info-rating i {
  color: #f59e0b;
  font-size: 16px;
}

.info-rating small {
  color: var(--lt-muted);
}

.info-divider {
  width: 1px;
  height: 14px;
  background: var(--lt-line);
}

.text-success {
  color: var(--lt-success) !important;
}

.text-danger {
  color: var(--lt-danger) !important;
}

.price-box {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin: 20px 0 16px;
  padding: 18px 22px;
  border-radius: var(--lt-radius);
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border: 1px solid var(--lt-orange-line);
}

.price-box small {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #9a3412;
  margin-bottom: 2px;
}

.price-box strong {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--lt-orange-dark);
  line-height: 1.1;
}

.price-vat {
  font-size: 11.5px;
  color: #9a3412;
  white-space: nowrap;
}

.info-desc {
  color: var(--lt-muted);
  font-size: 14px;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-highlights {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 16px 0 22px;
  font-size: 13px;
  color: var(--lt-ink-soft);
}

.info-highlights span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.info-highlights i {
  color: var(--lt-success);
  font-size: 16px;
}

.ai-compare-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px 14px;
  border: 1px dashed #fdba74;
  border-radius: 12px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.ai-compare-link i:first-child {
  font-size: 17px;
}

.ai-compare-link i:last-child {
  margin-left: 2px;
}

.ai-compare-link:hover {
  background: #ffedd5;
  border-color: var(--lt-primary, #f97316);
  color: #7c2d12;
}

.buy-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.qty-stepper {
  display: inline-flex;
  align-items: center;
  height: 48px;
  border: 1px solid var(--lt-line);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.qty-stepper button {
  width: 40px;
  height: 100%;
  border: 0;
  background: transparent;
  color: var(--lt-ink-soft);
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--lt-transition);
}

.qty-stepper button:hover:not(:disabled) {
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
}

.qty-stepper button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty-stepper input {
  width: 44px;
  height: 100%;
  border: 0;
  border-left: 1px solid var(--lt-line);
  border-right: 1px solid var(--lt-line);
  text-align: center;
  font-family: var(--lt-font);
  font-size: 14px;
  font-weight: 600;
  color: var(--lt-ink);
  outline: 0;
}

.qty-stepper input::-webkit-outer-spin-button,
.qty-stepper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.assurance {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--lt-line);
}

.assurance-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.assurance-item i {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f1f5f9;
  color: var(--lt-ink-soft);
  font-size: 18px;
}

.assurance-item strong,
.assurance-item small {
  display: block;
}

.assurance-item strong {
  font-size: 13px;
}

.assurance-item small {
  font-size: 11.5px;
  color: var(--lt-muted);
  line-height: 1.5;
}

/* ================= TABS ================= */
.tabs-panel {
  margin-top: 28px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius-lg);
  overflow: hidden;
}

.tabs-head {
  display: flex;
  gap: 4px;
  padding: 0 18px;
  border-bottom: 1px solid var(--lt-line);
  overflow-x: auto;
}

.tab-btn {
  position: relative;
  padding: 16px 14px;
  border: 0;
  background: transparent;
  font-family: var(--lt-font);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lt-muted);
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: color var(--lt-transition), border-color var(--lt-transition);
}

.tab-btn:hover {
  color: var(--lt-ink);
}

.tab-btn.is-active {
  color: var(--lt-orange-dark);
  border-bottom-color: var(--lt-orange);
}

.tab-body {
  padding: 24px;
}

.spec-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 28px;
}

.spec-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13.5px;
}

.spec-list li span {
  color: var(--lt-muted);
}

.spec-list li strong {
  text-align: right;
  color: var(--lt-ink);
  font-weight: 600;
}

.description-content p {
  color: var(--lt-ink-soft);
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 18px;
  white-space: pre-line;
}

.description-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.description-tags span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 13px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid var(--lt-line);
  font-size: 12.5px;
  color: var(--lt-ink-soft);
}

.description-tags i {
  color: var(--lt-orange);
  font-size: 15px;
}

.tab-empty {
  text-align: center;
  padding: 30px 16px;
  color: var(--lt-muted);
}

.tab-empty i {
  font-size: 34px;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}

/* ================= REVIEWS ================= */
.review-summary {
  display: flex;
  align-items: center;
  gap: 26px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--lt-line);
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.review-score {
  text-align: center;
  min-width: 120px;
}

.review-score strong {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: var(--lt-ink);
}

.review-stars {
  margin: 6px 0 4px;
  color: #f59e0b;
  font-size: 15px;
}

.review-score small {
  font-size: 12px;
  color: var(--lt-muted);
}

.review-summary-note {
  color: var(--lt-muted);
  font-size: 13.5px;
  max-width: 380px;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
}

.review-avatar {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 13px;
  font-weight: 700;
}

.review-content {
  flex: 1;
}

.review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.review-head strong {
  font-size: 13.5px;
}

.review-date {
  font-size: 11.5px;
  color: var(--lt-muted);
}

.review-item-stars {
  color: #f59e0b;
  font-size: 13px;
  margin: 2px 0 6px;
}

.review-content p {
  font-size: 13.5px;
  color: var(--lt-ink-soft);
  line-height: 1.65;
}

/* ================= RELATED ================= */
.related-section {
  margin-top: 40px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

@media (max-width: 992px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .gallery-panel img {
    height: 360px;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .gallery-panel {
    padding: 18px;
  }

  .gallery-panel img {
    height: 280px;
  }

  .buy-row .lt-btn {
    flex: 1;
  }

  .qty-stepper {
    flex-basis: 100%;
    justify-content: center;
  }

  .assurance {
    grid-template-columns: 1fr;
  }

  .spec-list {
    grid-template-columns: 1fr;
  }

  .tab-body {
    padding: 18px;
  }
}
</style>
