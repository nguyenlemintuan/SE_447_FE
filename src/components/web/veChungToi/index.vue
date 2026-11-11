<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="ab-hero">
      <img class="ab-hero-bg" :src="heroImg" alt="Showroom LifeTech" />
      <div class="ab-hero-overlay"></div>
      <div class="lt-container ab-hero-inner">
        <span class="lt-eyebrow ab-hero-eyebrow"><i class="bx bx-store-alt"></i> Về LifeTech</span>
        <h1>Nền tảng công nghệ chính hãng dành cho người Việt</h1>
        <p>
          LifeTech mang điện thoại, laptop và thiết bị thông minh chính hãng đến gần bạn hơn —
          với giá minh bạch, bảo hành rõ ràng và trợ lý AI đồng hành 24/7.
        </p>
        <div class="ab-hero-actions">
          <router-link to="/web/san-pham" class="lt-btn lt-btn-primary">
            <i class="bx bx-shopping-bag"></i> Khám phá sản phẩm
          </router-link>
          <a href="tel:1900232460" class="lt-btn ab-btn-ghost">
            <i class="bx bx-phone-call"></i> 1900 232 460
          </a>
        </div>
        <div class="ab-hero-stats">
          <div class="ab-stat" v-for="(s, i) in stats" :key="i">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Câu chuyện -->
    <section class="ab-section" id="cau-chuyen">
      <div class="lt-container ab-story">
        <div class="ab-story-media">
          <img class="ab-story-main" :src="storyImg" alt="Đội ngũ LifeTech làm việc cùng nhau" />
          <img class="ab-story-small" :src="teamImg" alt="Chung tay vì mục tiêu chung" />
          <div class="ab-story-badge">
            <i class="bx bx-award"></i>
            <div>
              <strong>6+ năm</strong>
              <span>đồng hành cùng khách hàng Việt</span>
            </div>
          </div>
        </div>
        <div class="ab-story-text">
          <span class="lt-eyebrow"><i class="bx bx-book-open"></i> Câu chuyện của chúng tôi</span>
          <h2>Từ một cửa hàng nhỏ đến nền tảng công nghệ số</h2>
          <p>
            LifeTech khởi đầu năm 2019 từ một cửa hàng công nghệ nhỏ với một trăn trở rất đời thường:
            người mua điện thoại lúc nào cũng lo <b>hàng giả</b>, <b>giá thiếu minh bạch</b> và
            <b>bảo hành lẩn tránh</b>. Chúng tôi tin rằng mua công nghệ đáng ra phải đơn giản và yên tâm hơn thế.
          </p>
          <p>
            Sáu năm qua, LifeTech lớn lên cùng khách hàng của mình. Mỗi sản phẩm đến tay người dùng
            đều được kiểm định nguồn gốc, niêm yết giá công khai và bảo hành chính hãng. Từ một cửa hàng,
            chúng tôi nay là nền tảng mua sắm số với trợ lý AI giúp tìm kiếm, so sánh và gợi ý sản phẩm
            theo đúng nhu cầu của từng người.
          </p>
          <p>
            Hành trình phía trước, chúng tôi vẫn giữ đúng lời hứa ngày đầu:
            <b>chính hãng – giá tốt – tận tâm</b>, để mỗi khách hàng rời LifeTech với một trải nghiệm xứng đáng.
          </p>
        </div>
      </div>
    </section>

    <!-- Sứ mệnh & tầm nhìn -->
    <section class="ab-section ab-section-tint">
      <div class="lt-container">
        <div class="ab-heading">
          <span class="lt-eyebrow"><i class="bx bx-compass"></i> Định hướng</span>
          <h2>Sứ mệnh &amp; tầm nhìn</h2>
        </div>
        <div class="ab-duo">
          <article class="ab-card ab-duo-card">
            <span class="ab-icon"><i class="bx bx-bullseye"></i></span>
            <h3>Sứ mệnh</h3>
            <p>
              Mang công nghệ chính hãng, minh bạch đến với mọi người Việt — từ học sinh, sinh viên
              đến chuyên gia — ở mọi mức ngân sách, với trải nghiệm mua sắm đơn giản và an tâm.
            </p>
          </article>
          <article class="ab-card ab-duo-card">
            <span class="ab-icon ab-icon-dark"><i class="bx bx-sun"></i></span>
            <h3>Tầm nhìn</h3>
            <p>
              Trở thành nền tảng mua sắm công nghệ trực tuyến đáng tin cậy hàng đầu Việt Nam,
              nơi AI giúp mỗi người chọn đúng sản phẩm phù hợp nhất với nhu cầu và phong cách sống của mình.
            </p>
          </article>
        </div>

        <div class="ab-heading ab-heading-gap">
          <span class="lt-eyebrow"><i class="bx bx-heart-square"></i> Giá trị cốt lõi</span>
          <h2>Những điều chúng tôi không bao giờ thỏa hiệp</h2>
        </div>
        <div class="ab-values">
          <article class="ab-card" v-for="(v, i) in values" :key="i">
            <span class="ab-icon"><i class="bx" :class="v.icon"></i></span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Đội ngũ -->
    <section class="ab-section" id="doi-ngu">
      <div class="lt-container">
        <div class="ab-heading">
          <span class="lt-eyebrow"><i class="bx bx-group"></i> Đội ngũ lãnh đạo</span>
          <h2>Những con người tạo nên LifeTech</h2>
          <p class="ab-heading-sub">
            Một đội ngũ trẻ, giàu nhiệt huyết — từ kỹ sư, chuyên gia vận hành đến cố vấn kinh doanh —
            cùng chung một đích đến: trải nghiệm tốt nhất cho khách hàng.
          </p>
        </div>
        <div class="ab-team">
          <article class="ab-member" v-for="(m, i) in team" :key="i">
            <span class="ab-avatar" :style="{ background: m.color }">{{ m.name.split(" ").pop().charAt(0) }}</span>
            <h3>{{ m.name }}</h3>
            <p>{{ m.role }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Đối tác -->
    <section class="ab-section ab-section-tint">
      <div class="lt-container">
        <div class="ab-heading">
          <span class="lt-eyebrow"><i class="bx bx-briefcase-alt-2"></i> Đối tác chiến lược</span>
          <h2>Thương hiệu đồng hành cùng LifeTech</h2>
          <p class="ab-heading-sub">
            Chúng tôi hợp tác trực tiếp với các hãng công nghệ hàng đầu để đưa sản phẩm chính hãng
            100%, bảo hành toàn cầu đến tay bạn.
          </p>
        </div>
        <div class="ab-brands">
          <span class="ab-brand" v-for="b in brands" :key="b.name" :style="{ '--brand': b.color }">
            <span class="ab-brand-logo" v-html="b.svg"></span>{{ b.name }}
          </span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ab-section">
      <div class="lt-container">
        <div class="ab-cta">
          <div class="ab-cta-text">
            <h2>Bạn cần tư vấn? LifeTech luôn sẵn sàng.</h2>
            <p>
              Gọi hotline, ghé showroom hoặc để trợ lý AI của chúng tôi gợi ý sản phẩm phù hợp nhất với bạn.
            </p>
          </div>
          <div class="ab-cta-actions">
            <router-link to="/web/san-pham" class="lt-btn lt-btn-primary">
              <i class="bx bx-shopping-bag"></i> Mua sắm ngay
            </router-link>
            <router-link to="/web/goi-y" class="lt-btn ab-btn-ghost ab-btn-outline">
              <i class="bx bx-bulb"></i> Gợi ý sản phẩm bằng AI
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import heroImg from "../../../assets/img/about/hero-store.png";
import storyImg from "../../../assets/img/about/pexels-3184418.jpg";
import teamImg from "../../../assets/img/about/pexels-3184292.jpg";
import svgApple from "../../../assets/img/brands/apple.svg?raw";
import svgSamsung from "../../../assets/img/brands/samsung.svg?raw";
import svgAsus from "../../../assets/img/brands/asus.svg?raw";
import svgDell from "../../../assets/img/brands/dell.svg?raw";
import svgHp from "../../../assets/img/brands/hp.svg?raw";
import svgLenovo from "../../../assets/img/brands/lenovo.svg?raw";
import svgXiaomi from "../../../assets/img/brands/xiaomi.svg?raw";
import svgOppo from "../../../assets/img/brands/oppo.svg?raw";

export default {
  name: "AboutUs",
  data() {
    return {
      heroImg,
      storyImg,
      teamImg,
      stats: [
        { value: "6+", label: "Năm phát triển" },
        { value: "50.000+", label: "Khách hàng tin dùng" },
        { value: "20+", label: "Thương hiệu đối tác" },
        { value: "4.9/5", label: "Điểm hài lòng" },
      ],
      values: [
        {
          icon: "bx-badge-check",
          title: "Chính hãng 100%",
          desc: "Mọi sản phẩm đều có nguồn gốc rõ ràng, đầy đủ hóa đơn và bảo hành chính hãng theo tiêu chuẩn toàn cầu.",
        },
        {
          icon: "bx-purchase-tag-alt",
          title: "Giá minh bạch",
          desc: "Không tăng giá ảo, không phí ẩn. Giá tốt là cam kết của chúng tôi, không phải khẩu hiệu quảng cáo.",
        },
        {
          icon: "bx-headphone",
          title: "Tận tâm phục vụ",
          desc: "Hỗ trợ 24/7 qua hotline, chat và trợ lý AI — đồng hành với bạn trước, trong và sau khi mua hàng.",
        },
        {
          icon: "bx-rocket",
          title: "Đổi mới liên tục",
          desc: "Ứng dụng AI cá nhân hóa trải nghiệm: tìm kiếm bằng ngôn ngữ tự nhiên, so sánh và gợi ý thông minh.",
        },
      ],
      team: [
        { name: "Ông Dũng", role: "Giám đốc Điều hành (CEO)", color: "linear-gradient(135deg, #f97316, #fb923c)" },
        { name: "Bà Lan", role: "Giám đốc Công nghệ (CTO)", color: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
        { name: "Ông Nam", role: "Giám đốc Tài chính (CFO)", color: "linear-gradient(135deg, #16a34a, #4ade80)" },
        { name: "Bà Linh", role: "Giám đốc Marketing (CMO)", color: "linear-gradient(135deg, #0d9488, #2dd4bf)" },
        { name: "Ông Hoàng", role: "Giám đốc Vận hành (COO)", color: "linear-gradient(135deg, #0f172a, #475569)" },
      ],
      brands: [
        { name: "Apple", color: "#000000", svg: svgApple },
        { name: "Samsung", color: "#1428A0", svg: svgSamsung },
        { name: "Asus", color: "#00539B", svg: svgAsus },
        { name: "Dell", color: "#007DB8", svg: svgDell },
        { name: "HP", color: "#0096D6", svg: svgHp },
        { name: "Lenovo", color: "#E2231A", svg: svgLenovo },
        { name: "Xiaomi", color: "#FF6900", svg: svgXiaomi },
        { name: "Oppo", color: "#046A38", svg: svgOppo },
      ],
    };
  },
};
</script>

<style scoped>
.ab-page {
  background: var(--lt-bg);
}

/* ---------- Hero ---------- */
.ab-hero {
  position: relative;
  overflow: hidden;
  background: var(--lt-ink);
}

.ab-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.38;
}

.ab-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.72) 45%, rgba(15, 23, 42, 0.35) 100%);
}

