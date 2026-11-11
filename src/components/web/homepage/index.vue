<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero">
      <div class="lt-container hero-grid">
        <div class="hero-copy">
          <span class="lt-eyebrow">
            <i class="fa-solid fa-bold"></i> LifeTech • Công nghệ chính hãng
          </span>
          <h1>
            Công nghệ xịn,<br />
            giá <span>luôn tốt.</span>
          </h1>
          <p class="hero-desc">
            Hàng ngàn mẫu điện thoại, laptop và thiết bị thông minh chính hãng —
            giao nhanh, bảo hành minh bạch, hỗ trợ đổi trả trong 7 ngày.
          </p>

          <div class="hero-actions">
            <router-link to="/web/san-pham" class="lt-btn lt-btn-primary lt-btn-lg">
              Khám phá sản phẩm <i class="bx bx-right-arrow-alt"></i>
            </router-link>
            <a href="#uu-dai" class="lt-btn lt-btn-outline lt-btn-lg">
              <i class="bx bxs-purchase-tag-alt"></i> Xem ưu đãi
            </a>
          </div>

          <ul class="hero-trust">
            <li><i class="bx bx-check-shield"></i> Bảo hành 12 tháng</li>
            <li><i class="bx bx-refresh"></i> Đổi trả 7 ngày</li>
            <li><i class="bx bx-rocket"></i> Giao nhanh 2 giờ</li>
          </ul>
        </div>

        <div class="hero-visual">
          <div class="hero-box"></div>
          <div class="hero-card">
            <span class="hero-card-tag">Bán chạy nhất</span>
            <img :src="heroProduct.images || heroFallback" :alt="heroProduct.title" />
            <div class="hero-card-info">
              <small>{{ heroProduct.title }}</small>
              <strong>{{ formatCurrency(heroProduct.price) }}</strong>
            </div>
          </div>
          <div class="hero-chip hero-chip-top">
            <i class="bx bxs-star"></i>
            <div>
              <strong>4.9/5</strong>
              <small>Đánh giá thật</small>
            </div>
          </div>
          <div class="hero-chip hero-chip-bottom">
            <i class="bx bx-package"></i>
            <div>
              <strong>Miễn phí ship</strong>
              <small>Đơn từ 500K</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="lt-container home-section">
      <div class="category-grid">
        <button v-for="category in categories" :key="category.label" type="button" class="category-card"
          @click="goToCategory(category.label)">
          <span class="category-icon"><i :class="category.icon"></i></span>
          <span class="category-text">
            <strong>{{ category.label }}</strong>
            <small>{{ category.count }} sản phẩm</small>
          </span>
          <i class="bx bx-right-arrow-alt category-arrow"></i>
        </button>
      </div>
    </section>

    <!-- AI HUB -->
    <section class="lt-container home-section">
      <div class="ai-hub">
        <div class="ai-hub-head">
          <span class="lt-eyebrow"><i class="bx bx-bulb"></i> Trợ lý AI LifeTech</span>
          <h2>Mua điện thoại nhanh hơn với AI</h2>
          <p>Tìm bằng câu nói tự nhiên, so sánh máy và nhận gợi ý đúng nhu cầu.</p>
        </div>
        <div class="ai-hub-grid">
          <router-link to="/web/san-pham" class="ai-hub-card">
            <span class="ai-hub-icon"><i class="bx bx-search-alt-2"></i></span>
            <strong>Tìm kiếm tự nhiên</strong>
            <small>"Máy chụp ảnh đẹp dưới 20 triệu"</small>
          </router-link>
          <router-link to="/web/so-sanh" class="ai-hub-card">
            <span class="ai-hub-icon"><i class="bx bx-git-compare"></i></span>
            <strong>So sánh bằng AI</strong>
            <small>Đặt 2–3 máy cạnh nhau, AI kết luận</small>
          </router-link>
          <router-link to="/web/goi-y" class="ai-hub-card">
            <span class="ai-hub-icon"><i class="bx bx-bulb"></i></span>
            <strong>Gợi ý theo nhu cầu</strong>
            <small>Chơi game, pin trâu, học tập, mỏng nhẹ...</small>
          </router-link>
        </div>
      </div>
    </section>

    <!-- FEATURED -->
    <section class="lt-container home-section">
      <div class="lt-section-head">
        <div>
          <span class="lt-eyebrow">Gợi ý cho bạn</span>
          <h2 class="lt-section-title">Sản phẩm nổi bật</h2>
          <p class="lt-section-sub">Lựa chọn được khách hàng quan tâm nhiều nhất tuần này.</p>
        </div>
        <router-link to="/web/san-pham" class="lt-btn lt-btn-outline">
          Xem tất cả <i class="bx bx-right-arrow-alt"></i>
        </router-link>
      </div>

      <div v-if="loading" class="product-grid">
        <div v-for="n in 8" :key="n" class="product-skeleton">
          <div class="lt-skeleton skeleton-image"></div>
          <div class="lt-skeleton skeleton-line"></div>
          <div class="lt-skeleton skeleton-line short"></div>
        </div>
      </div>

      <div v-else class="product-grid">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" @add="addToCart" />
      </div>
    </section>

    <!-- PROMO + SERVICES -->
    <section id="uu-dai" class="lt-container home-section">
      <div class="promo-grid">
        <div class="promo-banner">
          <div class="promo-content">
            <span class="promo-eyebrow">Ưu đãi thành viên mới</span>
            <h2>Giảm 10% cho đơn hàng đầu tiên</h2>
            <p>Nhập mã <b>SALE10</b> khi thanh toán để nhận ưu đãi.</p>
            <div class="promo-actions">
              <button type="button" class="promo-code" @click="copyCode('SALE10')">
                SALE10 <i class="bx bx-copy"></i>
              </button>
              <router-link to="/web/san-pham" class="lt-btn lt-btn-dark">
                Mua ngay
              </router-link>
            </div>
          </div>
          <span class="promo-box"></span>
        </div>

        <div class="service-grid">
          <div v-for="service in services" :key="service.title" class="service-card">
            <span class="service-icon"><i :class="service.icon"></i></span>
            <div>
              <strong>{{ service.title }}</strong>
              <p>{{ service.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VOUCHERS -->
    <section class="lt-container home-section">
      <div class="lt-section-head">
        <div>
          <span class="lt-eyebrow">Săn mã giảm giá</span>
          <h2 class="lt-section-title">Voucher hôm nay</h2>
        </div>
        <router-link to="/web/gio-hang" class="lt-btn lt-btn-outline">
          Áp dụng tại giỏ hàng <i class="bx bx-right-arrow-alt"></i>
        </router-link>
      </div>

      <div class="voucher-grid">
        <article v-for="voucher in vouchers" :key="voucher.code" class="voucher-card">
          <div class="voucher-stub">
            <span class="voucher-code">{{ voucher.code }}</span>
            <small>{{ voucher.hint }}</small>
          </div>
          <div class="voucher-body">
            <strong>{{ voucher.title }}</strong>
            <p>{{ voucher.desc }}</p>
            <button type="button" class="voucher-copy" @click="copyCode(voucher.code)">
              <i class="bx bx-copy"></i> Sao chép mã
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/api";
import ProductCard from "../ProductCard.vue";

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    price: 34990000,
    quantity: 12,
    sold_quantity: 128,
    avgRating: 4.9,
    reviewCount: 86,
    images: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 31990000,
    quantity: 8,
    sold_quantity: 95,
    avgRating: 4.8,
    reviewCount: 64,
    images: "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-5g-600x600.jpg",
  },
  {
    id: 3,
    title: "Xiaomi 14",
    brand: "Xiaomi",
    price: 20990000,
    quantity: 15,
    sold_quantity: 72,
    avgRating: 4.7,
    reviewCount: 41,
    images: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/b/i/xiaomi-14-pre-xanh-la.png",
  },
  {
    id: 4,
    title: "iPhone 13 128GB",
    brand: "Apple",
    price: 14990000,
    quantity: 20,
    sold_quantity: 210,
    avgRating: 4.8,
    reviewCount: 132,
    images: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2021_9_15_637673230231791121_iphone-13-mini-den-1.jpg",
  },
  {
    id: 5,
    title: "Samsung Galaxy Z Flip5",
    brand: "Samsung",
    price: 21990000,
    quantity: 6,
    sold_quantity: 48,
    avgRating: 4.6,
    reviewCount: 27,
    images: "https://cdn.tgdd.vn/Products/Images/42/299250/samsung-galaxy-z-flip5-mint-thumbnew-600x600.jpg",
  },
  {
    id: 6,
    title: "Redmi Note 13 5G",
    brand: "Xiaomi",
    price: 5490000,
    quantity: 30,
    sold_quantity: 320,
    avgRating: 4.5,
    reviewCount: 190,
    images: "https://product.hstatic.net/200000547251/product/13-5g-xanh_14c991e3fcfd43c0a054c80dec71fxcx.png",
  },
  {
    id: 7,
    title: "Samsung Galaxy A54 5G",
    brand: "Samsung",
    price: 9990000,
    quantity: 18,
    sold_quantity: 156,
    avgRating: 4.6,
    reviewCount: 88,
    images: "https://cdn.tgdd.vn/Products/Images/42/250103/samsung-galaxy-a54-thumb-den-600x600.jpg",
  },
  {
    id: 8,
    title: "POCO X6 Pro 5G",
    brand: "Xiaomi",
    price: 7990000,
    quantity: 4,
    sold_quantity: 64,
    avgRating: 4.7,
    reviewCount: 35,
    images: "https://cdn2.cellphones.com.vn/b/media/catalog/product/b/i/xiaomi-poco-x6-5g-8gb-256gb-1_2.png",
  },
];

