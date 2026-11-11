<template>
  <div class="lt-page">
    <div class="lt-container">
      <nav class="breadcrumb-line">
        <router-link to="/">Trang chủ</router-link>
        <i class="bx bx-chevron-right"></i>
        <router-link to="/web/san-pham">Sản phẩm</router-link>
        <i class="bx bx-chevron-right"></i>
        <span>So sánh AI</span>
      </nav>

      <div class="page-head">
        <span class="lt-eyebrow"><i class="bx bx-git-compare"></i> Trợ lý AI</span>
        <h1>So sánh điện thoại bằng AI</h1>
        <p>Chọn 2–3 sản phẩm, AI sẽ phân tích thông số, ưu nhược điểm và gợi ý chiếc máy phù hợp nhất.</p>
      </div>

      <!-- Picker -->
      <section class="lt-panel picker-panel">
        <div class="picker-head">
          <h2><span>1</span> Chọn sản phẩm</h2>
          <span class="picker-count" :class="{ 'is-full': selected.length === 3 }">
            {{ selected.length }}/3 đã chọn
          </span>
        </div>

        <div v-if="loadingProducts" class="picker-grid">
          <div v-for="n in 6" :key="n" class="lt-skeleton picker-skeleton"></div>
        </div>

        <div v-else class="picker-grid">
          <button v-for="product in products" :key="product.id" type="button" class="pick-card"
            :class="{ 'is-selected': isSelected(product.id), 'is-locked': !isSelected(product.id) && selected.length >= 3 }"
            @click="toggleProduct(product.id)">
            <img :src="product.images || fallbackImage" :alt="product.title" loading="lazy" @error="onImageError" />
            <span class="pick-info">
              <strong>{{ product.title }}</strong>
              <small>{{ product.brand }}</small>
              <b>{{ formatVND(product.price) }}</b>
            </span>
            <span class="pick-check"><i class="bx bx-check"></i></span>
          </button>
        </div>

        <div class="picker-actions">
          <p v-if="error" class="picker-error"><i class="bx bx-error-circle"></i> {{ error }}</p>
          <button type="button" class="lt-btn lt-btn-outline" :disabled="!selected.length || loading"
            @click="resetSelection">
            <i class="bx bx-reset"></i> Bỏ chọn
          </button>
          <button type="button" class="lt-btn lt-btn-primary" :disabled="selected.length < 2 || loading"
            @click="runCompare">
            <i v-if="loading" class="bx bx-loader-alt bx-spin"></i>
            <i v-else class="bx bx-bulb"></i>
            {{ loading ? "AI đang phân tích..." : "So sánh bằng AI" }}
          </button>
        </div>
      </section>

      <!-- Results -->
      <div v-if="result" ref="result" class="compare-result">
        <section class="lt-panel table-panel">
          <h2 class="block-title"><span>2</span> Bảng so sánh</h2>

          <div class="compare-table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th v-for="product in result.products" :key="product.id">
                    <img :src="product.images || fallbackImage" :alt="product.title" @error="onImageError" />
                    <strong>{{ product.title }}</strong>
                    <small>{{ product.brand }}</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Giá bán</th>
                  <td v-for="product in result.products" :key="product.id" class="is-price">
                    {{ formatVND(product.price) }}
                  </td>
                </tr>
                <tr>
                  <th>Bảo hành</th>
                  <td v-for="product in result.products" :key="product.id">
                    {{ product.warranty || 12 }} tháng
                  </td>
                </tr>
                <tr>
                  <th>Đánh giá</th>
                  <td v-for="product in result.products" :key="product.id">
                    {{ product.avgRating ? `${product.avgRating}/5` : "Chưa có" }}
                    <small v-if="product.reviewCount">({{ product.reviewCount }})</small>
                  </td>
                </tr>
                <tr v-for="key in specKeys" :key="key">
                  <th>{{ specLabel(key) }}</th>
                  <td v-for="product in result.products" :key="product.id">
                    {{ specValue(product, key) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="result.ai" class="ai-verdict">
          <div class="verdict-head">
            <span class="verdict-icon"><i class="bx bx-bulb"></i></span>
            <div>
              <h2>AI kết luận</h2>
              <p>{{ result.ai.summary }}</p>
            </div>
          </div>

          <div v-if="winner" class="winner-banner">
            <i class="bx bx-trophy"></i>
            <div>
              <strong>Lựa chọn tổng thể: {{ winner.title }}</strong>
              <small>{{ formatVND(winner.price) }} · {{ winner.brand }}</small>
            </div>
          </div>

          <div class="verdict-grid">
            <article v-for="product in result.products" :key="product.id" class="verdict-card">
              <h3>{{ product.title }}</h3>

              <p v-if="result.ai.best_for[product.id]" class="best-for">
                <i class="bx bx-target-lock"></i>
                {{ result.ai.best_for[product.id] }}
              </p>

              <div v-if="pointsOf(result.ai.pros, product.id).length" class="point-list is-pros">
                <strong><i class="bx bx-like"></i> Ưu điểm</strong>
                <ul>
                  <li v-for="(point, index) in pointsOf(result.ai.pros, product.id)" :key="index">{{ point }}</li>
                </ul>
              </div>

              <div v-if="pointsOf(result.ai.cons, product.id).length" class="point-list is-cons">
                <strong><i class="bx bx-dislike"></i> Hạn chế</strong>
                <ul>
                  <li v-for="(point, index) in pointsOf(result.ai.cons, product.id)" :key="index">{{ point }}</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section v-else class="ai-unavailable">
          <i class="bx bx-wifi-off"></i>
          <div>
            <strong>AI tạm thời chưa phản hồi</strong>
            <p>Bảng so sánh vẫn hiển thị đầy đủ. Bạn thử lại sau ít phút để xem nhận xét của AI.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f8fafc'/%3E%3Crect x='140' y='110' width='120' height='190' rx='18' fill='none' stroke='%23cbd5e1' stroke-width='8'/%3E%3Ccircle cx='200' cy='265' r='8' fill='%23cbd5e1'/%3E%3C/svg%3E";

const specLabels = {
  storage: "Bộ nhớ trong",
  ram: "RAM",
  screen: "Màn hình",
  display: "Màn hình",
  battery: "Pin",
  chip: "Chip xử lý",
  cpu: "CPU",
  camera: "Camera",
  weight: "Trọng lượng",
  os: "Hệ điều hành",
};

export default {
  name: "AiComparePage",
  data() {
    return {
      products: [],
      selected: [],
      loadingProducts: true,
      loading: false,
      error: "",
      result: null,
      fallbackImage,
    };
  },
  computed: {
    specKeys() {
      if (!this.result) return [];
      const keys = new Set();
      this.result.products.forEach((product) => {
        Object.keys(product.specs || {}).forEach((key) => keys.add(key));
      });
      return [...keys];
    },
    winner() {
      if (!this.result?.ai?.winner_id) return null;
      return this.result.products.find((product) => product.id === this.result.ai.winner_id) || null;
    },
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      this.loadingProducts = true;
      api
        .get("/customer/products/data")
        .then((res) => {
          this.products = (res.data?.data || []).filter(
            (product) => Number(product.quantity) > 0
          );
          this.applyQueryPreset();
        })
        .catch((err) => {
          console.error("Lỗi tải sản phẩm:", err);
          this.error = "Không tải được danh sách sản phẩm.";
        })
        .finally(() => {
          this.loadingProducts = false;
        });
    },
    applyQueryPreset() {
      const raw = this.$route.query.ids;
      if (!raw) return;

      const ids = String(raw)
        .split(",")
        .map((id) => Number(id))
        .filter(Boolean);

      const valid = this.products
        .filter((product) => ids.includes(product.id))
        .map((product) => product.id)
        .slice(0, 3);

      this.selected = valid;
    },
    isSelected(id) {
      return this.selected.includes(id);
    },
    toggleProduct(id) {
      if (this.isSelected(id)) {
        this.selected = this.selected.filter((item) => item !== id);
        return;
      }

      if (this.selected.length >= 3) {
        if (this.$toast) this.$toast.info("Chỉ so sánh tối đa 3 sản phẩm.");
        return;
      }

      this.selected = [...this.selected, id];
      this.error = "";
    },
    resetSelection() {
      this.selected = [];
      this.result = null;
      this.error = "";
    },
    async runCompare() {
      if (this.selected.length < 2 || this.loading) return;

      this.loading = true;
      this.error = "";

      try {
        const res = await api.post("/ai/compare", { product_ids: this.selected });
        this.result = {
          products: res.data?.data || [],
          ai: res.data?.ai || null,
        };
        this.$nextTick(() => {
          this.$refs.result?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch (err) {
        console.error("Lỗi so sánh AI:", err);
        this.result = null;
        this.error =
          err.response?.data?.message ||
          "AI đang bận, bạn vui lòng thử lại sau ít phút.";
        if (this.$toast) this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    specValue(product, key) {
      return product.specs?.[key] ?? "—";
    },
    specLabel(key) {
      return specLabels[key] || key;
    },
    pointsOf(group, id) {
      const value = group?.[id];
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    },
    formatVND(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(Number(value) || 0);
    },
    onImageError(event) {
      event.target.src = fallbackImage;
    },
  },
};
</script>

<style scoped>
.breadcrumb-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 12.5px;
  color: var(--lt-muted);
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
  margin-bottom: 22px;
}

.page-head h1 {
  margin: 8px 0 6px;
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.025em;
}

.page-head p {
  margin: 0;
  max-width: 640px;
  color: var(--lt-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* Picker */
.picker-panel {
  padding: 20px;
}

.picker-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.picker-head h2,
.block-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.picker-head h2 span,
.block-title span {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 13px;
  color: #fff;
  background: var(--lt-orange);
}

.picker-count {
  padding: 6px 13px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
  border: 1px solid var(--lt-orange-line);
}

.picker-count.is-full {
  color: var(--lt-success);
  background: var(--lt-success-soft);
  border-color: #c6ecd4;
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.picker-skeleton {
  height: 84px;
  border-radius: 14px;
}

.pick-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 34px 10px 10px;
  border: 1px solid var(--lt-line);
  border-radius: 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  font-family: var(--lt-font);
  transition: all var(--lt-transition);
}

.pick-card:hover {
  border-color: var(--lt-orange-line);
  box-shadow: var(--lt-shadow-sm);
}

.pick-card.is-selected {
  border-color: var(--lt-orange);
  background: var(--lt-orange-soft);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
}

.pick-card.is-locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.pick-card img {
  flex: none;
  width: 58px;
  height: 58px;
  object-fit: contain;
  border-radius: 10px;
  background: #f6f8fb;
}

.pick-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.pick-info strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--lt-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pick-info small {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lt-muted);
}

.pick-info b {
  font-size: 12.5px;
  color: var(--lt-orange-dark);
}

.pick-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  color: transparent;
  border: 1.5px solid var(--lt-line);
  background: #fff;
  transition: all var(--lt-transition);
}

.pick-card.is-selected .pick-check {
  color: #fff;
  background: var(--lt-orange);
  border-color: var(--lt-orange);
}

.picker-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.picker-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto 0 0;
  font-size: 13px;
  color: var(--lt-danger);
}

/* Results */
.compare-result {
  margin-top: 20px;
  scroll-margin-top: 110px;
}

.table-panel {
  padding: 20px;
}

.compare-table-wrap {
  margin-top: 14px;
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  font-size: 13.5px;
}

.compare-table th,
.compare-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--lt-line);
  text-align: left;
  vertical-align: top;
}

.compare-table thead th {
  background: #fafbfc;
  border-bottom: 1px solid var(--lt-line);
  font-weight: 700;
}

.compare-table thead th:first-child {
  border-top-left-radius: 12px;
}

.compare-table thead th:last-child {
  border-top-right-radius: 12px;
}

.compare-table thead th img {
  display: block;
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 6px;
  border-radius: 10px;
  background: #fff;
}

.compare-table thead th strong {
  display: block;
  font-size: 13.5px;
  line-height: 1.4;
}

.compare-table thead th small {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lt-orange-dark);
}

.compare-table tbody th {
  width: 170px;
  font-weight: 600;
  color: var(--lt-ink-soft);
  background: #fcfcfd;
}

.compare-table tbody tr:last-child th,
.compare-table tbody tr:last-child td {
  border-bottom: 0;
}

.compare-table td.is-price {
  font-weight: 800;
  color: var(--lt-orange-dark);
}

.compare-table td small {
  color: var(--lt-muted);
}

/* AI verdict */
.ai-verdict {
  margin-top: 20px;
  padding: 22px;
  border-radius: var(--lt-radius-lg);
  border: 1px solid var(--lt-orange-line);
  background: linear-gradient(135deg, #fff7ef, #fff 60%);
}

.verdict-head {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.verdict-icon {
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  box-shadow: 0 10px 24px -10px rgba(249, 115, 22, 0.7);
}

.verdict-head h2 {
  margin: 0 0 5px;
  font-size: 18px;
  font-weight: 800;
}

.verdict-head p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--lt-ink-soft);
}

.winner-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 13px 16px;
  border-radius: 14px;
  border: 1px dashed var(--lt-orange-line);
  background: #fff;
}