.ab-hero-inner {
  position: relative;
  padding: 96px 24px 64px;
  color: #fff;
  max-width: 1200px;
}

.ab-hero-eyebrow {
  background: rgba(249, 115, 22, 0.18);
  border: 1px solid rgba(249, 115, 22, 0.45);
  color: #fdba74;
}

.ab-hero h1 {
  max-width: 640px;
  font-size: 44px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin: 18px 0 16px;
}

.ab-hero p {
  max-width: 560px;
  font-size: 18px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 28px;
}

.ab-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 48px;
}

.ab-btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}

.ab-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.2);
}

.ab-btn-outline {
  background: transparent;
  border: 1px solid var(--lt-orange);
  color: var(--lt-orange);
}

.ab-btn-outline:hover {
  background: var(--lt-orange-soft);
}

.ab-hero-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  max-width: 820px;
}

.ab-stat {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(6px);
  border-radius: var(--lt-radius);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ab-stat strong {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.ab-stat span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
}

/* ---------- Sections ---------- */
.ab-section {
  padding: 72px 0;
}

.ab-section-tint {
  background: var(--lt-surface);
  border-top: 1px solid var(--lt-line);
  border-bottom: 1px solid var(--lt-line);
}

.ab-heading {
  max-width: 680px;
  margin-bottom: 36px;
}

.ab-heading-gap {
  margin-top: 56px;
}

.ab-heading h2 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin: 12px 0 10px;
  color: var(--lt-ink);
}

