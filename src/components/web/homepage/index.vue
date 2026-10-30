<template>
  <div>

    <!-- HERO -->
    <div class="mt-3">

      <div id="banner" class="carousel slide carousel-fade shadow-lg rounded-4 overflow-hidden position-relative"
        data-bs-ride="carousel">

        <div class="carousel-inner">

          <div class="carousel-item active">
            <img src="https://www.trikart.com/media/wysiwyg/iPhone_XS_W1_2.jpg" class="hero-img">

            <div class="hero-overlay">
              <h2 style="color:cadetblue;">Siêu Sale Điện Thoại 🔥</h2>
              <p>Giảm tới 50% toàn bộ smartphone</p>
              <button class="btn btn-warning btn-lg rounded-pill">
                Mua ngay
              </button>
            </div>
          </div>

          <div class="carousel-item">
            <img src="https://photo.salekit.com/uploads/salekit_393b5dd8b53bcc4f7439610ecc840709/banner1111.png"
              class="hero-img">
          </div>

          <div class="carousel-item">
            <img src="https://hadjimitsis.com/image/cache/catalog/home-page-slider/2025/s25ultra-1920x500.jpg"
              class="hero-img">
          </div>

        </div>

        <button class="carousel-control-prev" data-bs-target="#banner" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>

        <button class="carousel-control-next" data-bs-target="#banner" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>

      </div>
    </div>

    <!-- FLASH -->
    <div class="mt-4 flash-wrapper">
      <div class="flash-text">
        🔥 FLASH SALE hôm nay — Giảm đến 50% toàn bộ sản phẩm 🔥
      </div>
    </div>

    <!-- PRODUCTS -->
    <div class="mt-4">

      <h4 class="fw-bold mb-4">🔥 Sản phẩm nổi bật</h4>

      <div class="row g-4">

        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6" v-for="p in products" :key="p.id">

          <div class="card phone-card h-100 text-center">

            <div class="discount-badge">-20%</div>

            <img :src="p.img" class="phone-img">

            <div class="card-body d-flex flex-column">

              <h6 class="fw-bold">{{ p.name }}</h6>

              <div class="text-danger fw-bold fs-5 mb-2">
                {{ format(p.price) }}
              </div>

              <button class="btn btn-gradient mt-auto">
                🛒 Thêm vào giỏ
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- VOUCHER -->
      <h4 class="fw-bold mt-5 mb-4">🎁 Voucher hot</h4>

      <div class="row g-4">

        <div class="col-lg-3 col-md-4 col-6" v-for="v in vouchers" :key="v.code">

          <div class="card voucher-modern text-center h-100">

            <img :src="v.img" class="voucher-modern-img">

            <div class="card-body">

              <h6 class="fw-bold">{{ v.name }}</h6>

              <span class="badge bg-dark mb-2">{{ v.code }}</span>

              <div class="text-success fw-bold fs-5">
                {{ v.value }}
              </div>

              <button class="btn btn-success w-100 mt-2">
                Áp dụng
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- CHAT FLOAT -->
    <ChatBox class="chat-float" />

  </div>
</template>