.winner-banner i {
  font-size: 24px;
  color: var(--lt-orange);
}

.winner-banner strong {
  display: block;
  font-size: 14px;
}

.winner-banner small {
  font-size: 12.5px;
  color: var(--lt-muted);
}

.verdict-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.verdict-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--lt-line);
  background: #fff;
}

.verdict-card h3 {
  margin: 0 0 8px;
  font-size: 14.5px;
  font-weight: 700;
}

.best-for {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0 0 12px;
  padding: 9px 11px;
  border-radius: 10px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
}

.best-for i {
  font-size: 15px;
  margin-top: 1px;
}

.point-list {
  margin-top: 10px;
}

.point-list strong {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.point-list.is-pros strong {
  color: var(--lt-success);
}

.point-list.is-cons strong {
  color: var(--lt-danger);
}

.point-list ul {
  margin: 6px 0 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--lt-ink-soft);
}

.point-list li + li {
  margin-top: 3px;
}

.ai-unavailable {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid var(--lt-line);
  background: #fff;
}

.ai-unavailable > i {
  font-size: 28px;
  color: var(--lt-muted);
}

.ai-unavailable strong {
  display: block;
  font-size: 14px;
}

.ai-unavailable p {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--lt-muted);
}

@media (max-width: 640px) {
  .picker-panel,
  .table-panel {
    padding: 15px;
  }

  .picker-actions {
    justify-content: stretch;
  }

  .picker-actions .lt-btn {
    flex: 1;
    justify-content: center;
  }

  .picker-error {
    flex: 1 1 100%;
    margin: 0 0 4px;
  }
}
</style>