.ab-heading-sub {
  color: var(--lt-muted);
  font-size: 16px;
  line-height: 1.65;
}

/* ---------- Câu chuyện ---------- */
.ab-story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
}

.ab-story-media {
  position: relative;
  padding-bottom: 64px;
}

.ab-story-main {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--lt-radius-lg);
  box-shadow: var(--lt-shadow);
}

.ab-story-small {
  position: absolute;
  right: -18px;
  bottom: 0;
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: var(--lt-radius);
  border: 5px solid var(--lt-surface);
  box-shadow: var(--lt-shadow-lg);
}

.ab-story-badge {
  position: absolute;
  left: -18px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
  box-shadow: var(--lt-shadow);
  padding: 14px 18px;
}

.ab-story-badge i {
  font-size: 30px;
  color: var(--lt-orange);
}

.ab-story-badge strong {
  display: block;
  font-size: 20px;
  color: var(--lt-ink);
  line-height: 1.2;
}

.ab-story-badge span {
  font-size: 13px;
  color: var(--lt-muted);
}

.ab-story-text .lt-eyebrow {
  display: inline-flex;
}

.ab-story-text h2 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin: 12px 0 16px;
  color: var(--lt-ink);
}

.ab-story-text p {
  color: var(--lt-ink-soft);
  font-size: 16px;
  line-height: 1.75;
  margin-bottom: 14px;
}

