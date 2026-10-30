<template>
    <div class="card">
        <div class="row g-0">
            <div class="col-lg-12 border-end">
                <div class="card-body">
                    <div class="p-5">
                        <div class="text-center">
                           <h4 class="logo-text mb-0 fw-bold">
                               <a href="/" class="text-success text-decoration-none">Shop SE447</a>
                           </h4>
                        </div>
                        <h4 class="mt-5 font-weight-bold">Đổi Mật Khẩu</h4>
                        <p class="text-muted">Vui lòng nhập mật khẩu cũ và mật khẩu mới của bạn!</p>

                        <div class="mb-3 mt-5">
                            <label class="form-label">Mật Khẩu Cũ</label>
                            <input type="password" class="form-control" placeholder="Nhập mật khẩu cũ" v-model="oldPassword">
                        </div>
                        <div class="mb-3 mt-3">
                            <label class="form-label">Mật Khẩu Mới</label>
                            <input type="password" class="form-control" placeholder="Nhập mật khẩu mới" v-model="newPassword">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Xác Nhận Mật Khẩu</label>
                            <input type="password" class="form-control" placeholder="Xác nhận mật khẩu" v-model="confirmPassword">
                        </div>

                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary" @click="changePassword">Đổi Mật Khẩu</button>
                            <a href="/" class="btn btn-light">
                                <i class="bx bx-arrow-back me-1"></i>Quay Lại Trang Chủ
                            </a>
                        </div>
                    </div>
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
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    },
    methods: {
        async changePassword() {
            if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
                this.$toast.error("Vui lòng điền đầy đủ thông tin!");
                return;
            }
            if (this.newPassword !== this.confirmPassword) {
                 this.$toast.error("Mật khẩu nhập lại không khớp!");
                return;
            }

            try {
                const token = localStorage.getItem("users_login"); // lấy token từ localStorage
                const res = await axios.post(
                    "http://127.0.0.1:8000/api/customer/profile/update-password",
                    {
                        old_password: this.oldPassword,
                        password: this.newPassword
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                );

                if (res.data.status === 1) {
                     this.$toast.success(res.data.message);
                    this.oldPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                } else {
                   this.$toast.error(res.data.message);
                }
            } catch (err) {
                console.error(err);
                 this.$toast.error("Có lỗi xảy ra khi đổi mật khẩu!");
            }
        }
    }
}
</script>

<style scoped>
.authentication-reset-password {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    border-radius: 12px;
    overflow: hidden;
    max-width: 500px;
    margin: auto;
}
</style>
