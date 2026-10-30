<template>
    <div class="container mt-4">
        <div v-if="loading" class="text-center">Đang tải sản phẩm...</div>

        <div v-else-if="product" class="card shadow-sm p-3">
            <h5 class="mb-3">Đánh giá sản phẩm</h5>

            <div class="text-center">
                <img :src="product.images || placeholderImage" alt="image" class="img-thumbnail mb-2"
                    style="width:100px;height:100px;object-fit:cover;">
                <p class="fw-bold">{{ product.title }}</p>
            </div>

            <div class="text-center mb-3">
                <span v-for="star in 5" :key="star" @click="setRating(star)"
                    :style="{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#6c757d', fontSize: '1.5rem' }">
                    ★
                </span>
            </div>

            <div class="mb-3">
                <textarea v-model="comment" class="form-control" rows="4" placeholder="Nhập bình luận..."></textarea>
            </div>

            <div class="text-center">
                <button class="btn btn-primary" @click="submitReview">Gửi đánh giá</button>
            </div>

            <hr>

            <div v-if="reviews.length">
                <h6>Đánh giá trước đó:</h6>
                <div v-for="r in reviews" :key="r.id" class="border p-2 mb-2 rounded">
                    <div>
                        <strong>{{ r.user.name }}</strong>
                        <span class="ms-2">
                            <span v-for="i in 5" :key="i"
                                :style="{ color: i <= r.rating ? '#ffc107' : '#6c757d' }">★</span>
                        </span>
                    </div>
                    <p>{{ r.comment }}</p>
                    <small class="text-muted">{{ new Date(r.created_at).toLocaleString() }}</small>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-danger">
            Không tìm thấy sản phẩm.
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: { productId: { type: Number, required: true } },
    data() {
        return {
            product: null,
            reviews: [],
            rating: 0,
            comment: '',
            loading: true,
            placeholderImage: 'https://via.placeholder.com/100'
        };
    },
    mounted() {
        this.fetchProduct();
        this.fetchReviews();
    },
    methods: {
        async fetchProduct() {
            this.loading = true;
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/admin/products/${this.productId}`);
                if (res.data.status) this.product = res.data.data;
            } catch (err) {
                console.error(err);
            } finally { this.loading = false; }
        },
        async fetchReviews() {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/products/${this.productId}/reviews`);
                if (res.data.status) this.reviews = res.data.data;
            } catch (err) { console.error(err); }
        },
        setRating(star) { this.rating = star; },
        async submitReview() {
            if (!this.rating) {
                this.$toast.warning("Vui lòng chọn số sao!");
                return;
            }

            const token = localStorage.getItem('users_login');
            if (!token) {
                this.$toast.warning("Bạn cần đăng nhập để đánh giá sản phẩm.");
                return;
            }

            try {
                const res = await axios.post(
                    `http://127.0.0.1:8000/api/customer/products/${this.productId}/review`,
                    { rating: this.rating, comment: this.comment },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.status === 'success') {
                    alert("Cảm ơn bạn đã đánh giá!");
                    this.rating = 0;
                    this.comment = '';
                    this.reviews.unshift(res.data.data);
                } else {
                    this.$toast.error(res.data.message || "Đã xảy ra lỗi.");
                }
            } catch (err) {
                console.error(err);
                this.$toast.error("Đã xảy ra lỗi.");
            }
        }


    }
};
</script>

<style scoped></style>
