<template>
  <div class="sf-app auth-shell">
    <aside class="auth-brand">
      <router-link to="/" class="brand">
        <span class="brand-mark"><i class="bx bx-cart-alt"></i></span>
        <span class="brand-name">LifeTech</span>
      </router-link>

      <div class="brand-copy">
        <span class="brand-eyebrow"><i class="bx bx-bulb"></i> Công nghệ chính hãng</span>
        <h1>Công nghệ tốt,<br />giá tốt mỗi ngày.</h1>
        <p>
          Hàng ngàn sản phẩm điện thoại, laptop, máy tính bảng và phụ kiện chính hãng,
          bảo hành minh bạch, giao nhanh toàn quốc.
        </p>

        <ul class="brand-list">
          <li><i class="bx bx-check-shield"></i> 100% sản phẩm chính hãng</li>
          <li><i class="bx bx-purchase-tag-alt"></i> Giá tốt, nhiều ưu đãi mỗi tuần</li>
          <li><i class="bx bx-support"></i> Hỗ trợ 24/7, đổi trả linh hoạt</li>
        </ul>
      </div>

      <div class="brand-stats">
        <div>
          <strong>10.000+</strong>
          <span>Khách hàng tin chọn</span>
        </div>
        <div>
          <strong>4.9/5</strong>
          <span>Điểm hài lòng</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Hỗ trợ khách hàng</span>
        </div>
      </div>
    </aside>

    <main class="auth-main">
      <div class="auth-topbar">
        <router-link to="/" class="auth-back">
          <i class="bx bx-arrow-back"></i> Về trang chủ
        </router-link>
        <span class="auth-hotline">
          <i class="bx bx-phone-call"></i> 1900 232 460
        </span>
      </div>

      <div class="auth-content">
        <router-view></router-view>
      </div>

      <p class="auth-foot">
        © 2026 <strong>LifeTech</strong> · Thiết kế &amp; phát triển bởi Group 11 SE447 E
      </p>
    </main>
  </div>
</template>

<script>
import "../../assets/js/bootstrap.bundle.min.js";

export default {
  name: "AuthLayout",
};
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  background: var(--lt-bg);
}

/* ============ BRAND PANEL ============ */
.auth-brand {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 48px 56px;
  color: #fff;
  background: radial-gradient(circle at 15% 15%, #fb923c 0%, transparent 45%),
    radial-gradient(circle at 90% 85%, #f97316 0%, transparent 42%),
    linear-gradient(150deg, #1c1207 0%, #291707 45%, #3b1d05 100%);
}

.auth-brand::before,
.auth-brand::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.auth-brand::before {
  width: 420px;
  height: 420px;
  right: -160px;
  top: -140px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.auth-brand::after {
  width: 300px;
  height: 300px;
  right: -80px;
  top: -70px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  position: relative;
  z-index: 1;
  width: fit-content;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  box-shadow: 0 10px 24px rgba(249, 115, 22, 0.4);
}

.brand-name {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
}

.brand-copy {
  position: relative;
  z-index: 1;
  max-width: 480px;
}

.brand-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fdba74;
}

.brand-copy h1 {
  font-size: clamp(30px, 3.6vw, 46px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 14px 0 18px;
}

.brand-copy p {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.75);
}

.brand-list {
  list-style: none;
  padding: 0;
  margin: 26px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.88);
}

.brand-list i {
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #fdba74;
  background: rgba(249, 115, 22, 0.18);
}

.brand-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.brand-stats strong {
  display: block;
  font-size: 19px;
  font-weight: 800;
  color: #fff;
}

.brand-stats span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* ============ FORM PANEL ============ */
.auth-main {
  display: flex;
  flex-direction: column;
  padding: 28px 40px 24px;
  min-height: 100vh;
}

.auth-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.auth-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lt-ink-soft);
  text-decoration: none;
}

.auth-back:hover {
  color: var(--lt-orange-dark);
}

.auth-hotline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--lt-muted);
}

.auth-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 0;
}

.auth-foot {
  text-align: center;
  font-size: 12px;
  color: var(--lt-muted);
}

.auth-foot strong {
  color: var(--lt-orange-dark);
}

@media (max-width: 980px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-brand {
    padding: 32px 24px;
    gap: 22px;
  }

  .brand-copy h1 {
    font-size: 28px;
  }

  .brand-copy p {
    display: none;
  }

  .brand-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px 18px;
    margin-top: 18px;
  }

  .brand-stats {
    display: none;
  }

  .auth-main {
    min-height: auto;
    padding: 20px 20px 18px;
  }

  .auth-content {
    padding: 20px 0 28px;
  }
}

@media (max-width: 560px) {
  .brand-list li {
    font-size: 12.5px;
  }

  .brand-copy h1 {
    font-size: 24px;
    margin-bottom: 0;
  }
}
</style>

<style>
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/icons.css";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css");
</style>
