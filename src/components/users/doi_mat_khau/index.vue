<template>
  <div class="auth-card">
    <div v-if="success" class="text-center">
      <div class="auth-success-icon"><i class="bx bx-check"></i></div>
      <div class="auth-card-head mb-3">
        <h2>Đổi mật khẩu thành công</h2>
        <p>Mật khẩu mới của bạn đã được cập nhật. Hãy sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.</p>
      </div>
      <router-link to="/web/profile" class="lt-btn lt-btn-primary auth-submit mb-2">
        <i class="bx bx-user"></i> Về trang tài khoản
      </router-link>
      <router-link to="/" class="lt-btn lt-btn-outline auth-submit">
        <i class="bx bx-home"></i> Về trang chủ
      </router-link>
    </div>

    <template v-else>
      <div class="auth-card-head">
        <span class="lt-eyebrow"><i class="bx bx-lock-alt"></i> Bảo mật tài khoản</span>
        <h2>Đổi mật khẩu</h2>
        <p>Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật.</p>
      </div>

      <form @submit.prevent="changePassword">
        <div class="auth-field">
          <label class="form-label" for="pw-old">Mật khẩu hiện tại</label>
          <div class="auth-pass">
            <input id="pw-old" v-model="oldPassword" :type="showPassword ? 'text' : 'password'"
              class="form-control" placeholder="Nhập mật khẩu hiện tại" autocomplete="current-password"
              required />
            <button type="button" class="auth-pass-toggle"
              :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
              @click="showPassword = !showPassword">
              <i class="bx" :class="showPassword ? 'bx-show' : 'bx-hide'"></i>
            </button>
          </div>
        </div>

        <div class="auth-field">
          <label class="form-label" for="pw-new">Mật khẩu mới</label>
          <input id="pw-new" v-model="newPassword" :type="showPassword ? 'text' : 'password'"
            class="form-control" placeholder="Tối đa 30 ký tự" maxlength="30" autocomplete="new-password"
            required />
        </div>

        <div class="auth-field">
          <label class="form-label" for="pw-confirm">Xác nhận mật khẩu mới</label>
          <input id="pw-confirm" v-model="confirmPassword" :type="showPassword ? 'text' : 'password'"
            class="form-control" placeholder="Nhập lại mật khẩu mới" maxlength="30" autocomplete="new-password"
            required />
        </div>

        <div class="auth-note mb-3">
          <i class="bx bx-info-circle"></i>
          <span>Mật khẩu mới cần khác mật khẩu hiện tại và không nên chia sẻ với bất kỳ ai.</span>
        </div>

        <button type="submit" class="lt-btn lt-btn-primary auth-submit" :disabled="loading">
          <i class="bx" :class="loading ? 'bx-loader-alt bx-spin' : 'bx-key'"></i>
          {{ loading ? "Đang cập nhật..." : "Đổi mật khẩu" }}
        </button>
      </form>

      <div class="auth-divider">Hoặc</div>

      <router-link to="/web/profile" class="lt-btn lt-btn-outline auth-submit">
        <i class="bx bx-arrow-back"></i> Quay lại tài khoản
      </router-link>
    </template>
  </div>
</template>

<script>
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default {
  name: "ChangePasswordPage",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      loading: false,
      success: false,
    };
  },
  mounted() {
    if (!localStorage.getItem("users_login")) {
      this.$toast.warning("Vui lòng đăng nhập để đổi mật khẩu.");
      this.$router.push("/dang-nhap");
    }
  },
  methods: {
    async changePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.$toast.error("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.$toast.error("Mật khẩu nhập lại không khớp.");
        return;
      }
      if (this.newPassword === this.oldPassword) {
        this.$toast.warning("Mật khẩu mới cần khác mật khẩu hiện tại.");
        return;
      }

      this.loading = true;
      try {
        const res = await axios.post(
          `${API}/customer/profile/update-password`,
          { old_password: this.oldPassword, password: this.newPassword },
          { headers: { Authorization: "Bearer " + localStorage.getItem("users_login") } }
        );

        if (res.data.status) {
          this.$toast.success(res.data.message || "Cập nhật mật khẩu thành công!");
          this.oldPassword = "";
          this.newPassword = "";
          this.confirmPassword = "";
          this.success = true;
        } else {
          this.$toast.error(res.data.message || "Đổi mật khẩu thất bại.");
        }
      } catch (err) {
        this.$toast.error(err.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