<script>
import api from "@/api";
import ChatBox from "../../chat/ChatBox.vue";
export default {
  components: { ChatBox },
  data() {
    return {

      products: [
        { id: 1, name: "iPhone 15 Pro Max", price: 34990000, img: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg" },
        { id: 2, name: "Samsung S24 Ultra", price: 31990000, img: "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-5g-600x600.jpg" },
        { id: 3, name: "Xiaomi 14", price: 20990000, img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-pre-xanh-la.png" },
        { id: 4, name: "iPhone 13", price: 14990000, img: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2021_9_15_637673230231791121_iphone-13-mini-den-1.jpg" },
        { id: 5, name: "Galaxy Z Flip5", price: 21990000, img: "https://cdn.tgdd.vn/Products/Images/42/299250/samsung-galaxy-z-flip5-mint-thumbnew-600x600.jpg" },
        { id: 6, name: "Redmi Note 13", price: 5490000, img: "https://product.hstatic.net/200000547251/product/13-5g-xanh_14c991e3fcfd43c0a054c80dec71fbcb.png" },
        { id: 7, name: "Galaxy A54", price: 9990000, img: "https://cdn.tgdd.vn/Products/Images/42/250103/samsung-galaxy-a54-thumb-den-600x600.jpg" },
        { id: 8, name: "Poco X6", price: 7990000, img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi-poco-x6-5g-8gb-256gb-1_2.png" },
        { id: 9, name: "Poco F5", price: 9990000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZGCiJ8WskZOcnwjPB6e-RSbmWgFJ-PhJfw&s" },
        { id: 10, name: "Samsung Galaxy A14", price: 4990000, img: "https://product.hstatic.net/1000063620/product/samsung-galaxy-a14-4g-do_d7155cb9e25f4646b489222309129bd1_1024x1024.jpg" },
        { id: 11, name: "iPhone SE 2022", price: 8990000, img: "https://cdn.phuckhangmobile.com/image/iphone-se-2022-midnight-26886j.jpg" },
        { id: 12, name: "iPhone 12", price: 11990000, img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/401/951/products/dac-diem-noi-bat-802c0b8d-459b-463b-a261-aaf344fced51.png?v=1729563297810" }
      ],

      vouchers: [
        { code: "SALE10", name: "Giảm 10%", value: "Giảm 10%", img: "https://cdn.luatvietnam.vn/uploaded/Images/Original/2019/09/24/huong-dan-lap-hoa-don-chung-tu-khi-su-dung-voucher-phieu-qua-tang_2409145930.jpg" },
        { code: "SALE500K", name: "Giảm 500K", value: "500.000đ", img: "https://cdn.luatvietnam.vn/uploaded/Images/Original/2019/09/24/huong-dan-lap-hoa-don-chung-tu-khi-su-dung-voucher-phieu-qua-tang_2409145930.jpg" },
        { code: "FLASH20", name: "Flash sale", value: "20%", img: "https://cdn.luatvietnam.vn/uploaded/Images/Original/2019/09/24/huong-dan-lap-hoa-don-chung-tu-khi-su-dung-voucher-phieu-qua-tang_2409145930.jpg" },
        { code: "FREESHIP", name: "Freeship", value: "50.000đ", img: "https://cdn.luatvietnam.vn/uploaded/Images/Original/2019/09/24/huong-dan-lap-hoa-don-chung-tu-khi-su-dung-voucher-phieu-qua-tang_2409145930.jpg" }
      ]

    }
  },

  methods: {
    format(n) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
    }
  }

}
</script>

<style>
.flash-wrapper {
  background: linear-gradient(45deg, #ff512f, #dd2476);
  color: white;
  padding: 14px;
  border-radius: 12px;
  overflow: hidden;
  font-weight: 700;
}

.flash-text {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  animation: flashMove 12s linear infinite;
  font-size: 18px;
}

@keyframes flashMove {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}

.hero-banner {
  height: 420px;
}

.hero-img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  filter: brightness(.6);
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 7%;
  transform: translateY(-50%);
  color: white;
  max-width: 420px;
}

.flash-box {
  background: linear-gradient(45deg, #ff512f, #dd2476);
  color: white;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
}

.phone-card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  transition: .35s;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .08);
  position: relative;
}

.phone-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 25px 45px rgba(0, 0, 0, .18);
}

.phone-img {
  height: 180px;
  object-fit: contain;
  padding: 20px;
  background: white;
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: red;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
}

.btn-gradient {
  background: linear-gradient(45deg, #ff512f, #dd2476);
  color: white;
  border: none;
}

.btn-gradient:hover {
  opacity: .9;
}

.voucher-modern {
  border: none;
  border-radius: 20px;
  transition: .3s;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .08);
}

.voucher-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 35px rgba(0, 0, 0, .15);
}

.voucher-modern-img {
  height: 150px;
  object-fit: cover;
}
</style>