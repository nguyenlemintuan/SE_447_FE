<template>
  <section class="about-wrapper">
    <div class="about-container">
      <!-- Tiêu đề -->
      <h2 class="title"><i class="bx bx-store-alt"></i> Về Chúng Tôi</h2>

      <!-- 5 hình + chữ -->
      <div class="about-items">
        <div class="about-item" v-for="(item, index) in features" :key="index">
          <img :src="item.img" :alt="item.text" />
          <p>{{ item.text }}</p>
        </div>
      </div>

      <!-- Giới thiệu -->
      <h3 class="subtitle">Giới thiệu về chúng tôi</h3>
      <p class="description">
        <b>SHOP SE397</b> là một trong những cửa hàng công nghệ trực tuyến tiên
        phong tại Việt Nam, được thành lập với mục tiêu mang đến cho khách hàng
        những sản phẩm công nghệ chính hãng, chất lượng cao với mức giá hợp lý
        nhất. Với định hướng phát triển bền vững, chúng tôi luôn đặt
        <b>chất lượng – uy tín – sự hài lòng của khách hàng</b> lên hàng đầu
        trong mọi hoạt động kinh doanh.
      </p>

      <p class="description">
        Chúng tôi chuyên phân phối đa dạng các dòng sản phẩm công nghệ từ
        <b>điện thoại, laptop, máy tính bảng, phụ kiện thông minh</b> cho đến
        các thiết bị phục vụ học tập, làm việc và giải trí. Mỗi sản phẩm trước
        khi đến tay khách hàng đều được kiểm định kỹ lưỡng về nguồn gốc và chất
        lượng, nhằm đảm bảo tiêu chuẩn cao nhất của thương hiệu
        <b>SHOP SE397</b>.
      </p>

      <p class="description">
        Hợp tác cùng các hãng công nghệ hàng đầu như
        <b>Apple, Samsung, Asus, Dell, Lenovo, HP, Xiaomi</b> và nhiều thương
        hiệu quốc tế khác, chúng tôi cam kết mang đến những sản phẩm mới nhất,
        chính hãng 100%, bảo hành chính thức theo tiêu chuẩn toàn cầu. Ngoài ra,
        chúng tôi còn cung cấp các dịch vụ hậu mãi tận tâm, hỗ trợ kỹ thuật và
        đổi trả linh hoạt, giúp khách hàng yên tâm tuyệt đối khi mua sắm tại
        <b>SHOP SE397</b>.
      </p>

      <p class="description">
        Không chỉ dừng lại ở việc bán hàng, chúng tôi định hướng xây dựng
        <b>SHOP SE397</b> trở thành một hệ sinh thái công nghệ toàn diện – nơi
        người dùng có thể cập nhật nhanh nhất xu hướng, chia sẻ kiến thức, nhận
        tư vấn chuyên sâu và trải nghiệm dịch vụ mua sắm hiện đại, an toàn và
        tiện lợi nhất trên nền tảng số.
      </p>

      <p class="description">
        Đội ngũ nhân viên của chúng tôi được đào tạo bài bản, nhiệt huyết và
        giàu kinh nghiệm. Chúng tôi tin rằng dịch vụ tốt không chỉ nằm ở giá cả
        mà còn ở cách chúng tôi lắng nghe và đồng hành cùng khách hàng trong
        suốt quá trình sử dụng sản phẩm. Với phương châm
        <b>“Chính hãng – Giá tốt – Tận tâm – Đổi mới – Tin cậy”</b>,
        <b>SHOP SE397</b> luôn không ngừng nỗ lực để khẳng định vị thế của mình
        trong lĩnh vực thương mại điện tử công nghệ tại Việt Nam.
      </p>

      <p class="description">
        Trong tương lai, <b>SHOP SE397</b> hướng đến mục tiêu trở thành
        <b>nền tảng phân phối công nghệ hàng đầu Việt Nam</b>, nơi mọi khách
        hàng đều có thể tìm thấy sản phẩm phù hợp với nhu cầu, ngân sách và
        phong cách sống của mình. Chúng tôi tin rằng sự hài lòng của bạn chính
        là thành công lớn nhất của chúng tôi.
      </p>

      <!-- Thương hiệu -->
      <h3 class="subtitle mt-5">Thương hiệu đồng hành</h3>
      <div class="brand-logos">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
        <img
          src="https://www.bing.com/th/id/OIP.Irb0SUESk0MSJiqSt5y3tQHaEf?w=267&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.1&pid=3.1&rm=2"
          alt="Samsung" />
        <img
          src="https://www.bing.com/th/id/OIP.xHnlqJeN1UEzU7Xkoir4sAHaEK?w=246&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2"
          alt="Asus" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" alt="Dell" />
        <img
          src="https://www.bing.com/th/id/OIP.vVubSWmCxbsVl2fZIaL7MgHaEK?w=274&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2"
          alt="HP" />
      </div>
    </div>

    <!-- Chatbox -->
    <div class="chat-section">
      <ChatBox />
    </div>
  </section>
</template>

<script>
import ChatBox from "../../chat/ChatBox.vue";

export default {
  components: {
    ChatBox,
  },
  name: "AboutUs",
  data() {
    return {
      features: [
        {
          img: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
          text: "Chính hãng",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/4299/4299936.png",
          text: "Giá tốt",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/3039/3039385.png",
          text: "Công nghệ mới",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/3076/3076627.png",
          text: "Bảo hành an tâm",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/4213/4213180.png",
          text: "Hỗ trợ 24/7",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Tổng thể */
.about-wrapper {
  background-color: #f8f9fb;
  padding: 50px 0;
}

.about-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 50px 30px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* Tiêu đề */
.title {
  font-size: 32px;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 5 hình */
.about-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 40px;
}

.about-item {
  flex: 1 1 160px;
  text-align: center;
  transition: transform 0.3s;
}

.about-item:hover {
  transform: translateY(-5px);
}

.about-item img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 50%;
  background: #fff7f3;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #f97316;
}

.about-item p {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* Giới thiệu */
.subtitle {
  font-size: 22px;
  font-weight: bold;
  color: #f97316;
  margin-top: 30px;
  margin-bottom: 15px;
}

.description {
  font-size: 17px;
  line-height: 1.8;
  color: #444;
  text-align: justify;
  margin-bottom: 20px;
}

/* Thương hiệu */
.brand-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 30px;
}

.brand-logos img {
  height: 40px;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.brand-logos img:hover {
  filter: grayscale(0%);
  transform: scale(1.1);
}

/* ChatBox */
.chat-section {
  margin-top: 60px;
}

/* Responsive */
@media (max-width: 768px) {
  .about-items {
    grid-template-columns: repeat(2, 1fr);
  }

  .brand-logos img {
    height: 35px;
  }
}
</style>
