<template>
  <div class="container-fluid">
    <!-- Thanh lọc -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row g-2 align-items-center">

              <div class="col-12 col-md-6">
                <div class="position-relative">
                  <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control ps-5"
                    placeholder="Tìm kiếm sản phẩm..." />
                  <span class="position-absolute top-50 start-0 translate-middle-y ps-2">
                    <i class="bx bx-search"></i>
                  </span>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="dropdown w-100">
                  <button class="btn btn-white w-100 text-start dropdown-toggle" type="button"
                    data-bs-toggle="dropdown">
                    {{ sortLabel }}
                  </button>
                  <ul class="dropdown-menu w-100">
                    <li><a class="dropdown-item" href="#" @click.prevent="setSort('')">Tất cả</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="setSort('asc')">Giá thấp đến cao</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="setSort('desc')">Giá cao đến thấp</a></li>
                  </ul>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="dropdown w-100">
                  <button class="btn btn-white w-100 text-start dropdown-toggle" type="button"
                    data-bs-toggle="dropdown">
                    {{ priceRangeLabel }}
                  </button>
                  <ul class="dropdown-menu w-100">
                    <li><a class="dropdown-item" href="#" @click.prevent="setPriceRange('')">Tất cả</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="setPriceRange('under10')">Dưới 10 triệu</a>
                    </li>
                    <li><a class="dropdown-item" href="#" @click.prevent="setPriceRange('10to20')">10 - 20 triệu</a>
                    </li>
                    <li><a class="dropdown-item" href="#" @click.prevent="setPriceRange('over20')">Trên 20 triệu</a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="row mt-5">
      <div v-for="(product, index) in filteredProducts" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card shadow-sm border-0 rounded position-relative" style="cursor: pointer"
          @click="$router.push(`/web/chi-tiet-san-pham/${product.id}`)">
          <div class="card-body text-center">
            <img :src="product.images" alt="" class="img-fluid rounded" style="width: 120px; height: 120px" />
            <div class="position-absolute top-0 end-0 m-3 product-discount">
              <span>-10%</span>
            </div>
            <p class="fw-bold mt-2">{{ product.title }}</p>
            <div class="clearfix">
              <p class="mb-0 float-start">
                <strong>{{ product.sold_quantity }}</strong> Sales
              </p>
              <p class="mb-0 float-end fw-bold">
                <span class="me-2 text-decoration-line-through text-secondary">
                  {{ formatCurrency(product.price * (1 + 0.1)) }}
                </span>
                <span>{{ formatCurrency(product.price) }}</span>
              </p>
            </div>
            <div class="d-flex align-items-center mt-3 fs-6">
              <div class="cursor-pointer">
                <i v-for="star in 5" :key="star" :class="[
                  'bx',
                  star <= product.avgRating
                    ? 'bxs-star text-warning'
                    : 'bxs-star text-secondary',
                ]"></i>
              </div>
              <p class="mb-0 ms-auto">
                {{ product.avgRating }} ({{ product.reviewCount }})
              </p>
            </div>
            <!-- Hàng nút hành động -->
            <button class="btn btn-primary mb-2" @click.stop="buyNow(product)">
              Mua ngay
            </button>

            <div class="action-row">
              <button type="button" class="btn btn-secondary" @click.stop.prevent="addToCart(product)">
                🛒 Thêm giỏ hàng
              </button>
              <button class="btn btn-secondary" @click.stop="goToRating(product)">
                ⭐ Đánh giá
              </button>
            </div>

            <!-- Đánh giá sao -->
            <!-- <div class="rating mt-2">
              <i
                v-for="star in 5"
                :key="star"
                :class="[
                  'bx',
                  star <= product.avgRating ? 'bxs-star' : 'bx-star',
                ]"
              ></i>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Chat Box -->
  <div class="row mt-5">
    <div class="col-lg-12">
      <ChatBox />
    </div>
  </div>
</template>

<script>
import api from "@/api";
import ChatBox from "../../chat/ChatBox.vue";

