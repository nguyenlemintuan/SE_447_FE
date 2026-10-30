<template>
    <div class="card">
        <div class="card-body">
            <div class="border p-4 rounded">
                <div class="text-center">
                    <h3 class=""><i class="fa-regular fa-address-card me-2"></i>Đăng Nhập Tài Khoản</h3>
                </div>
                <div class="login-separater text-center mb-4"> <span>OR SIGN IN WITH EMAIL</span>
                    <hr />
                </div>
                <div class="form-body">
                    <div class="row g-3">
                        <div class="col-12">
                            <label for="inputEmailAddress" class="form-label">Địa chỉ Email</label>
                            <input type="email" class="form-control" id="inputEmailAddress"
                                autocomplete="current-password" v-model="user.email" placeholder="Nhập địa chỉ email">
                        </div>

                        <div class="col-12">
                            <label for="inputChoosePassword" class="form-label">Nhập Mật Khẩu</label>
                            <div class="input-group" id="show_hide_password">
                                <input type="password" class="form-control border-end-0" id="inputChoosePassword"
                                    v-model="user.password" placeholder="Nhập mật khẩu">
                                <a href="javascript:;" class="input-group-text bg-transparent">
                                    <i class='bx bx-hide'></i>
                                </a>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                                <label class="form-check-label" for="flexSwitchCheckChecked">Remember Me</label>
                            </div>
                        </div>
                        <div class="col-md-6 text-end"> <a href="/users/dang-ky">Đăng ký tài khoản
                                ?</a>
                        </div>
                        <div class="col-12">
                            <div class="d-grid">
                                <button class="btn btn-primary" v-on:click="Login()"><i
                                        class="bx bxs-lock-open"></i>Đăng
                                    Nhập</button>
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
                .post("http://127.0.0.1:8000/api/customer/dang-nhap", this.user)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        localStorage.setItem('users_login', res.data.token),
                            this.$router.push('/')
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