export default {
  components: { ProductCard },
  data() {
    return {
      loading: true,
      products: [],
      categories: [
        { label: "Điện thoại", icon: "bx bx-mobile-alt", count: 0 },
        { label: "Laptop", icon: "bx bx-laptop", count: 0 },
        { label: "Máy tính bảng", icon: "bx bx-tab", count: 0 },
        { label: "Phụ kiện", icon: "bx bx-headphone", count: 0 },
      ],
      vouchers: [
        {
          code: "SALE10",
          hint: "Đơn từ 500K",
          title: "Giảm 10% toàn bộ đơn hàng",
          desc: "Áp dụng cho khách hàng mới, tối đa 500.000đ.",
        },
        {
          code: "SALE500K",
          hint: "Đơn từ 5 triệu",
          title: "Giảm trực tiếp 500.000đ",
          desc: "Số lượng có hạn trong hôm nay.",
        },
        {
          code: "FREESHIP",
          hint: "Toàn quốc",
          title: "Miễn phí vận chuyển",
          desc: "Giảm tối đa 50.000đ phí giao hàng.",
        },
      ],
      services: [
        {
          icon: "bx bx-package",
          title: "Giao hàng 2 giờ",
          desc: "Nội thành Đà Nẵng, Hà Nội, TP.HCM.",
        },
        {
          icon: "bx bx-check-shield",
          title: "Chính hãng 100%",
          desc: "Bảo hành theo tiêu chuẩn hãng.",
        },
        {
          icon: "bx bx-refresh",
          title: "Đổi trả 7 ngày",
          desc: "Miễn phí đổi mới nếu lỗi NSX.",
        },
        {
          icon: "bx bx-support",
          title: "Hỗ trợ 24/7",
          desc: "Tư vấn viên luôn sẵn sàng.",
        },
      ],
      heroFallback:
        "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
    };
  },
  computed: {
    heroProduct() {
      return (
        this.products.find((item) => Number(item.quantity) > 0) ||
        this.products[0] ||
        FALLBACK_PRODUCTS[0]
      );
    },
    featuredProducts() {
      return this.products.slice(0, 8);
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
          this.products = data.length ? data : FALLBACK_PRODUCTS;
          this.updateCategoryCounts();
        })
        .catch((err) => {
          console.error("Lỗi tải sản phẩm:", err);
          this.products = FALLBACK_PRODUCTS;
          this.updateCategoryCounts();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateCategoryCounts() {
      const counts = this.categories.reduce((acc, category) => {
        if (category.label === "Phụ kiện") {
          const phoneTaxletLaptop = /iphone|samsung|xiaomi|oppo|vivo|realme|redmi|nokia|macbook|dell|asus|hp|lenovo|acer|msi|laptop|ipad|tab|tablet/;
          acc[category.label] = this.products.filter((product) => {
            const title = (product.title || "").toLowerCase();
            return !phoneTaxletLaptop.test(title);
          }).length;
          return acc;
        }
        acc[category.label] = this.products.filter((product) =>
          this.matchesCategory(product, category.label)
        ).length;
        return acc;
      }, {});
      this.categories = this.categories.map((category) => ({
        ...category,
        count: counts[category.label] || 0,
      }));
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
      return false;
    },
    goToCategory(label) {
      this.$router.push({ path: "/web/san-pham", query: { category: label } });
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(Number(value) || 0);
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
    copyCode(code) {
      const done = () => this.$toast.success(`Đã sao chép mã ${code}`);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(done);
      } else {
        done();
      }
    },
  },
};
</script>

<style scoped>
.home-page {
  padding-bottom: 8px;
}

/* ================= HERO ================= */
.hero {
  padding: 40px 0 12px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 48px;
}

.hero-copy h1 {
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
  margin: 18px 0 16px;
}

.hero-copy h1 span {
  color: var(--lt-orange);
}

.hero-desc {
  max-width: 480px;
  color: var(--lt-muted);
  font-size: 15.5px;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 30px 0 0;
  font-size: 13px;
  color: var(--lt-ink-soft);
  font-weight: 500;
}

.hero-trust li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.hero-trust i {
  color: var(--lt-orange);
  font-size: 17px;
}

.hero-visual {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-box {
  position: absolute;
  inset: 4% 6%;
  border-radius: 44% 56% 62% 38% / 45% 45% 55% 55%;
  background: linear-gradient(135deg, #ffe6cf, #ffd1a6 45%, #fde3c8);
  filter: blur(2px);
}

.hero-card {
  position: relative;
  width: min(360px, 82%);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  padding: 26px 26px 20px;
  box-shadow: 0 30px 70px rgba(120, 53, 15, 0.16);
  text-align: center;
}

.hero-card-tag {
  position: absolute;
  top: 18px;
  left: 18px;
  background: var(--lt-ink);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
}

.hero-card img {
  width: 100%;
  height: 280px;
  object-fit: contain;
  filter: drop-shadow(0 22px 26px rgba(15, 23, 42, 0.18));
}

.hero-card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  background: #fff;
  border-radius: 14px;
  padding: 11px 14px;
  margin-top: 10px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.hero-card-info small {
  font-size: 12.5px;
  color: var(--lt-ink-soft);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-card-info strong {
  font-size: 14.5px;
  color: var(--lt-orange-dark);
  white-space: nowrap;
}

.hero-chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
}

.hero-chip i {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 17px;
}

.hero-chip strong,
.hero-chip small {
  display: block;
  line-height: 1.3;
}

.hero-chip strong {
  font-size: 13px;
}

.hero-chip small {
  font-size: 11.5px;
  color: var(--lt-muted);
}

.hero-chip-top {
  top: 8%;
  left: 0;
}

.hero-chip-bottom {
  right: 0;
  bottom: 26%;
}

/* ================= SECTIONS ================= */
.home-section {
  margin-top: 56px;
}

.ai-hub {
  display: grid;
  grid-template-columns: 1.05fr 1.6fr;
  gap: 28px;
  align-items: center;
  padding: 30px 34px;
  border: 1px solid #fed7aa;
  border-radius: 24px;
  background:
    radial-gradient(600px 200px at 0% 0%, rgba(249, 115, 22, 0.12), transparent 70%),
    linear-gradient(135deg, #fff7ed 0%, #ffffff 60%);
}

.ai-hub-head h2 {
  margin: 10px 0 6px;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--lt-ink);
}

.ai-hub-head p {
  color: var(--lt-muted);
  font-size: 14px;
  line-height: 1.6;
}

.ai-hub-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.ai-hub-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 16px;
  border: 1px solid var(--lt-line);
  border-radius: 16px;
  background: #fff;
  text-decoration: none;
  transition: all var(--lt-transition);
}

.ai-hub-card:hover {
  border-color: var(--lt-orange-line);
  box-shadow: 0 12px 26px rgba(249, 115, 22, 0.12);
  transform: translateY(-2px);
}

.ai-hub-card:active {
  transform: translateY(0);
}

.ai-hub-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 21px;
  margin-bottom: 6px;
}

.ai-hub-card strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--lt-ink);
}