.ab-story-text b {
  color: var(--lt-orange-dark);
}

/* ---------- Cards ---------- */
.ab-card {
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius-lg);
  padding: 28px;
  box-shadow: var(--lt-shadow-sm);
  transition: transform var(--lt-transition), box-shadow var(--lt-transition);
}

.ab-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--lt-shadow);
}

.ab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange);
  font-size: 26px;
  margin-bottom: 16px;
}

.ab-icon-dark {
  background: #eef2f7;
  color: var(--lt-ink);
}

.ab-card h3 {
  font-size: 19px;
  font-weight: 700;
  color: var(--lt-ink);
  margin-bottom: 8px;
}

.ab-card p {
  color: var(--lt-muted);
  font-size: 15px;
  line-height: 1.65;
}

.ab-duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.ab-duo-card {
  padding: 36px 32px;
}

.ab-values {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

/* ---------- Đội ngũ ---------- */
.ab-team {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;
}

.ab-member {
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius-lg);
  padding: 28px 20px;
  text-align: center;
  box-shadow: var(--lt-shadow-sm);
  transition: transform var(--lt-transition), box-shadow var(--lt-transition);
}

.ab-member:hover {
  transform: translateY(-4px);
  box-shadow: var(--lt-shadow);
}

.ab-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  color: #fff;
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 14px;
}

.ab-member h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--lt-ink);
  margin-bottom: 4px;
}

.ab-member p {
  font-size: 13.5px;
  color: var(--lt-muted);
}

/* ---------- Đối tác ---------- */
.ab-brands {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.ab-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 132px;
  padding: 12px 24px;
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: var(--lt-muted);
  transition: all var(--lt-transition);
}

.ab-brand:hover {
  color: var(--lt-ink);
  border-color: var(--lt-orange-line);
  box-shadow: var(--lt-shadow-sm);
  transform: translateY(-2px);
}

.ab-brand-logo {
  width: 19px;
  height: 19px;
  display: inline-flex;
  flex-shrink: 0;
}

.ab-brand-logo :deep(svg) {
  width: 100%;
  height: 100%;
  fill: var(--brand);
}

/* ---------- CTA ---------- */
.ab-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 60%, #334155 100%);
  border-radius: var(--lt-radius-xl);
  padding: 48px 52px;
  color: #fff;
}

.ab-cta-text h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin-bottom: 10px;
}

.ab-cta-text p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 16px;
  line-height: 1.6;
}

.ab-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  flex-shrink: 0;
}

/* ---------- Responsive ---------- */
@media (max-width: 992px) {
  .ab-hero h1 {
    font-size: 36px;
  }

  .ab-hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ab-story {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .ab-values,
  .ab-duo {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ab-team {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ab-cta {
    flex-direction: column;
    text-align: center;
    padding: 40px 28px;
  }
}

@media (max-width: 560px) {
  .ab-hero-inner {
    padding: 72px 20px 48px;
  }

  .ab-hero h1 {
    font-size: 29px;
  }

  .ab-section {
    padding: 52px 0;
  }

  .ab-heading h2,
  .ab-story-text h2 {
    font-size: 24px;
  }

  .ab-story-main {
    height: 280px;
  }

  .ab-story-small {
    display: none;
  }

  .ab-story-badge {
    left: 12px;
  }

  .ab-values,
  .ab-duo {
    grid-template-columns: 1fr;
  }

  .ab-team {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ab-brand {
    min-width: calc(50% - 7px);
  }
}
</style>
