<template>
  <div class="row">
    <div class="col-lg-6">
      <h3 class="mt-3">Quản lý đơn hàng</h3>
    </div>
    <div class="col-lg-5 text-end mt-1">
      <button class="btn btn-primary mt-3" @click="downloadPDF">
        <i class="fa-solid fa-download"></i> Download PDF
      </button>
    </div>

    <!-- Table -->
    <div class="row mt-3">
      <div class="col-lg-12">
        <div class="table-responsive" style="max-height: 550px; overflow-y: auto; overflow-x: auto;" ref="pdfContent">
          <table class="table table-hover table-bordered align-middle text-center">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Mã code</th>
                <th>Tên Người Nhận</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(value, index) in list_order" :key="value.id">
                <tr>
                  <td>
                    <img :src="value.hinh_anh" alt="Ảnh" class="img-fluid rounded"
                      style="width: 60px; height: 60px; object-fit: cover;" />
                  </td>
                  <td>{{ value.ma_don_hang }}</td>
                  <td>{{ value.ten_nguoi_nhan }}</td>
                  <td>{{ formatPrice(value.tong_tien) }}</td>
                  <td>
                    <span class="badge px-3 py-2" :class="{
                      'bg-danger': value.tinh_trang == 0,
                      'bg-success': value.tinh_trang == 1,
                      'bg-primary': value.tinh_trang == 2,
                      'bg-secondary': value.tinh_trang != 0 && value.tinh_trang != 1 && value.tinh_trang != 2
                    }">
                      {{ getStatusText(value.tinh_trang) }}
                    </span>
                  </td>
                  <td>
                    <button @click="Object.assign(update_order, value)" class="btn btn-sm btn-primary me-2"
                      data-bs-toggle="modal" data-bs-target="#capnhatModal">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#xoaModal"
                      @click="del_order = value">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </template>
              <tr v-if="list_order.length === 0">
                <td colspan="6" class="text-center text-muted py-3">Không có đơn hàng nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Delete -->
  <div class="modal fade" id="xoaModal" tabindex="-1" aria-labelledby="xoaLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="xoaLabel">Xóa Đơn Hàng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger mb-0">
            Bạn có chắc chắn muốn xóa đơn hàng <strong>{{ del_order.ma_don_hang }}</strong> này không?
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button @click="deleteOrder" class="btn btn-danger" data-bs-dismiss="modal">Xác Nhận</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Update -->
  <div class="modal fade" id="capnhatModal" tabindex="-1" aria-labelledby="capnhatLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="capnhatLabel">Cập nhật Đơn Hàng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateOrder">
            <input type="hidden" v-model="update_order.id" />
            <div class="mb-3">
              <label class="form-label">Order Code</label>
              <input type="text" v-model="update_order.ma_don_hang" class="form-control" readonly />
            </div>
            <div class="mb-3">
              <label class="form-label">Price</label>
              <input type="number" v-model="update_order.tong_tien" class="form-control" min="0" />
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select v-model="update_order.tinh_trang" class="form-select">
                <option :value="0">Đã hủy</option>
                <option :value="1">Đã giao</option>
                <option :value="2">Đang giao</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button @click="updateOrder" class="btn btn-primary" data-bs-dismiss="modal">Cập nhật</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      list_order: [],
      update_order: { id: null, ma_don_hang: "", tong_tien: null, tinh_trang: 0 },
      del_order: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      axios
        .get("http://127.0.0.1:8000/api/admin/order/data")
        .then((res) => {
          this.list_order = res.data.data || [];
        })
        .catch(() => {
          this.$toast.error("Không tải được danh sách đơn hàng!");
        });
    },
    formatPrice(value) {
      if (!value) return "0 ₫";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(value);
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return "Đã hủy";
        case 1:
          return "Đã giao";
        case 2:
          return "Đang giao";
        default:
          return "Không rõ";
      }
    },
    deleteOrder() {
      axios
        .post("http://127.0.0.1:8000/api/admin/order/delete", this.del_order)
        .then((res) => {
          if (res.data.status) {
            this.$toast.success(res.data.message);
            this.loadData();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch(() => {
          this.$toast.error("Lỗi khi xóa đơn hàng!");
        });
    },
    updateOrder() {
      axios
        .post("http://127.0.0.1:8000/api/admin/order/update", this.update_order)
        .then((res) => {
          if (res.data.status) {
            this.$toast.success(res.data.message || "Cập nhật thành công!");
            this.loadData();
          } else {
            this.$toast.error(res.data.message || "Cập nhật thất bại!");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 422) {
              const errors = error.response.data.errors || {};
              Object.values(errors).flat().forEach((m) => this.$toast.error(m));
            } else {
              const msg = error.response.data?.message || "Lỗi server";
              this.$toast.error(msg);
            }
            console.error("Server response:", error.response.data);
          } else {
            this.$toast.error("Không kết nối được server");
            console.error(error);
          }
        });
    },
    async downloadPDF() {
      const doc = new jsPDF("p", "mm", "a4");
      const pdfContent = this.$refs.pdfContent;
      const canvas = await html2canvas(pdfContent, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      doc.save("order-report.pdf");
    }
  }
};
</script>
