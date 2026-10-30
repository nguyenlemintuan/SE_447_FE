<template>
  <div class="row mt-2">
    <div class="col-lg-12">
      <div class="card">
        <div class="row g-0">
          <div class="col-md-4 border-end">
            <img
              :src="product.images"
              class="img-fluid"
              alt="Sản phẩm"
              style="width: 100%; height: 100%"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h4 class="card-title">{{ product.title }}</h4>
              <div class="d-flex gap-3 py-3">
                <div class="text-success">
                  <i class="bx bxs-cart-alt align-middle"></i>
                  {{ product.sold_quantity }} đơn hàng
                </div>
              </div>
              <div class="mb-3">
                <span class="price h4">{{
                  formatCurrency(product.price)
                }}</span>
                <span class="text-muted">/mỗi sản phẩm</span>
              </div>
              <p class="card-text fs-6">
                {{ product.description || "Chưa có mô tả sản phẩm" }}
              </p>
              <dl class="row">
                <dt class="col-sm-3">Mã sản phẩm</dt>
                <dd class="col-sm-9">{{ product.slug }}</dd>
                <dt class="col-sm-3">Màu sắc</dt>
                <dd class="col-sm-9">---</dd>
                <dt class="col-sm-3">Giao hàng</dt>
                <dd class="col-sm-9">Đà Nẵng, Sài Gòn, Hà Nội</dd>
              </dl>
              <hr />
              <div
                class="row row-cols-auto row-cols-1 row-cols-md-3 align-items-center"
              >
                <div class="col">
                  <label class="form-label">Số lượng</label>
                  <div class="input-group input-spinner">
                    <button
                      class="btn btn-white"
                      type="button"
                      id="button-plus"
                      @click="tangQuantity(index)"
                    >
                      +
                    </button>
                    <!-- Ô nhập số lượng -->
                    <input
                      type="text"
                      class="form-control text-center"
                      v-model.number="buyQuantity"
                    />

                    <button
                      class="btn btn-white"
                      type="button"
                      id="button-minus"
                      @click="giamQuantity(index)"
                    >
                      −
                    </button>
                  </div>
                </div>
              </div>
              <div class="d-flex gap-3 mt-3">
                <a href="#" class="btn btn-primary">Mua ngay</a>
                <a href="#" class="btn btn-outline-primary"
                  ><button type="button" class="btn btn-sm"
                                @click.stop.prevent="addToCart(product)">
                                Thêm vào giỏ hàng
                            </button>
                  <i class="bx bxs-cart-alt"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="card-body">
          <!-- Tabs -->
          <!-- Tabs -->
          <ul class="nav nav-tabs nav-primary mb-3" role="tablist">
            <!-- Mô tả sản phẩm -->
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                data-bs-toggle="tab"
                href="#descriptionTab"
                role="tab"
                aria-selected="true"
              >
                <div class="d-flex align-items-center">
                  <div class="tab-icon">
                    <i class="bx bx-comment-detail font-18 me-1"></i>
                  </div>
                  <div class="tab-title">Mô tả sản phẩm</div>
                </div>
              </a>
            </li>

            <!-- Thẻ sản phẩm -->
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#tagsTab"
                role="tab"
              >
                <div class="d-flex align-items-center">
                  <div class="tab-icon">
                    <i class="bx bx-bookmark-alt font-18 me-1"></i>
                  </div>
                  <div class="tab-title">Thẻ</div>
                </div>
              </a>
            </li>

            <!-- Bình luận / Review -->
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#reviewsTab"
                role="tab"
              >
                <div class="d-flex align-items-center">
                  <div class="tab-icon">
                    <i class="bx bx-star font-18 me-1"></i>
                  </div>
                  <div class="tab-title">Đánh giá</div>
                </div>
              </a>
            </li>
          </ul>

          <!-- Nội dung Tabs -->
          <div class="tab-content">
            <!-- Mô tả sản phẩm -->
            <div
              class="tab-pane fade show active"
              id="descriptionTab"
              role="tabpanel"
            >
              <ul class="list-group">
                <li
                  v-for="(value, index) in specs"
                  :key="index"
                  class="list-group-item d-flex justify-content-between"
                >
                  <span class="fw-bold">{{ value.key }}</span>
                  <span>{{ value.value }}</span>
                </li>
              </ul>
            </div>

            <!-- Thẻ sản phẩm -->
            <div class="tab-pane fade" id="tagsTab" role="tabpanel">
              <ul class="list-inline">
                <li class="list-inline-item badge bg-primary">
                  Thương hiệu: {{ product.brand }}
                </li>
                <li class="list-inline-item badge bg-success">
                  Bảo hành: {{ product.warranty }} tháng
                </li>
              </ul>
            </div>

            <!-- Review sản phẩm -->
            <div class="tab-pane fade" id="reviewsTab" role="tabpanel">
              <div class="mb-3">
                <strong>Đánh giá trung bình:</strong>
                {{ product.avgRating || 0 }} ({{
                  product.reviewCount || 0
                }}
                đánh giá)
              </div>
              <div class="mb-3">
                <strong>Comment:</strong> {{ product.comment }}
              </div>
              <ul class="list-group">
                <li
                  v-for="(review, index) in reviews"
                  :key="index"
                  class="list-group-item"
                >
                  <p>{{ review.comment }}</p>
                  <small class="text-muted">{{
                    new Date(review.created_at).toLocaleString()
                  }}</small>
                </li>
              </ul>
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
      product: {},
      specs: [],
      reviews: [],
      specLabels: {
        pin: "Dung lượng pin",
        cong_suat: "Hỗ trợ sạc tối đa",
        dientich: "Diện tích làm sạch",
        ketnoi: "Cổng kết nối/sạc",
        thoi_gian_sac: "Thời gian sạc",
        tinh_nang: "Tính năng",
      },
      buyQuantity: 1,
    };
  },
  mounted() {
    this.fetchProductDetail();
    this.fetchReviews();
  },
  methods: {
    fetchProductDetail() {
      const productId = this.$route.params.id;
      axios
        .get(`http://127.0.0.1:8000/api/admin/products/${productId}`)
        .then((res) => {
          this.product = res.data.data;
          if (this.product.specs) {
            const parsedSpecs = JSON.parse(this.product.specs);
            this.specs = Object.entries(parsedSpecs).map(([key, value]) => ({
              key: this.specLabels[key] || key, // dùng nhãn đẹp
              value,
            }));
          } else {
            this.specs = [];
          }
        })
        .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
    },
    addToCart(product) {
            console.log('addToCart clicked', product.id);
            axios.post('http://127.0.0.1:8000/api/customer/gio-hang/add', {
                product_id: product.id,
                quantity: 1
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('users_login')
                }
            })
                .then(res => {
                    console.log('Thêm vào giỏ hàng thành công', res.data);
                    this.$toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
                })
                .catch(err => console.error(err));
        },
    fetchReviews() {
      const productId = this.$route.params.id;
      axios
        .get(`http://127.0.0.1:8000/api/customer/products/${productId}/reviews`)
        .then((res) => {
          this.reviews = res.data.data;
        })
        .catch((err) => console.error("Lỗi khi tải đánh giá:", err));
    },
    formatCurrency(value) {
      if (!value) return "0 đ";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    tangQuantity() {
      this.buyQuantity++;
    },
    giamQuantity() {
      if (this.buyQuantity > 1) {
        this.buyQuantity--;
      }
    },
  },
};
</script>

<style></style>
