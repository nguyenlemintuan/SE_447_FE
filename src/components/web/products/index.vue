<template>
  <div class="lt-page">
    <div class="lt-container">
      <!-- Page head -->
      <div class="page-head">
        <nav class="breadcrumb-line">
          <router-link to="/">Trang chủ</router-link>
          <i class="bx bx-chevron-right"></i>
          <span>Sản phẩm</span>
        </nav>
        <div class="page-head-row">
          <div>
            <h1>Tất cả sản phẩm</h1>
            <p>Chọn lọc thiết bị chính hãng với mức giá tốt nhất tại LifeTech.</p>
          </div>
          <span class="page-count">{{ displayedProducts.length }} sản phẩm</span>
        </div>
      </div>

      <!-- AI search -->
      <section class="ai-search-panel">
        <div class="ai-search-head">
          <span class="ai-spark"><i class="bx bx-bulb"></i></span>
          <div>
            <h2>Tìm kiếm bằng AI</h2>
            <p>Mô tả nhu cầu bằng câu tự nhiên, AI sẽ chọn sản phẩm phù hợp nhất.</p>
          </div>
        </div>

        <form class="ai-search-form" @submit.prevent="runAiSearch">
          <i class="bx bx-search-alt-2"></i>
          <input v-model="aiQuery" type="text" :disabled="aiLoading"
            placeholder="Ví dụ: điện thoại chụp ảnh đẹp, pin trâu dưới 15 triệu" aria-label="Tìm kiếm bằng AI" />
          <button type="submit" class="lt-btn lt-btn-primary" :disabled="aiLoading || aiQuery.trim().length < 2">
            <i v-if="aiLoading" class="bx bx-loader-alt bx-spin"></i>
            <i v-else class="bx bx-bulb"></i>
            {{ aiLoading ? "AI đang phân tích..." : "Tìm bằng AI" }}
          </button>
        </form>

        <div class="ai-search-suggest">
          <span>Thử:</span>
          <button v-for="suggestion in aiSuggestions" :key="suggestion" type="button" class="ai-suggest-chip"
            :disabled="aiLoading" @click="aiQuery = suggestion">
            {{ suggestion }}
          </button>
        </div>

        <p v-if="aiError" class="ai-search-error">
          <i class="bx bx-error-circle"></i> {{ aiError }}
        </p>
      </section>

      <!-- AI result banner -->
      <div v-if="aiResult" class="ai-result-bar">
        <div class="ai-result-copy">
          <span class="ai-result-icon"><i class="bx bx-bulb"></i></span>
          <div>
            <strong>AI gợi ý {{ aiResult.products.length }} sản phẩm</strong>
            <p>{{ aiResult.summary }}</p>
          </div>
        </div>
        <button type="button" class="lt-btn lt-btn-outline" @click="clearAiSearch">
          <i class="bx bx-x"></i> Xoá kết quả AI
        </button>
      </div>

      <!-- Filter bar -->
      <div class="filter-panel">
        <div class="filter-search">
          <i class="bx bx-search"></i>
          <input v-model="searchQuery" type="search" placeholder="Tìm theo tên sản phẩm, thương hiệu..." />
          <button v-if="searchQuery" type="button" class="filter-clear" aria-label="Xoá tìm kiếm"
            @click="searchQuery = ''">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <div class="filter-selects">
          <label class="filter-select">
            <span>Sắp xếp</span>
            <select v-model="sortOrder">
              <option value="">Mặc định</option>
              <option value="asc">Giá thấp → cao</option>
              <option value="desc">Giá cao → thấp</option>
            </select>
            <i class="bx bx-chevron-down"></i>
          </label>

          <label class="filter-select">
            <span>Khoảng giá</span>
            <select v-model="priceRange">
              <option value="">Tất cả</option>
              <option value="under10">Dưới 10 triệu</option>
              <option value="10to20">10 – 20 triệu</option>
              <option value="over20">Trên 20 triệu</option>
            </select>
            <i class="bx bx-chevron-down"></i>
          </label>
        </div>
      </div>

      <div class="lt-chips category-chips">
        <button v-for="category in categoryOptions" :key="category" type="button" class="lt-chip"
          :class="{ 'is-active': activeCategory === category }" @click="activeCategory = category">
          {{ category }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="product-grid">
        <div v-for="n in 8" :key="n" class="product-skeleton">
          <div class="lt-skeleton skeleton-image"></div>
          <div class="lt-skeleton skeleton-line"></div>
          <div class="lt-skeleton skeleton-line short"></div>
        </div>
      </div>

      <!-- Products -->
      <div v-else-if="displayedProducts.length" class="product-grid">
        <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" @add="addToCart" />
      </div>

      <!-- Empty -->
      <div v-else class="lt-empty">
        <span class="lt-empty-icon"><i class="bx bx-search-alt"></i></span>
        <h3>{{ aiResult ? "AI chưa tìm thấy sản phẩm phù hợp" : "Không tìm thấy sản phẩm phù hợp" }}</h3>
        <p v-if="aiResult">Thử mô tả rõ hơn về nhu cầu và ngân sách của bạn.</p>
        <p v-else>Thử từ khoá khác hoặc bỏ bớt bộ lọc để xem thêm sản phẩm.</p>
        <button v-if="aiResult" type="button" class="lt-btn lt-btn-primary" @click="clearAiSearch">
          <i class="bx bx-refresh"></i> Xoá kết quả AI
        </button>
        <button v-else type="button" class="lt-btn lt-btn-primary" @click="resetFilters">
          <i class="bx bx-refresh"></i> Xoá bộ lọc
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import ProductCard from "../ProductCard.vue";

export default {
  components: { ProductCard },
  data() {
    return {
      products: [],
      loading: true,
      searchQuery: "",
      sortOrder: "",
      activeCategory: "Tất cả",
      priceRange: "",
      categoryOptions: ["Tất cả", "Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"],
      aiQuery: "",
      aiLoading: false,
      aiError: "",
      aiResult: null,
      aiSuggestions: [
        "Điện thoại chụp ảnh đẹp dưới 15 triệu",
        "Máy chơi game mượt, pin trâu",
        "iPhone mới nhất giá tốt",
      ],
    };
  },
  computed: {
    displayedProducts() {
      return this.aiResult ? this.aiResult.products : this.filteredProducts;
    },
    filteredProducts() {
      let result = [...this.products];

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        result = result.filter((product) => {
          const text = `${product.title || ""} ${product.brand || ""}`.toLowerCase();
          return text.includes(query);
        });
      }

      if (this.activeCategory !== "Tất cả") {
        result = result.filter((product) =>
          this.matchesCategory(product, this.activeCategory)
        );
      }

      if (this.priceRange) {
        result = result.filter((product) => {
          const price = this.convertPrice(product.price);
          if (this.priceRange === "under10") return price < 10000000;
          if (this.priceRange === "10to20") {
            return price >= 10000000 && price <= 20000000;
          }
          return price > 20000000;
        });
      }

      if (this.sortOrder) {
        result.sort((a, b) => {
          const priceA = this.convertPrice(a.price);
          const priceB = this.convertPrice(b.price);
          return this.sortOrder === "asc" ? priceA - priceB : priceB - priceA;
        });
      }

      return result;
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(query) {
        if (query.q && query.q !== this.searchQuery) {
          this.searchQuery = String(query.q);
        }
        if (query.category) {
          const category = String(query.category);
          if (this.categoryOptions.includes(category)) {
            this.activeCategory = category;
          }
        }
      },
    },
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      this.loading = true;
      api
        .get("/customer/products/data")
        .then((res) => {
          const data = res.data?.data || [];
          this.products = data.filter((product) => Number(product.quantity) > 0);
        })
        .catch((err) => {
          console.error("Lỗi tải sản phẩm:", err);
          this.products = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async runAiSearch() {
      const query = this.aiQuery.trim();
      if (query.length < 2 || this.aiLoading) return;

      this.aiLoading = true;
      this.aiError = "";

      try {
        const res = await api.post("/ai/search", { query });
        this.aiResult = {
          summary: res.data?.summary || "",
          products: res.data?.data || [],
        };
      } catch (err) {
        console.error("Lỗi tìm kiếm AI:", err);
        this.aiResult = null;
        this.aiError =
          err.response?.data?.message ||
          "AI đang bận, bạn vui lòng thử lại sau ít phút.";
        if (this.$toast) this.$toast.error(this.aiError);
      } finally {
        this.aiLoading = false;
      }
    },
    clearAiSearch() {
      this.aiResult = null;
      this.aiError = "";
    },
    convertPrice(priceRaw) {
      if (!priceRaw) return 0;
      if (typeof priceRaw === "number") return priceRaw;
      let str = String(priceRaw);
      if (str.endsWith(".00") || str.endsWith(",00")) {
        str = str.slice(0, -3);
      }
      return parseFloat(str.replace(/[^0-9]/g, "")) || 0;
    },
    matchesCategory(product, category) {
      const title = (product.title || "").toLowerCase();
      const brand = (product.brand || "").toLowerCase();
      const text = `${title} ${brand}`;
      const isTablet = /ipad|\btab\b|tablet/.test(text);
      const isLaptop = /macbook|dell|asus|\bhp\b|lenovo|acer|\bmsi\b|laptop|thinkpad/.test(text);
      const isPhone = /iphone|samsung|xiaomi|oppo|vivo|realme|redmi|pixel|nokia|sony/.test(text) && !isTablet && !isLaptop;

      if (category === "Điện thoại") return isPhone;
      if (category === "Laptop") return isLaptop;
      if (category === "Máy tính bảng") return isTablet;
      if (category === "Phụ kiện") return !isPhone && !isLaptop && !isTablet;
      return true;
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
    resetFilters() {
      this.searchQuery = "";
      this.activeCategory = "Tất cả";
      this.priceRange = "";
      this.sortOrder = "";
      if (this.$route.query.q || this.$route.query.category) {
        this.$router.replace({ path: "/web/san-pham" });
      }
    },
  },
};
</script>

<style scoped>
.page-head {
  margin-bottom: 24px;
}

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

.page-head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-head h1 {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0 0 6px;
}

.page-head p {
  color: var(--lt-muted);
  font-size: 14px;
}

.page-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
  border: 1px solid var(--lt-orange-line);
  padding: 7px 14px;
  border-radius: 999px;
}

.filter-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 16px;
  padding: 12px;
  box-shadow: var(--lt-shadow-sm);
}

.filter-search {
  position: relative;
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: #f8fafc;
  border: 1px solid transparent;
  border-radius: 11px;
  padding: 0 12px;
  height: 44px;
  transition: all var(--lt-transition);
}

.filter-search:focus-within {
  background: #fff;
  border-color: var(--lt-orange-line);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.filter-search i {
  color: var(--lt-muted);
  font-size: 18px;
}

.filter-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: var(--lt-font);
  font-size: 14px;
  color: var(--lt-ink);
}

.filter-clear {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: #e2e8f0;
  color: var(--lt-ink-soft);
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.filter-selects {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 44px;
  padding: 0 34px 0 14px;
  border: 1px solid var(--lt-line);
  border-radius: 11px;
  background: #fff;
  font-size: 13px;
  color: var(--lt-ink-soft);
  cursor: pointer;
}

.filter-select span {
  color: var(--lt-muted);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.filter-select select {
  border: 0;
  outline: 0;
  background: transparent;
  font-family: var(--lt-font);
  font-size: 13px;
  font-weight: 600;
  color: var(--lt-ink);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  max-width: 150px;
}

.filter-select i {
  position: absolute;
  right: 10px;
  color: var(--lt-muted);
  font-size: 17px;
  pointer-events: none;
}

.category-chips {
  margin: 18px 0 22px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.product-skeleton {
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 18px;
  padding: 16px;
}

.skeleton-image {
  aspect-ratio: 1 / 0.82;
  border-radius: 12px;
  margin-bottom: 14px;
}

.skeleton-line {
  height: 14px;
  margin-bottom: 10px;
}

.skeleton-line.short {
  width: 60%;
}

@media (max-width: 1100px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 820px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-selects {
    width: 100%;
  }

  .filter-select {
    flex: 1;
    min-width: 0;
  }

  .filter-select select {
    max-width: none;
    width: 100%;
  }
}

@media (max-width: 560px) {
  .page-head-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .product-grid {
    gap: 12px;
  }

  .filter-panel {
    padding: 10px;
  }

  .filter-search {
    min-width: 100%;
  }

  .filter-selects {
    flex-direction: column;
  }
}

/* ============ AI SEARCH ============ */
.ai-search-panel {
  position: relative;
  margin-bottom: 18px;
  padding: 20px;
  border-radius: var(--lt-radius-lg);
  border: 1px solid var(--lt-orange-line);
  background: linear-gradient(135deg, #fff7ef, #fff 55%);
  box-shadow: var(--lt-shadow-sm);
}

.ai-search-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.ai-spark {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  box-shadow: 0 10px 24px -10px rgba(249, 115, 22, 0.7);
}

.ai-search-head h2 {
  margin: 0 0 3px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.ai-search-head p {
  margin: 0;
  font-size: 13px;
  color: var(--lt-muted);
}

.ai-search-form {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 14px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 13px;
  transition: all var(--lt-transition);
}

.ai-search-form:focus-within {
  border-color: var(--lt-orange-line);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.ai-search-form > i {
  font-size: 19px;
  color: var(--lt-orange);
}

.ai-search-form input {
  flex: 1;
  min-width: 0;
  height: 38px;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: var(--lt-font);
  font-size: 14px;
}

.ai-search-form .lt-btn {
  flex: none;
}

.ai-search-suggest {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 11px;
  font-size: 12.5px;
  color: var(--lt-muted);
}

.ai-suggest-chip {
  padding: 5px 11px;
  border: 1px solid var(--lt-line);
  border-radius: 999px;
  background: #fff;
  color: var(--lt-ink-soft);
  font-family: var(--lt-font);
  font-size: 12.5px;
  cursor: pointer;
  transition: all var(--lt-transition);
}

.ai-suggest-chip:hover {
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
  border-color: var(--lt-orange-line);
}

.ai-search-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--lt-danger);
}

.ai-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid var(--lt-orange-line);
  background: linear-gradient(135deg, #fff7ef, #fff);
}

.ai-result-copy {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.ai-result-icon {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 19px;
  color: #fff;
  background: var(--lt-orange);
}

.ai-result-copy strong {
  display: block;
  margin-bottom: 2px;
  font-size: 14px;
}

.ai-result-copy p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--lt-muted);
}

.ai-result-bar .lt-btn {
  flex: none;
}

@media (max-width: 720px) {
  .ai-search-form {
    flex-wrap: wrap;
    padding: 10px;
  }

  .ai-search-form input {
    flex: 1 1 100%;
    width: 100%;
  }

  .ai-search-form .lt-btn {
    width: 100%;
    justify-content: center;
  }

  .ai-result-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