export default {
  components: { ChatBox },
  data() {
    return {
      products: [],
      searchQuery: "",
      sortOrder: "",
      category: "",
      priceRange: "",
    };
  },
  computed: {
    sortLabel() {
      if (this.sortOrder === "asc") return "Giá thấp đến cao";
      if (this.sortOrder === "desc") return "Giá cao đến thấp";
      return "Sắp xếp theo";
    },
    categoryLabel() {
      return this.category || "Loại sản phẩm";
    },
    priceRangeLabel() {
      if (this.priceRange === "under10") return "Dưới 10 triệu";
      if (this.priceRange === "10to20") return "10 - 20 triệu";
      if (this.priceRange === "over20") return "Trên 20 triệu";
      return "Khoảng giá";
    },

    filteredProducts() {
      // Copy mảng để tránh lỗi tham chiếu
      let result = [...this.products];

      // 1. Lọc sản phẩm còn hàng
      result = result.filter((p) => p.quantity > 0);

      // 2. Lọc theo từ khóa tìm kiếm
      // Lưu ý: "sumsung" viết sai chính tả sẽ KHÔNG tìm ra "Samsung" (đây là logic chuẩn của lập trình căn bản)
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        result = result.filter((p) => p.title.toLowerCase().includes(query));
      }

      // 3. Lọc theo danh mục (SỬA LỖI LOGIC)
      // 4. Lọc theo danh mục (LOGIC MỚI: DỰA VÀO TÊN SẢN PHẨM)
      // 4. Lọc theo danh mục (SỬA LẠI LOGIC CHẶT CHẼ HƠN)
      if (this.category) {
        const cat = this.category;
        result = result.filter((p) => {
          const title = p.title.toLowerCase();

          // Điều kiện dùng chung: Không phải là tablet (không chứa tab, pad, tablet, ipad)
          const isNotTablet = !["tab", "pad", "tablet", "ipad"].some(
            (keyword) => title.includes(keyword)
          );

          if (cat === "Điện thoại") {
            const isPhoneBrand = [
              "iphone",
              "samsung",
              "oppo",
              "xiaomi",
              "vivo",
              "realme",
              "redmi",
              "sony",
              "pixel",
            ].some((keyword) => title.includes(keyword));

            return isPhoneBrand && isNotTablet;
          }

          if (cat === "Laptop") {
            const isLaptopBrand = [
              "macbook",
              "dell",
              "asus",
              "hp",
              "msi",
              "acer",
              "lenovo",
              "thinkpad",
              "surface",
            ].some((keyword) => title.includes(keyword));

            // SỬA Ở ĐÂY: Laptop cũng phải thỏa mãn điều kiện không phải Tablet
            return isLaptopBrand && isNotTablet;
          }

          if (cat === "Máy tính bảng") {
            return ["ipad", "tab", "pad", "tablet"].some((keyword) =>
              title.includes(keyword)
            );
          }

          return true;
        });
      }

      // 4. Lọc theo khoảng giá (SỬA LỖI PARSE GIÁ)
      if (this.priceRange) {
        result = result.filter((p) => {
          const price = this.convertPrice(p.price); // Sử dụng hàm chuyển đổi giá
          if (this.priceRange === "under10") return price < 10000000;
          if (this.priceRange === "10to20")
            return price >= 10000000 && price <= 20000000;
          if (this.priceRange === "over20") return price > 20000000;
          return true;
        });
      }

      // 5. Sắp xếp (SỬA LỖI PARSE GIÁ)
      if (this.sortOrder) {
        result.sort((a, b) => {
          const priceA = this.convertPrice(a.price);
          const priceB = this.convertPrice(b.price);
          if (this.sortOrder === "asc") return priceA - priceB;
          if (this.sortOrder === "desc") return priceB - priceA;
          return 0;
        });
      }

      return result;
    },
  },

  mounted() {
    this.fetchProducts();
  },

  methods: {
    // --- HÀM MỚI: CHUYỂN ĐỔI GIÁ TIỀN ---
    // Giúp xử lý giá dạng "32.990.000" thành số 32990000 để tính toán
    convertPrice(priceRaw) {
      if (!priceRaw) return 0;

      // 1. Nếu đã là số (Number) thì trả về luôn, không cần xử lý chuỗi
      if (typeof priceRaw === "number") return priceRaw;

      // 2. Nếu là chuỗi, xử lý các trường hợp đặc biệt
      let str = String(priceRaw);

      // Nếu chuỗi kết thúc bằng .00 hoặc ,00 (đơn vị xu/hào) -> Cắt bỏ đi để tránh bị nhân 100
      if (str.endsWith(".00") || str.endsWith(",00")) {
        str = str.substring(0, str.length - 3);
      }

      // Xóa hết các ký tự không phải số (dấu chấm, phẩy, chữ đ...)
      const cleanString = str.replace(/[^0-9]/g, "");
      return parseFloat(cleanString);
    },
    // --- HÀM FORMAT TIỀN TỆ ---
    formatCurrency(value) {
      if (!value) return "0 đ";
      // Chuyển đổi giá trị về số chuẩn trước khi format
      const numberValue = this.convertPrice(value);

      // Làm tròn số (tránh lỗi hiển thị .001)
      const roundedValue = Math.round(numberValue);

      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(roundedValue);
    },

    async fetchProducts() {
      try {
        const res = await api.get("/customer/products/data", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("users_login"),
          },
        });
        this.products = res.data.data;

        // --- DEBUG: In ra để xem cấu trúc dữ liệu ---
        if (this.products.length > 0) {
          console.log("🔥 Dữ liệu 1 sản phẩm mẫu:", this.products[0]);
          console.log(
            "👉 Tên trường danh mục có thể là: category_name, category_id, type..."
          );
          console.log("👉 Giá tiền gốc (chưa xử lý):", this.products[0].price);
        }
        // --------------------------------------------
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      }
    },

    async addToCart(product) {
      try {
        await api.post(
          "/customer/gio-hang/add",
          { product_id: product.id, quantity: 1 },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("users_login"),
            },
          }
        );
        this.$toast.success("Đã thêm vào giỏ hàng!");
      } catch (err) {
        console.error(err);
      }
    },

    goToRating(product) {
      this.$router.push(`/web/danh-gia/${product.id}`);
    },
    setSort(order) {
      this.sortOrder = order;
    },
    setCategory(cat) {
      this.category = cat;
    },
    setPriceRange(range) {
      this.priceRange = range;
    },
    applyFilters() { },

    formatCurrency(value) {
      if (!value) return "0 đ";
      // Đảm bảo value là số trước khi format hiển thị
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(this.convertPrice(value));
    },

    async buyNow(product) {
      // ... (Giữ nguyên logic cũ của bạn)
      try {
        const payload = { items: [{ product_id: product.id, quantity: 1 }] };
        const res = await api.post("/khach-hang/order/them-don-hang", payload, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("users_login"),
          },
        });
        this.$router.push({
          path: "/web/dat-hang",
          query: { reload: Date.now() },
        });
      } catch (err) {
        console.error("Lỗi tạo đơn hàng:", err);
      }
    },
  },
};
</script>

