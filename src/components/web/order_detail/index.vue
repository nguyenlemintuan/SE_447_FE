<template>
    <section class="vh-100" style="background-color: #eee;">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col">
                    <div class="card card-stepper p-4" style="border-radius: 10px;">
                        <h3 class="text-center">📦 Chi Tiết Đơn Hàng</h3>

                        <div v-if="order">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="d-flex flex-column">
                                    <span class="lead fw-bold">{{ order.ma_don_hang }}</span>
                                    <span class="text-muted small">Người mua: {{ order.ten_nguoi_nhan}}</span>
                                </div>
                                <div>
                                    <button class="btn btn-outline-primary">📍 Theo dõi đơn hàng</button>
                                </div>
                            </div>

                            <div class="row align-items-center">
                                <div class="col-md-4 text-center">
                                    <img :src="order.hinh_anh" alt="Hình ảnh sản phẩm" class="product-image">
                                </div>
                                <div class="col-md-8">
                                    <p><strong>💰 Giá tiền:</strong> <span class="text-success">{{
                                            formatCurrency(order.tien_hang) }}</span></p>
                                    <p><strong>📦 Số lượng:</strong> {{ order.so_luong }}</p>
                                    <p><strong>🚀 Trạng thái:</strong> <span :class="getStatusClass(order.tinh_trang)">{{
                                            getStatusText(order.tinh_trang) }}</span></p>
                                </div>
                            </div>

                            <hr class="my-4">

                            <!-- Timeline trạng thái đơn hàng -->
                            <div
                                class="d-flex flex-row justify-content-between align-items-center align-content-center">
                                <span class="dot"></span>
                                <hr class="flex-fill track-line"><span class="dot"></span>
                                <hr class="flex-fill track-line"><span class="dot"></span>
                                <hr class="flex-fill track-line"><span class="dot"></span>
                                <hr class="flex-fill track-line"><span :class="getStatusDotClass(order.tinh_trang)">
                                    <i class="fa fa-check text-white"></i></span>
                            </div>

                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <div class="d-flex flex-column align-items-start"><span>🛒 Đã đặt hàng</span></div>
                                <div class="d-flex flex-column align-items-center"><span>📦 Đang đóng gói</span></div>
                                <div class="d-flex flex-column align-items-center"><span>🚛 Đang giao hàng</span></div>
                                <div class="d-flex flex-column align-items-center"><span>🏠  Đang đến nơi</span></div>
                                <div class="d-flex flex-column align-items-end"><span :class="getStatusClass(order.tinh_trang)">{{
                                            getStatusText(order.tinh_trang) }}</span></div>
                            </div>
                        </div>
                        <div v-else class="text-center">
                            <p>⏳ Đang tải đơn hàng...</p>
                        </div>

                        <button @click="$router.go(-1)" class="btn btn-secondary mt-3">🔙 Quay lại</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            order: null
        };
    },
    mounted() {
        this.fetchOrderDetail();
    },
    methods: {
        fetchOrderDetail() {
            const orderId = this.$route.params.id;
            axios.get(`http://127.0.0.1:8000/api/admin/order/${orderId}`)
                .then(res => {
                    this.order = res.data.data;
                })
                .catch(error => {
                    console.error("Lỗi khi tải chi tiết đơn hàng:", error);
                });
        },
        getStatusText(tinh_trang) {
            return tinh_trang == 0 ? "🚫 Đã hủy" : tinh_trang == 1 ? "✅ Đã giao" : "🚚 Đang giao";
        },
        getStatusClass(tinh_trang) {
            return tinh_trang == 0 ? "text-danger fw-bold" : tinh_trang == 1 ? "text-success fw-bold" : "text-warning fw-bold";
        },
        getStatusDotClass(tinh_trang) {
            return tinh_trang == 1 ? "d-flex justify-content-center align-items-center big-dot dot bg-success" : "d-flex justify-content-center align-items-center big-dot dot bg-warning";
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(value);
        }
    }
};
</script>

<style scoped>
.card-stepper {
    background: white;
    border-radius: 10px;
    padding: 20px;
}

.product-image {
    width: 100%;
    max-width: 250px;
    border-radius: 10px;
    border: 1px solid #ddd;
    padding: 5px;
    background: white;
}

.dot {
    height: 15px;
    width: 15px;
    background-color: gray;
    border-radius: 50%;
}

.big-dot {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    color: white;
}

.track-line {
    height: 4px;
    width: 100%;
    background-color: lightgray;
}

.text-primary {
    font-weight: bold;
}

.btn {
    display: block;
    width: 100%;
}
</style>
