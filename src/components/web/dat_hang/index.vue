<template>
  <div class="card radius-10">
    <div class="card-header border-primary border-3 border-top">
      <h5 class="mb-0"><b>Quản Lý Đơn Hàng</b></h5>
    </div>

    <div class="card-body">
      <div class="row">
        <!-- Bảng đơn hàng -->
        <div class="col-lg-9">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Sản phẩm</th>
                  <th class="text-center">Hình ảnh</th>
                  <th class="text-center">Giá tiền</th>
                  <th class="text-center">Ngày đặt</th>
                  <th class="text-center">Số lượng</th>
                  <th class="text-center">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(donHang, i) in danhSachDonHang" :key="i">
                  <td>{{ donHang.title }}</td>
                  <td class="text-center">
                    <img :src="donHang.hinh_anh" alt="Ảnh SP" class="img-fluid" style="width: 100px; height: 100px" />
                  </td>
                  <td class="text-center">
                    {{ formatVND(donHang.tien_hang) }}
                  </td>
                  <td class="text-center">{{ donHang.ngay_dat }}</td>
                  <td class="text-center">{{ donHang.so_luong }}</td>
                  <td class="text-center">
                    <span v-if="donHang.is_thanh_toan" class="text-success fw-bold">
                      Đã thanh toán
                    </span>
                    <span v-else class="text-warning fw-bold">Chưa thanh toán</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cột tổng tiền -->
        <div class="col-lg-3">
          <div class="card">
            <div class="card-body">
              <h5 class="fw-bold">Chi tiết giá</h5>
              <hr />
              <p><strong>Tổng tiền:</strong> {{ formatVND(subtotal) }}</p>
              <p class="text-success">
                <strong>Giảm giá:</strong> {{ formatVND(discountAmount) }}
              </p>
              <p><strong>Thành tiền:</strong> {{ formatVND(totalPrice) }}</p>

              <button class="btn btn-primary w-100 mt-3" :disabled="isLoading" @click="placeOrder">
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...
                </span>
                <span v-else>
                  <i class="fas fa-cart-arrow-down me-2"></i>Đặt Hàng
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Thanh Toán -->
  <div class="modal fade" id="thanhToanModal" tabindex="-1" aria-hidden="true" ref="thanhToanModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h5 class="modal-title text-white">
            <i class="fas fa-money-check-alt me-2"></i>Cổng Thanh Toán Online
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body p-4">
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>
            Vui lòng quét mã QR để thanh toán đơn hàng.
          </div>

          <div class="row g-4">
            <!-- QR -->
            <div class="col-lg-5">
              <div class="text-center border rounded-3 bg-light p-3">
                <img v-if="linkQR" :src="linkQR" alt="QR Code" class="img-fluid mb-3" style="max-width: 200px" />
                <h5 class="text-primary">Mã đơn: {{ ma_don.ma_don_hang }}</h5>
              </div>
            </div>

            <!-- Thông tin -->
            <div class="col-lg-7">
              <div class="card border-0 bg-light h-100">
                <div class="card-body">
                  <h6 class="text-primary mb-2">
                    <i class="fas fa-user-circle me-2"></i>Thông Tin Người Nhận
                  </h6>
                  <p><b>Họ tên:</b> {{ user.ho_va_ten }}</p>
                  <p><b>SĐT:</b> {{ user.so_dien_thoai }}</p>
                  <p><b>Địa chỉ:</b> {{ user.dia_chi }}</p>

                  <hr />
                  <h6 class="text-primary mb-2">
                    <i class="fas fa-money-bill-wave me-2"></i>Chi Tiết Thanh
                    Toán
                  </h6>
                  <div v-for="(item, i) in danhSachDonHang" :key="i" class="d-flex justify-content-between">
                    <span>{{ item.title }} x{{ item.so_luong }}</span>
                    <span>{{ formatVND(item.tien_hang * item.so_luong) }}</span>
                  </div>
                  <div v-if="selectedVoucher" class="d-flex justify-content-between">
                    Giảm:
                    <span v-if="selectedVoucher.loai_giam">
                      {{ selectedVoucher.so_giam_gia }}%
                    </span>
                    <span v-else>
                      {{ selectedVoucher.so_giam_gia.toLocaleString("vi-VN") }}₫
                    </span>
                  </div>
                  <div v-if="selectedVoucher" class="d-flex justify-content-between">
                    <strong>Voucher đã chọn:</strong>
                    {{ selectedVoucher.ma_code }}
                  </div>

                  <hr />
                  <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>Tổng thanh toán:</span>
                    <span class="text-danger">{{ formatVND(totalPrice) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";

export default {
  data() {
    return {
      danhSachDonHang: [],
      selectedVoucher: null,
      user: {},
      ma_don: {},
      isLoading: false,
      voucherId: null,
      pollingInterval: null,
    };
  },

  computed: {
    subtotal() {
      return this.danhSachDonHang.reduce(
        (sum, item) => sum + item.tien_hang * item.so_luong,
        0
      );
    },
    discountAmount() {
      if (!this.selectedVoucher) return 0;
      return this.selectedVoucher.loai_giam
        ? (this.subtotal * this.selectedVoucher.so_giam_gia) / 100
        : this.selectedVoucher.so_giam_gia;
    },
    totalPrice() {
      return Math.max(this.subtotal - this.discountAmount, 0);
    },
    linkQR() {
      if (!this.ma_don.ma_don_hang || !this.ma_don.tong_tien) return "";
      //return `https://qr.sepay.vn/img?acc=0866179631&bank=MBBank&amount=${this.ma_don.tong_tien}&des=${this.ma_don.ma_don_hang}&template=compact`;
      return `https://img.vietqr.io/image/MB-9997616666-compact2.png?amount=${this.ma_don.tong_tien}&addInfo=${this.ma_don.ma_don_hang}`;
    },
  },

  methods: {
    async fetchDonHang() {
      const token = localStorage.getItem("users_login");
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/customer/gio-hang/data",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res.data.status) {
          this.danhSachDonHang = res.data.data.map((i) => ({
            id: i.id,
            ma_don_hang: i.ma_don_hang || "",
            title: i.product?.title || "Sản phẩm",
            tien_hang: Number(i.price || 0),
            hinh_anh: i.product?.images || "default.jpg",
            so_luong: Number(i.quantity),
            ngay_dat: i.created_at
              ? new Date(i.created_at).toLocaleDateString("vi-VN")
              : new Date().toLocaleDateString("vi-VN"),
            is_thanh_toan: i.is_thanh_toan || 0,
          }));
        }
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
      }
    },

    async layThongTinLogin() {
      const token = localStorage.getItem("users_login");
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/customer/profile",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        if (res.data.status) this.user = res.data.data;
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    },
    async checkPaymentStatus() {
      if (!this.ma_don.ma_don_hang) return;
      try {
        const res = await axios.post(
          "https://citations-wellington-strip-resume.trycloudflare.com/sepay/webhook/check-status",
          { code: this.ma_don.ma_don_hang }
        );

        if (res.data.status && res.data.paid) {
          clearInterval(this.pollingInterval);
          alert("Thanh toán thành công!");
          this.fetchDonHang(); // Cập nhật danh sách
          const modalEl = document.getElementById("thanhToanModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }
      } catch (err) {
        console.error("Lỗi kiểm tra thanh toán:", err);
      }
    },
    async placeOrder() {
      const token = localStorage.getItem("users_login");
      try {
        const payload = {
          items: this.list_order.map((item) => ({
            product_id: item.id,
            quantity: item.buyQuantity,
          })),
          voucher_id: this.voucherId, // gửi id voucher lên backend
        };

        const res = await axios.post(
          "http://127.0.0.1:8000/api/customer/gio-hang/checkout",
          payload,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (res.data.status) {
          this.ma_don = res.data.data[0];
          this.danhSachDonHang = res.data.data;

          const modal = new Modal(document.getElementById("thanhToanModal"));
          modal.show();

          if (this.pollingInterval) clearInterval(this.pollingInterval);
          this.pollingInterval = setInterval(this.checkPaymentStatus, 5000);
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        console.error("Lỗi khi checkout:", err);
      } finally {
        this.isLoading = false;
      }
    },
    async startPollingPaymentStatus(maDon) {
      if (this.pollingInterval) clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/hooks/sepay-payment/check-status",
            { code: maDon }
          );

          if (res.data.status && res.data.paid) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;

            // Cập nhật trạng thái
            this.fetchDonHang();

            // Hiện thông báo
            alert("Thanh toán thành công!");

            // Tự đóng modal
            const modalEl = this.$refs.thanhToanModal;
            const modalInstance = Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
          }
        } catch (err) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán:", err);
        }
      }, 5000);
    },
    formatVND(num) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(num);
    },
  },
  beforeUnmount() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  },
  mounted() {
    this.layThongTinLogin();
    this.fetchDonHang();
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    if (checkoutData) {
      this.list_order = checkoutData.list_order || [];
      this.selectedVoucher = checkoutData.selectedVoucher || null;
      this.voucherId = this.selectedVoucher ? this.selectedVoucher.id : null;
    }
  },
};
</script>
