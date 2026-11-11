<template>
  <div class="lt-page">
    <div class="lt-container">
      <nav class="breadcrumb-line">
        <router-link to="/">Trang chủ</router-link>
        <i class="bx bx-chevron-right"></i>
        <router-link to="/web/san-pham">Sản phẩm</router-link>
        <i class="bx bx-chevron-right"></i>
        <span>Gợi ý AI</span>
      </nav>

      <div class="page-head">
        <span class="lt-eyebrow"><i class="bx bx-bulb"></i> Trợ lý AI</span>
        <h1>Gợi ý sản phẩm theo nhu cầu</h1>
        <p>Nói cho AI biết bạn cần gì, ngân sách bao nhiêu — LifeTech sẽ chọn giúp bạn chiếc máy phù hợp nhất.</p>
      </div>

      <!-- Form -->
      <section class="lt-panel need-panel">
        <div class="need-head">
          <span class="need-icon"><i class="bx bx-chat"></i></span>
          <div>
            <h2>Nhu cầu của bạn</h2>
            <p>Càng mô tả cụ thể, gợi ý càng chính xác.</p>
          </div>
        </div>

        <form @submit.prevent="runRecommend">
          <textarea v-model="needsText" rows="3" :disabled="loading"
            placeholder="Ví dụ: Mình cần máy chơi game mượt, pin lâu, chụp ảnh đẹp, tầm 15 triệu..."
            aria-label="Mô tả nhu cầu"></textarea>

          <div class="quick-needs">
            <span>Nhu cầu nhanh:</span>
            <button v-for="item in quickNeeds" :key="item.label" type="button" class="quick-need"
              :class="{ 'is-active': selectedQuick.includes(item.label) }" :disabled="loading"
              @click="toggleQuick(item.label)">
              <i class="bx" :class="item.icon"></i> {{ item.label }}
            </button>
          </div>

          <div class="need-bottom">
            <label class="budget-field">
              <span>Ngân sách</span>
              <select v-model="budget" :disabled="loading">
                <option value="">Chưa giới hạn</option>
                <option value="8000000">Dưới 8 triệu</option>
                <option value="15000000">Khoảng 15 triệu</option>
                <option value="20000000">Khoảng 20 triệu</option>
                <option value="30000000">Khoảng 30 triệu</option>
                <option value="50000000">Trên 30 triệu</option>
              </select>
              <i class="bx bx-chevron-down"></i>
            </label>

            <button type="submit" class="lt-btn lt-btn-primary lt-btn-lg"
              :disabled="loading || finalNeeds.length < 5">
              <i v-if="loading" class="bx bx-loader-alt bx-spin"></i>
              <i v-else class="bx bx-bulb"></i>
              {{ loading ? "AI đang chọn máy..." : "Gợi ý cho tôi" }}
            </button>
          </div>

          <p v-if="error" class="need-error"><i class="bx bx-error-circle"></i> {{ error }}</p>
        </form>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="rec-loading">
        <div class="lt-skeleton rec-loading-bar"></div>
        <div class="product-grid">
          <div v-for="n in 3" :key="n" class="product-skeleton">
            <div class="lt-skeleton skeleton-image"></div>
            <div class="lt-skeleton skeleton-line"></div>
            <div class="lt-skeleton skeleton-line short"></div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <template v-else-if="result">
        <div class="rec-summary">
          <span class="rec-summary-icon"><i class="bx bx-bulb"></i></span>
          <div>
            <strong>AI gợi ý cho bạn</strong>
            <p>{{ result.summary }}</p>
          </div>
        </div>

        <div v-if="result.items.length" class="rec-grid">
          <div v-for="item in result.items" :key="item.id" class="rec-item">
            <ProductCard :product="item" @add="addToCart" />
            <div class="rec-reason">
              <span class="rec-score">
                <i class="bx bx-check-shield"></i> Phù hợp {{ item.match_score }}%
              </span>
              <p>{{ item.reason }}</p>
            </div>
          </div>
        </div>

        <div v-else class="lt-empty">
          <span class="lt-empty-icon"><i class="bx bx-search-alt"></i></span>
          <h3>Chưa có sản phẩm thật sự phù hợp</h3>
          <p>Thử nới ngân sách hoặc mô tả lại nhu cầu để AI tư vấn chính xác hơn.</p>
          <router-link to="/web/san-pham" class="lt-btn lt-btn-primary">
            <i class="bx bx-store-alt"></i> Xem tất cả sản phẩm
          </router-link>
        </div>
      </template>

      <!-- Intro -->
      <div v-else class="rec-hints">
        <div class="rec-hint">
          <i class="bx bx-devices"></i>
          <strong>Đúng nhu cầu</strong>
          <p>AI đối chiếu thông số, mô tả và giá của từng sản phẩm đang bán.</p>
        </div>
        <div class="rec-hint">
          <i class="bx bx-wallet"></i>
          <strong>Đúng ngân sách</strong>
          <p>Ưu tiên các máy nằm trong khoảng giá bạn chọn.</p>
        </div>
        <div class="rec-hint">
          <i class="bx bx-time-five"></i>
          <strong>Nhanh, gọn</strong>
          <p>Chỉ cần vài câu mô tả, không phải tự lọc hàng chục mẫu máy.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import ProductCard from "../ProductCard.vue";

