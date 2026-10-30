<template>
  <div class="row g-3">
    <!-- Chi tiết sản phẩm -->
    <div class="col-lg-8 col-md-12">
      <template v-for="(value, index) in list_order" :key="index">
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-lg-2 text-center">
                <img :src="value.hinh_anh" alt="" class="img-fluid rounded" style="width: 100px; height: 100px;">
              </div>
              <div class="col-lg-7">
                <h5 class="fw-bold">{{ value.title }}</h5>
                <p class="mb-1">
                  <strong>Brand:</strong> {{ value.brand }} |
                  <strong>Bảo hành:</strong> {{ value.warranty }} tháng
                </p>
                <p class="mb-1 text-danger"><strong>Giá:</strong> {{ formatVND(value.tien_hang) }}₫</p>
                <div class="d-flex align-items-center mt-2">
                  <strong class="me-2">Số lượng:</strong>
                  <div class="input-group input-spinner w-auto">
                    <button class="btn btn-outline-secondary" type="button" @click="giamQuantity(index)">−</button>
                    <input type="number" class="form-control text-center" v-model.number="value.buyQuantity"
                      style="width: 60px;" @input="checkQuantity(index)">
                    <button class="btn btn-outline-secondary" type="button" @click="tangQuantity(index) " @change="updateQuantity(item)">+</button>
                  </div>
                  <small class="ms-2 text-muted">Tồn kho: {{ value.quantity }}</small>
                </div>
              </div>
              <div class="col-lg-3 text-end">
                <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalXoa"
                  @click="chonXoa(index)">
                  XÓA
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Chi tiết giá -->
    <div class="col-lg-4 col-md-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="fw-bold">Chi tiết giá</h5>
          <hr />
          <div v-for="(item, idx) in list_order" :key="idx" class="d-flex justify-content-between mb-2">
            <span>{{ item.title }} x{{ item.buyQuantity }}</span>
            <span>{{ (item.tien_hang * item.buyQuantity).toLocaleString('vi-VN') }}₫</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <strong>Tạm tính:</strong>
            <span>{{ subtotal.toLocaleString('vi-VN') }}₫</span>
          </div>
          <div class="mb-3 mt-3">
            <label for="voucher" class="form-label">Mã khuyến mãi:</label>
            <select id="voucher" class="form-select" v-model="selectedVoucher">
              <option :value="null">-- Chọn mã --</option>
              <option v-for="v in vouchers" :key="v.id" :value="v">
                {{ v.ma_code }} - {{ v.loai_giam ? v.so_giam_gia + '%' : v.so_giam_gia.toLocaleString('vi-VN') + '₫' }}
              </option>
            </select>
          </div>
          <div v-if="selectedVoucher" class="d-flex justify-content-between text-success">
            <strong>Giảm giá ({{ selectedVoucher.ma_code }}):</strong>
            <span>-{{ discountAmount.toLocaleString('vi-VN') }}₫</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between fw-bold fs-5">
            <span>Tổng cộng:</span>
            <span>{{ totalPrice.toLocaleString('vi-VN') }}₫</span>
          </div>
          <router-link to="/web/dat-hang" custom v-slot="{ navigate }">
            <button class="btn btn-primary w-100 mt-3" @click="proceedToCheckout(navigate)">
              THANH TOÁN
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal XÓA -->
  <div class="modal fade" id="modalXoa" tabindex="-1" aria-labelledby="modalXoaLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h1 class="modal-title fs-5" id="modalXoaLabel">Xác nhận xoá</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Bạn có chắc muốn xoá <strong>{{ del_order?.title }}</strong> khỏi giỏ hàng không?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="xoaOrder">
            Xoá
          </button>
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
      list_order: [],
      del_index: null,
      del_order: null,
      vouchers: [],
      selectedVoucher: null
    };
  },
  mounted() {
    this.loadData();
    this.loadVouchers();
  },
  methods: {
    loadData() {
      axios.get('http://127.0.0.1:8000/api/customer/gio-hang/data', {
        headers: { Authorization: "Bearer " + localStorage.getItem('users_login') }
      })
        .then(res => {
          this.list_order = res.data.data.map(order => ({
            id: order.id,
            title: order.product?.title || 'Không có tên',
            tien_hang: order.price || order.tien_hang,
            hinh_anh: order.product?.images,
            brand: order.product.brand || '',
            warranty: order.product.warranty || '',
            status: order.status || '',
            quantity: order.product?.quantity || 0, // lấy tồn kho thực tế
            buyQuantity: order.quantity || 1        // số lượng mua
          }));
        })
        .catch(err => {
          console.error("Lỗi load giỏ hàng:", err);
          this.list_order = [];
        });
    },
    formatVND(number) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    },
    loadVouchers() {
      axios.get('http://127.0.0.1:8000/api/customer/voucher/data', {
        headers: { Authorization: "Bearer " + localStorage.getItem('users_login') }
      })
        .then(res => { this.vouchers = res.data.data; })
        .catch(err => console.error("Lỗi load voucher:", err));
    },
     async updateQuantity(item) {
      const token = localStorage.getItem("users_login");
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/customer/gio-hang/update-quantity/${item.id}`,
          { quantity: item.buyQuantity },
          { headers: { Authorization: "Bearer " + token } }
        );
        if(res.data.status){
          // item.quantity = item.buyQuantity;
        }
      } catch(err){
        console.error(err);
      }
    },
   tangQuantity(index) {
  const item = this.list_order[index];
  if (item.buyQuantity < item.quantity) {
    item.buyQuantity++;
    this.updateQuantity(item); 
  } else {
    this.$toast.warning('Bạn đã đạt tối đa số lượng tồn kho!');
  }
},
giamQuantity(index) {
  const item = this.list_order[index];
  if (item.buyQuantity > 1) {
    item.buyQuantity--;
    this.updateQuantity(item);
  }
},
checkQuantity(index) {
  const item = this.list_order[index];
  if (item.buyQuantity < 1) item.buyQuantity = 1;
  if (item.buyQuantity > item.quantity) item.buyQuantity = item.quantity;
  this.updateQuantity(item);
},
    chonXoa(index) {
      this.del_index = index;
      this.del_order = this.list_order[index];
    },
    xoaOrder() {
      if (this.del_index !== null) {
        const cartId = this.list_order[this.del_index].id;
        axios.post(`http://127.0.0.1:8000/api/customer/gio-hang/delete/${cartId}`, {}, {
          headers: { Authorization: "Bearer " + localStorage.getItem('users_login') }
        })
          .then(res => {
            if (res.data.status) {
              this.list_order.splice(this.del_index, 1);
              this.del_index = null;
              this.del_order = null;
              this.$toast.success('Xóa sản phẩm ra khỏi giỏ hàng thành công!');
            } else {
              this.$toast.error('Xóa thất bại!');
            }
          })
          .catch(err => {
            console.error("Lỗi xoá giỏ hàng:", err);
            this.$toast.error('Có lỗi xảy ra khi xoá sản phẩm');
          });
      }
    },
    goToCheckout() {
      this.$router.push({ name: 'DatHang' });
    },
    proceedToCheckout(navigate) {
      const checkoutData = {
        list_order: this.list_order,
        selectedVoucher: this.selectedVoucher
      };
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      navigate();
    }
  },
  computed: {
    subtotal() {
      return this.list_order.reduce((sum, item) => sum + item.tien_hang * item.buyQuantity, 0);
    },
    discountAmount() {
      if (!this.selectedVoucher) return 0;
      return this.selectedVoucher.loai_giam
        ? (this.subtotal * this.selectedVoucher.so_giam_gia) / 100
        : this.selectedVoucher.so_giam_gia;
    },
    totalPrice() {
      const total = this.subtotal - this.discountAmount;
      return total > 0 ? total : 0;
    }
  }
};
</script>
