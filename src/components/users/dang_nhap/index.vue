<template>
  <div class="auth-card">
    <div class="auth-card-head">
      <span class="lt-eyebrow"><i class="bx bx-log-in-circle"></i> Chào mừng trở lại</span>
      <h2>Đăng nhập tài khoản</h2>
    </div>

    <form @submit.prevent="Login">
      <div class="auth-field">
        <label class="form-label" for="login-email">Email</label>
        <input id="login-email" v-model.trim="user.email" type="email" class="form-control"
          placeholder="example@user.com" autocomplete="email" required />
      </div>

      <div class="auth-field">
        <label class="form-label" for="login-password">Mật khẩu</label>
        <div class="auth-pass">
          <input id="login-password" v-model="user.password" :type="showPassword ? 'text' : 'password'"
            class="form-control" placeholder="Nhập mật khẩu" autocomplete="current-password" required />
          <button type="button" class="auth-pass-toggle" :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            @click="showPassword = !showPassword">
            <i class="bx" :class="showPassword ? 'bx-show' : 'bx-hide'"></i>
          </button>
        </div>
      </div>

      <div class="auth-row">
        <router-link to="/web/quen-mat-khau">Quên mật khẩu?</router-link>
      </div>

      <button type="submit" class="lt-btn lt-btn-primary auth-submit" :disabled="loading" @click.prevent="Login">
        <i class="bx" :class="loading ? 'bx-loader-alt bx-spin' : 'bx-log-in'"></i>
        {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
      </button>
    </form>

    <div class="auth-divider">Bạn chưa có tài khoản?</div>

    <p class="auth-alt mb-3">
      <router-link to="/users/dang-ky">Đăng ký ngay</router-link> để nhận ưu đãi cho đơn hàng đầu tiên.
    </p>

    <div class="auth-note">
      <i class="bx bx-shield-quarter"></i>
      <span>Thông tin đăng nhập được bảo mật. LifeTech không chia sẻ dữ liệu của bạn cho bên thứ ba.</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data() {
    return {
      user: { email: "", password: "" },
      showPassword: false,
      loading: false,
    };
  },
  methods: {
    async Login() {
      if (!this.user.email || !this.user.password) {
        this.$toast.warning("Vui lòng nhập email và mật khẩu.");
        return;
      }

      this.loading = true;
      let role = null;
      let token = null;
      let firstError = null;
      let adminFailedMsg = null;

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/customer/dang-nhap", this.user);
        if (res.data?.status) {
          role = "customer";
          token = res.data.token;
        }
      } catch (err) {
        firstError = err;
      }

      if (!role) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/admin/dang-nhap", this.user);
          if (res.data?.status) {
            role = "admin";
            token = res.data.token;
          } else if (res.data?.message) {
            adminFailedMsg = res.data.message;
          }
        } catch (err) {
          if (!firstError) firstError = err;
        }
      }

      if (role === "customer") {
        localStorage.setItem("users_login", token);
        this.$toast.success("Đăng nhập thành công!");
        const redirect = this.$route.query.redirect;
        this.$router.replace(
          typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/admin")
            ? redirect
            : "/"
        );
      } else if (role === "admin") {
        localStorage.setItem("admin_login", token);
        this.$toast.success("Đăng nhập quản trị thành công!");
        const redirect = this.$route.query.redirect;
        this.$router.replace(
          typeof redirect === "string" && redirect.startsWith("/admin") ? redirect : "/admin/dashboard"
        );
      } else {
        const errors = firstError?.response?.data?.errors;
        if (adminFailedMsg) {
          this.$toast.error(adminFailedMsg);
        } else if (errors) {
          Object.values(errors).forEach((messages) => {
            this.$toast.error(Array.isArray(messages) ? messages[0] : messages);
          });
        } else {
          this.$toast.error(firstError?.response?.data?.message || "Email hoặc mật khẩu không đúng.");
        }
      }

      this.loading = false;
    },
  },
};
</script>
