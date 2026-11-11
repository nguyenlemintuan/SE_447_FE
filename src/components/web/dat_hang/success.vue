<template>
  <div class="lt-container lt-page success-page">
    <div class="success-card lt-panel">
      <div class="success-icon"><i class="bx bx-check"></i></div>

      <span class="lt-eyebrow justify-content-center"><i class="bx bx-check-circle"></i> Hoàn tất</span>
      <h1>Thanh toán thành công!</h1>
      <p class="lt-muted">
        Cảm ơn bạn đã mua sắm tại LifeTech. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao tới bạn.
      </p>

      <div v-if="$route.query.ma_don" class="order-code">
        <span>Mã đơn hàng</span>
        <strong>{{ $route.query.ma_don }}</strong>
      </div>

      <div class="success-actions">
        <router-link to="/web/lich-su-mua-hang" class="lt-btn lt-btn-primary">
          <i class="bx bx-receipt"></i> Xem đơn hàng của tôi
        </router-link>
        <router-link to="/" class="lt-btn lt-btn-outline">
          <i class="bx bx-home"></i> Về trang chủ
        </router-link>
      </div>

      <p class="support-note">
        Cần hỗ trợ? Gọi <a href="tel:1900232460">1900 232 460</a> (8:00 – 21:30)
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSuccessPage",
};
</script>

<style scoped>
.success-page {
  display: flex;
  justify-content: center;
}

.success-card {
  max-width: 560px;
  width: 100%;
  margin-top: 24px;
  padding: 44px 36px;
  text-align: center;
}

.success-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  color: #fff;
  background: linear-gradient(135deg, #4ade80, var(--lt-success));
  box-shadow: 0 16px 34px -12px rgba(22, 163, 74, 0.55);
  animation: pop 0.45s ease-out;
}

.success-card h1 {
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 8px 0 10px;
}

.success-card > .lt-muted {
  max-width: 420px;
  margin: 0 auto;
  font-size: 14.5px;
  line-height: 1.6;
}

.order-code {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0 4px;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--lt-orange-soft);
  border: 1px dashed var(--lt-orange-line);
}

.order-code span {
  font-size: 12.5px;
  color: var(--lt-muted);
}

.order-code strong {
  font-size: 15px;
  color: var(--lt-orange-dark);
  letter-spacing: 0.02em;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.support-note {
  margin: 24px 0 0;
  font-size: 12.5px;
  color: var(--lt-muted);
}

.support-note a {
  color: var(--lt-orange-dark);
  font-weight: 600;
  text-decoration: none;
}

@keyframes pop {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 520px) {
  .success-card {
    padding: 34px 22px;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-actions .lt-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
