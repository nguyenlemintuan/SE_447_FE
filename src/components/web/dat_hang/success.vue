<template>
  <div class="container text-center mt-5 animate">
    <div class="card shadow-lg p-4 border-0">
      <i class="fa-solid fa-circle-check text-success success-icon"></i>

      <h2 class="mt-3 text-success fw-bold">Thanh Toán Thành Công!</h2>

      <p class="mt-2 text-secondary">
        Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm giao hàng cho bạn.
      </p>

      <!-- Hiển thị mã đơn nếu truyền tham số -->
      <p v-if="$route.query.ma_don" class="fw-bold mt-2">
        Mã đơn hàng: <span class="text-primary">{{ $route.query.ma_don }}</span>
      </p>

      <div class="mt-4">
        <router-link to="/" class="btn btn-primary me-2">
          <i class="fa-solid fa-house"></i> Về Trang Chủ
        </router-link>

        <router-link to="/lich_su" class="btn btn-outline-primary">
          <i class="fa-solid fa-clock-rotate-left"></i> Xem Lịch Sử Đơn Hàng
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSuccessPage",
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.card {
  border-radius: 12px;
}

.success-icon {
  font-size: 70px;
  animation: pop 0.4s ease-out;
}

.animate {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes pop {
  0% { transform: scale(0.3); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