.ai-hub-card small {
  font-size: 12px;
  line-height: 1.5;
  color: var(--lt-muted);
}

@media (max-width: 992px) {
  .ai-hub {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

@media (max-width: 640px) {
  .ai-hub-grid {
    grid-template-columns: 1fr;
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  padding: 20px;
  border: 1px solid var(--lt-line);
  border-radius: 18px;
  background: #fff;
  cursor: pointer;
  transition: all var(--lt-transition);
}

.category-card:hover {
  border-color: var(--lt-orange-line);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.category-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 25px;
}

.category-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-text strong {
  font-size: 14.5px;
  color: var(--lt-ink);
}

.category-text small {
  font-size: 12px;
  color: var(--lt-muted);
}

.category-arrow {
  margin-left: auto;
  color: #cbd5e1;
  font-size: 20px;
  transition: all var(--lt-transition);
}

.category-card:hover .category-arrow {
  color: var(--lt-orange);
  transform: translateX(3px);
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

/* ================= PROMO ================= */
.promo-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
}

.promo-banner {
  position: relative;
  overflow: hidden;
  border-radius: var(--lt-radius-lg);
  padding: 38px;
  background: linear-gradient(120deg, #f97316, #ea580c 55%, #c2410c);
  color: #fff;
  min-height: 260px;
  display: flex;
  align-items: center;
}

.promo-content {
  position: relative;
  z-index: 1;
  max-width: 400px;
}

.promo-eyebrow {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffedd5;
}

.promo-banner h2 {
  color: #fff;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin: 12px 0 10px;
}

.promo-banner p {
  color: #ffedd5;
  font-size: 14px;
  margin-bottom: 22px;
}

.promo-banner p b {
  color: #fff;
}

.promo-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.promo-code {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1.5px dashed rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 11px;
  padding: 10px 16px;
  font-family: var(--lt-font);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background var(--lt-transition), transform var(--lt-transition);
}

.promo-code:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-1px);
}

.promo-code:active {
  transform: translateY(1px) scale(0.98);
}

.promo-box {
  position: absolute;
  right: -70px;
  bottom: -110px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}

.promo-box::after {
  content: "";
  position: absolute;
  inset: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.service-card {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 16px;
  padding: 18px;
}

.service-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 21px;
}

.service-card strong {
  display: block;
  font-size: 13.5px;
  margin-bottom: 3px;
}

.service-card p {
  color: var(--lt-muted);
  font-size: 12.5px;
  line-height: 1.55;
}

/* ================= VOUCHERS ================= */
.voucher-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.voucher-card {
  display: flex;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 16px;
  overflow: hidden;
  transition: all var(--lt-transition);
}

.voucher-card:hover {
  border-color: var(--lt-orange-line);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.voucher-stub {
  width: 116px;
  flex-shrink: 0;
  background: linear-gradient(150deg, #fff7ed, #ffedd5);
  border-right: 1.5px dashed #fdba74;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 16px 10px;
  text-align: center;
}

.voucher-code {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--lt-orange-dark);
}

.voucher-stub small {
  font-size: 10.5px;
  color: #c2410c;
}

.voucher-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.voucher-body strong {
  font-size: 13.5px;
  line-height: 1.4;
}

.voucher-body p {
  font-size: 12px;
  color: var(--lt-muted);
  line-height: 1.5;
}

.voucher-copy {
  margin-top: auto;
  padding-top: 8px;
  border: 0;
  background: none;
  color: var(--lt-orange-dark);
  font-family: var(--lt-font);
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  align-self: flex-start;
}

.voucher-copy:hover {
  text-decoration: underline;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 1180px) {
  .hero-grid {
    gap: 30px;
  }

  .category-grid,
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .voucher-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 992px) {
  .hero {
    padding-top: 26px;
  }

  .hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-desc {
    margin: 0 auto;
  }

  .hero-actions,
  .hero-trust {
    justify-content: center;
  }

  .hero-visual {
    min-height: 380px;
  }

  .category-grid {
    grid-template-columns: 1fr 1fr;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .promo-grid {
    grid-template-columns: 1fr;
  }

  .promo-banner {
    padding: 30px;
  }
}

@media (max-width: 640px) {
  .home-section {
    margin-top: 40px;
  }

  .hero-chip-top {
    top: 0;
    left: -6px;
  }

  .hero-chip-bottom {
    right: -6px;
    bottom: 2%;
  }

  .hero-chip {
    padding: 8px 11px;
  }

  .hero-card {
    padding: 20px 18px 16px;
  }

  .hero-card img {
    height: 220px;
  }

  .category-grid {
    gap: 10px;
  }

  .category-card {
    padding: 14px;
    gap: 10px;
  }

  .category-icon {
    width: 42px;
    height: 42px;
    font-size: 21px;
  }

  .category-arrow {
    display: none;
  }

  .product-grid {
    gap: 12px;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }

  .voucher-grid {
    grid-template-columns: 1fr;
  }
}
</style>
