<template>
   <div class="card">
      <div class="card-body">
         <div class="border p-4 rounded">
            <div class="text-center mb-3">
               <h3><i class="fa-regular fa-address-card me-2"></i>Đăng Ký Tài Khoản</h3>
               <p>Tham gia ngay để mua đồ công nghệ với giá ưu đãi nhất!</p>
            </div>

            <div class="form-body">
               <form class="row g-3" @submit.prevent="dangKyTaiKhoan">
                  <div class="col-lg-12">
                     <label class="form-label">
                        <i class="bx bx-user me-1"></i>Họ Và Tên
                     </label>
                     <input v-model="form.ho_va_ten" type="text" class="form-control" placeholder="Nhập họ và tên của bạn" required>
                  </div>

                  <div class="col-lg-12">
                     <label class="form-label">
                        <i class="fa-regular fa-envelope me-1"></i>Email
                     </label>
                     <input v-model="form.email" type="email" class="form-control" placeholder="example@user.com" required>
                  </div>

                  <div class="col-lg-12">
                     <label class="form-label">
                        <i class="fa-solid fa-phone me-1"></i>Số Điện Thoại
                     </label>
                     <input v-model="form.so_dien_thoai" type="text" class="form-control" placeholder="Nhập số điện thoại của bạn" required>
                  </div>

                  <div class="col-lg-12">
                     <label class="form-label">
                        <i class="fa-solid fa-cake-candles me-1"></i>Ngày Sinh
                     </label>
                     <input v-model="form.ngay_sinh" type="date" class="form-control" required>
                  </div>

                  <div class="col-lg-12">
                     <label class="form-label">
                        <i class="fa-solid fa-lock me-1"></i>Mật Khẩu
                     </label>
                     <input v-model="form.password" type="password" class="form-control" placeholder="Nhập mật khẩu" required>
                  </div>

                  <div class="col-lg-12">
                     <label class="form-label">
                        <i class="fa-solid fa-key me-1"></i>Xác Nhận Mật Khẩu
                     </label>
                     <input v-model="form.re_password" type="password" class="form-control" placeholder="Xác nhận mật khẩu" required>
                  </div>

                  <div class="col-lg-12">
                     <div class="d-grid">
                        <button type="submit" class="btn btn-success" :disabled="loading">
                           <span v-if="loading">
                              <i class="fa fa-spinner fa-spin me-2"></i>Đang xử lý...
                           </span>
                           <span v-else>Đăng Ký</span>
                        </button>
                     </div>
                  </div>

                  <div class="col-lg-12 text-center">
                     <p>
                        Đã có tài khoản?
                        <a href="/users/dang-nhap" class="fw-bold">Đăng Nhập</a>
                     </p>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import axios from "axios";

export default {
   data() {
      return {
         loading: false,
         form: {
            ho_va_ten: "",
            email: "",
            so_dien_thoai: "",
            ngay_sinh: "",
            password: "",
            re_password: "",
            dia_chi: "Chưa cập nhật"
         },
      };
   },
   methods: {
      async dangKyTaiKhoan() {
         if (this.form.password !== this.form.re_password) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
         }

         this.loading = true;
         try {
            const res = await axios.post("http://127.0.0.1:8000/api/customer/create", this.form);
            if (res.data.status) {
                this.$toast.success(res.data.message);
               this.$router.push("/users/dang-nhap");
            } else {
              this.$toast.error("Đăng ký thất bại!");
            }
         } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            this.$toast.error(res.data.message);
         } finally {
            this.loading = false;
         }
      },
   },
};
</script>

<style scoped>
input {
   border-radius: 8px;
}
button:disabled {
   opacity: 0.7;
   cursor: not-allowed;
}
</style>
