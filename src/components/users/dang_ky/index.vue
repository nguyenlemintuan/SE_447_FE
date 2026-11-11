<template>
  <div class="auth-card register-card">
    <div class="auth-card-head">
      <span class="lt-eyebrow"><i class="bx bx-user-plus"></i> Tạo tài khoản</span>
      <h2>Đăng ký thành viên</h2>
      <p>Tham gia LifeTech để mua sắm nhanh hơn và nhận nhiều ưu đãi hấp dẫn.</p>
    </div>

    <form @submit.prevent="dangKyTaiKhoan">
      <div class="auth-grid-2">
        <div class="auth-field">
          <label class="form-label" for="reg-name">Họ và tên</label>
          <input id="reg-name" v-model.trim="form.ho_va_ten" type="text" class="form-control"
            placeholder="Nguyễn Văn A" maxlength="30" required />
        </div>

        <div class="auth-field">
          <label class="form-label" for="reg-phone">Số điện thoại</label>
          <input id="reg-phone" v-model.trim="form.so_dien_thoai" type="tel" class="form-control"
            placeholder="0901234567" pattern="[0-9]{10,12}" required />
        </div>
      </div>

      <div class="auth-field">
        <label class="form-label" for="reg-email">Email</label>
        <input id="reg-email" v-model.trim="form.email" type="email" class="form-control"
          placeholder="example@user.com" required />
      </div>

      <div class="auth-grid-2">
        <div class="auth-field">
          <label class="form-label" for="reg-birth">Ngày sinh</label>
          <input id="reg-birth" v-model="form.ngay_sinh" type="date" class="form-control" required />
        </div>

        <div class="auth-field">
          <label class="form-label" for="reg-address">Địa chỉ</label>
          <input id="reg-address" v-model.trim="form.dia_chi" type="text" class="form-control"
            placeholder="Tỉnh/Thành phố" maxlength="255" required />
        </div>
      </div>

      <div class="auth-grid-2">
        <div class="auth-field">
          <label class="form-label" for="reg-password">Mật khẩu</label>
          <div class="auth-pass">
            <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              class="form-control" placeholder="Tối đa 30 ký tự" maxlength="30" autocomplete="new-password"
              required />
            <button type="button" class="auth-pass-toggle"
              :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
              @click="showPassword = !showPassword">
              <i class="bx" :class="showPassword ? 'bx-show' : 'bx-hide'"></i>
            </button>
          </div>
        </div>

        <div class="auth-field">
          <label class="form-label" for="reg-password-confirm">Xác nhận mật khẩu</label>
          <input id="reg-password-confirm" v-model="form.re_password" :type="showPassword ? 'text' : 'password'"
            class="form-control" placeholder="Nhập lại mật khẩu" maxlength="30" autocomplete="new-password"
            required />
        </div>
      </div>

      <div class="auth-note mb-3">
        <i class="bx bx-info-circle"></i>
        <span>Mật khẩu tối đa 30 ký tự. Vui lòng nhập số điện thoại 10–12 chữ số.</span>
      </div>

      <button type="submit" class="lt-btn lt-btn-primary auth-submit" :disabled="loading">
        <i class="bx" :class="loading ? 'bx-loader-alt bx-spin' : 'bx-user-plus'"></i>
        {{ loading ? "Đang tạo tài khoản..." : "Đăng ký" }}
      </button>
    </form>

    <div class="auth-divider">Đã có tài khoản?</div>

    <p class="auth-alt mb-0">
      <router-link to="/dang-nhap">Đăng nhập</router-link> để tiếp tục mua sắm.
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      loading: false,
      showPassword: false,
      form: {
        ho_va_ten: "",
        email: "",
        so_dien_thoai: "",
        ngay_sinh: "",
        password: "",
        re_password: "",
        dia_chi: "",
      },
    };
  },
  methods: {
    async dangKyTaiKhoan() {
      if (this.form.password !== this.form.re_password) {
        this.$toast.error("Mật khẩu xác nhận không khớp.");
        return;
      }
      if (!/^[0-9]{10,12}$/.test(this.form.so_dien_thoai)) {
        this.$toast.error("Số điện thoại phải có 10 đến 12 chữ số.");
        return;
      }

      this.loading = true;
      try {
        const { re_password, ...payload } = this.form;
        const res = await axios.post("http://127.0.0.1:8000/api/customer/create", payload);

        if (res.data.status) {
          this.$toast.success(res.data.message || "Đăng ký thành công!");
          this.$router.push("/dang-nhap");
        } else {
          this.$toast.error(res.data.message || "Đăng ký thất bại.");
        }
      } catch (err) {
        const errors = err.response?.data?.errors;
        if (errors) {
          Object.values(errors).forEach((messages) => {
            this.$toast.error(Array.isArray(messages) ? messages[0] : messages);
          });
        } else {
          this.$toast.error(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký.");
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-card {
  max-width: 540px;
}

.register-card .auth-grid-2 > .auth-field {
  min-width: 0;
}
</style>