<style>
/* ==== TOÀN TRANG ==== */
.container-fluid {
  background-color: #fafafa;
  padding: 40px 3%;
}

/* ==== CARD SẢN PHẨM ==== */
.card {
  background: #fff;
  border: none;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: visible;
  text-align: center;
  height: 100%;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* ==== ẢNH SẢN PHẨM ==== */
.card-body img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.card:hover img {
  transform: scale(1.05);
}

/* ==== TÊN & GIÁ ==== */
.card-body p.fw-bold {
  font-size: 1rem;
  color: #222;
  font-weight: 600;
  margin: 8px 0 4px;
  min-height: 45px;
}

.card-body p.fw-bold:hover {
  color: #f97316;
}

.card-body span {
  color: #ef4444;
  font-weight: 600;
  font-size: 1rem;
}

/* ==== NÚT HÀNH ĐỘNG ==== */
.card .btn {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 100%;
}

.card .btn-primary {
  background-color: #f97316;
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(249, 115, 22, 0.3);
}

.card .btn-primary:hover {
  background-color: #ea580c;
}

.card .btn-secondary {
  background-color: #f3f4f6;
  border: none;
  color: #111;
}

.card .btn-secondary:hover {
  background-color: #e5e7eb;
}

/* ==== ĐÁNH GIÁ ==== */
.rating {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  margin-top: 6px;
  color: #fbbf24;
}

.rating i {
  font-size: 16px;
}

/* ==== GIẢM GIÁ ==== */
.product-discount span {
  background: #ef4444;
  color: #fff;
  padding: 3px 7px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* ==== BỐ CỤC NÚT DƯỚI ==== */
.action-row {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.action-row .btn {
  flex: 1;
}

/* ==== RESPONSIVE ==== */
@media (max-width: 576px) {
  .card-body img {
    height: 160px;
  }

  .action-row {
    flex-direction: column;
  }
}
</style>
