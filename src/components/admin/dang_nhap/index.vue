<template>
    <div class="card">
        <div class="card-body">
            <div class="border p-4 rounded">
                <div class="text-center">
                    <h3 class=""><i class="fa-regular fa-address-card me-2"></i>Đăng Nhập Admin</h3>
                </div>
                <div class="login-separater text-center mb-4"> <span>OR SIGN IN WITH EMAIL</span>
                    <hr />
                </div>
                <div class="form-body">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label">Email</label>
                            <div class="input-group">
                                <span class="input-group-text bg-transparent">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                                <input type="email" v-model="user.email" class="form-control border-start-0"
                                    placeholder="Email">
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Mật khẩu</label>
                            <div class="input-group">
                                <span class="input-group-text bg-transparent">
                                    <i class="fa-solid fa-lock"></i>
                                </span>
                                <input type="password" v-model="user.password" class="form-control border-start-0"
                                    placeholder="Mật khẩu">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                                <label class="form-check-label" for="flexSwitchCheckChecked">Remember Me</label>
                            </div>
                        </div>
                        <div class="col-md-6 text-end"> <a href="/admin/quen-mat-khau">Forgot Password
                                ?</a>
                        </div>
                        <div class="col-12">
                            <div class="d-grid">
                                <button v-on:click="Login()" class="btn btn-primary"><i type="button"
                                        class="bx bxs-lock-open"></i>Đăng Nhập</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            user: { email: "", password: "" }
        }
    },
    methods: {
        Login() {
            axios
                .post("http://127.0.0.1:8000/api/admin/dang-nhap", this.user)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        localStorage.setItem('admin_login', res.data.token),
                            this.$router.push('/admin/dashboard')
                    }
                    else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((res) => {
                    const list = Object.values(res.response.data.errors);
                    list.forEach((v, i) => {
                        this.$toast.error(v[0]);
                    });
                })
        }
    },
}
</script>
<style></style>