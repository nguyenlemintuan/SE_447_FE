<template>
  <div class="auth-card">
    <div class="auth-card-head">
      <span class="lt-eyebrow"><i class="bx bx-help-circle"></i> Hỗ trợ tài khoản</span>
      <h2>Quên mật khẩu?</h2>
      <p>
        Vì lý do bảo mật, LifeTech chưa hỗ trợ đặt lại mật khẩu tự động. Vui lòng liên hệ
        bộ phận chăm sóc khách hàng để được xác minh và hỗ trợ.
      </p>
    </div>

    <div class="support-list">
      <a href="tel:1900232460" class="support-item">
        <span class="support-icon"><i class="bx bx-phone-call"></i></span>
        <span>
          <strong>1900 232 460</strong>
          <small>8:00 – 21:30 hằng ngày</small>
        </span>
        <i class="bx bx-chevron-right end"></i>
      </a>

      <a href="mailto:support@lifetech.vn?subject=Y%C3%AAu%20c%E1%BA%A7u%20h%E1%BB%97%20tr%E1%BB%A3%20m%E1%BA%ADt%20kh%E1%BA%A9u"
        class="support-item">
        <span class="support-icon"><i class="bx bx-envelope"></i></span>
        <span>
          <strong>support@lifetech.vn</strong>
          <small>Gửi email yêu cầu hỗ trợ</small>
        </span>
        <i class="bx bx-chevron-right end"></i>
      </a>
    </div>

    <div class="auth-note my-3">
      <i class="bx bx-id-card"></i>
      <span>Khi liên hệ, hãy chuẩn bị email đăng ký và số điện thoại để được xác minh nhanh hơn.</span>
    </div>

    <router-link to="/dang-nhap" class="lt-btn lt-btn-primary auth-submit">
      <i class="bx bx-arrow-back"></i> Quay lại đăng nhập
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ForgotPasswordPage",
};
</script>

<style scoped>
.support-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.support-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border: 1px solid var(--lt-line);
  border-radius: 14px;
  background: #fff;
  text-decoration: none;
  transition: all 0.2s ease;
}

.support-item:hover {
  border-color: var(--lt-orange-line);
  background: var(--lt-orange-soft);
  transform: translateY(-1px);
}

.support-icon {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
}

.support-item:hover .support-icon {
  background: #fff;
}

.support-item span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.support-item strong {
  font-size: 14.5px;
  color: var(--lt-ink);
}

.support-item small {
  font-size: 12.5px;
  color: var(--lt-muted);
}

.support-item .end {
  margin-left: auto;
  color: #cbd5e1;
  font-size: 18px;
}
</style>