export default {
  name: "AiRecommendPage",
  components: { ProductCard },
  data() {
    return {
      needsText: "",
      selectedQuick: [],
      budget: "",
      loading: false,
      error: "",
      result: null,
      quickNeeds: [
        { label: "Chơi game", icon: "bx-joystick" },
        { label: "Chụp ảnh đẹp", icon: "bx-camera" },
        { label: "Pin trâu", icon: "bx-battery" },
        { label: "Học tập / văn phòng", icon: "bx-laptop" },
        { label: "Mỏng nhẹ", icon: "bx-pen" },
        { label: "Giá rẻ", icon: "bx-purchase-tag" },
      ],
    };
  },
  computed: {
    finalNeeds() {
      return [this.needsText.trim(), ...this.selectedQuick]
        .filter(Boolean)
        .join(", ");
    },
  },
  methods: {
    toggleQuick(label) {
      this.selectedQuick = this.selectedQuick.includes(label)
        ? this.selectedQuick.filter((item) => item !== label)
        : [...this.selectedQuick, label];
    },
    async runRecommend() {
      if (this.finalNeeds.length < 5 || this.loading) return;

      this.loading = true;
      this.error = "";
      this.result = null;

      try {
        const res = await api.post("/ai/recommend", {
          needs: this.finalNeeds,
          budget: this.budget ? Number(this.budget) : null,
        });

        this.result = {
          summary: res.data?.summary || "",
          items: res.data?.data || [],
        };
      } catch (err) {
        console.error("Lỗi gợi ý AI:", err);
        this.error =
          err.response?.data?.message ||
          "AI đang bận, bạn vui lòng thử lại sau ít phút.";
        if (this.$toast) this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    addToCart(product) {
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
        .catch((err) => {
          console.error("Lỗi thêm giỏ hàng:", err);
          this.$toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
        });
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

/* Form */
.need-panel {
  padding: 22px;
  border-color: var(--lt-orange-line);
  background: linear-gradient(135deg, #fff7ef, #fff 55%);
}

.need-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.need-icon {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 21px;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  box-shadow: 0 10px 24px -10px rgba(249, 115, 22, 0.7);
}

.need-head h2 {
  margin: 0 0 3px;
  font-size: 17px;
  font-weight: 800;
}

.need-head p {
  margin: 0;
  font-size: 13px;
  color: var(--lt-muted);
}

.need-panel textarea {
  width: 100%;
  resize: vertical;
  min-height: 92px;
  padding: 13px 15px;
  border: 1px solid var(--lt-line);
  border-radius: 13px;
  background: #fff;
  font-family: var(--lt-font);
  font-size: 14px;
  line-height: 1.6;
  color: var(--lt-ink);
  outline: 0;
  transition: all var(--lt-transition);
}

.need-panel textarea:focus {
  border-color: var(--lt-orange-line);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.quick-needs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  font-size: 12.5px;
  color: var(--lt-muted);
}

.quick-need {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--lt-line);
  border-radius: 999px;
  background: #fff;
  color: var(--lt-ink-soft);
  font-family: var(--lt-font);
  font-size: 12.5px;
  cursor: pointer;
  transition: all var(--lt-transition);
}

.quick-need i {
  font-size: 15px;
}

.quick-need:hover {
  color: var(--lt-orange-dark);
  border-color: var(--lt-orange-line);
}

.quick-need.is-active {
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
  border-color: var(--lt-orange);
}

.need-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.budget-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
}

.budget-field span {
  font-size: 12px;
  font-weight: 600;
  color: var(--lt-ink-soft);
}

.budget-field select {
  height: 42px;
  padding: 0 34px 0 13px;
  border: 1px solid var(--lt-line);
  border-radius: 11px;
  background: #fff;
  font-family: var(--lt-font);
  font-size: 13.5px;
  color: var(--lt-ink);
  outline: 0;
  appearance: none;
  cursor: pointer;
}

.budget-field select:focus {
  border-color: var(--lt-orange-line);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.budget-field > i {
  position: absolute;
  right: 11px;
  bottom: 13px;
  font-size: 15px;
  color: var(--lt-muted);
  pointer-events: none;
}

.need-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--lt-danger);
}

/* Results */
.rec-summary {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-top: 20px;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid var(--lt-orange-line);
  background: linear-gradient(135deg, #fff7ef, #fff);
}

.rec-summary-icon {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 20px;
  color: #fff;
  background: var(--lt-orange);
}

.rec-summary strong {
  display: block;
  margin-bottom: 3px;
  font-size: 14px;
}

.rec-summary p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--lt-ink-soft);
}

.rec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.rec-item {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rec-reason {
  flex: 1;
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--lt-orange-line);
  background: var(--lt-orange-soft);
}

.rec-score {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--lt-orange-dark);
}

.rec-reason p {
  margin: 5px 0 0;
  font-size: 12.8px;
  line-height: 1.55;
  color: var(--lt-ink-soft);
}

.rec-loading {
  margin-top: 20px;
}

.rec-loading-bar {
  height: 74px;
  border-radius: 16px;
  margin-bottom: 16px;
}

/* Hints */
.rec-hints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.rec-hint {
  padding: 18px;
  border-radius: var(--lt-radius);
  border: 1px solid var(--lt-line);
  background: #fff;
}

.rec-hint i {
  font-size: 25px;
  color: var(--lt-orange);
}

.rec-hint strong {
  display: block;
  margin: 9px 0 4px;
  font-size: 14px;
}

.rec-hint p {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--lt-muted);
}

@media (max-width: 640px) {
  .need-panel {
    padding: 16px;
  }

  .need-bottom {
    flex-direction: column;
    align-items: stretch;
  }

  .need-bottom .lt-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
