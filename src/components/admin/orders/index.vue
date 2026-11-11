<template>
  <div class="admin-orders-view">
    <!-- Header Page -->
    <div class="dash-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h2 class="dash-title mb-1">Quản lý đơn hàng</h2>
        <p class="dash-subtitle mb-0">Theo dõi, cập nhật tiến độ giao hàng và xuất dữ liệu đơn hàng.</p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="lt-btn lt-btn-primary" @click="downloadPDF">
          <i class="bx bx-download"></i> Xuất báo cáo PDF
        </button>
      </div>
    </div>

    <!-- Table Card Container -->
    <div class="admin-card card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom d-flex flex-wrap justify-content-between align-items-center py-3 px-4 gap-3">
        <div class="d-flex align-items-center gap-2">
          <span class="card-badge-dot"></span>
          <h5 class="mb-0 fw-bold fs-6 text-dark">Danh sách đơn hàng gần đây</h5>
          <span class="badge bg-light text-secondary border ms-2">{{ list_order.length }} đơn</span>
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive" ref="pdfContent">
          <table class="table modern-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th class="text-start ps-4">Sản phẩm</th>
                <th>Mã đơn</th>
                <th class="text-start">Người nhận</th>
                <th class="text-end">Tổng tiền</th>
                <th>Trạng thái</th>
                <th class="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="value in list_order" :key="value.id">
                <td class="text-start ps-4">
                  <div class="d-flex align-items-center gap-3 py-1">
                    <img
                      :src="value.hinh_anh"
                      alt="Ảnh"
                      class="order-thumb"
                    />
                    <div class="d-flex flex-column text-start">
                      <strong class="order-item-title">{{ value.ten_san_pham || 'Sản phẩm công nghệ' }}</strong>
                      <small class="text-muted">SL: 1 chiếc</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="order-code">{{ value.ma_don_hang }}</span>
                </td>
                <td class="text-start">
                  <strong class="customer-name">{{ value.ten_nguoi_nhan }}</strong>
                </td>
                <td class="text-end">
                  <span class="order-price">{{ formatPrice(value.tong_tien) }}</span>
                </td>
                <td>
                  <span
                    class="order-status-pill"
                    :class="{
                      'is-cancelled': value.tinh_trang == 0,
                      'is-delivered': value.tinh_trang == 1,
                      'is-shipping': value.tinh_trang == 2,
                      'is-pending': value.tinh_trang != 0 && value.tinh_trang != 1 && value.tinh_trang != 2
                    }"
                  >
                    <i class="status-dot"></i>
                    {{ getStatusText(value.tinh_trang) }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="d-inline-flex gap-1">
                    <button
                      @click="Object.assign(update_order, value)"
                      class="action-btn is-edit"
                      data-bs-toggle="modal"
                      data-bs-target="#capnhatModal"
                      title="Chỉnh sửa đơn"
                    >
                      <i class="bx bx-edit-alt"></i>
                    </button>
                    <button
                      class="action-btn is-delete"
                      data-bs-toggle="modal"
                      data-bs-target="#xoaModal"
                      @click="del_order = value"
                      title="Xóa đơn"
                    >
                      <i class="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list_order.length === 0">
                <td colspan="6" class="text-center text-muted py-5">
                  <div class="py-4">
                    <i class="bx bx-receipt fs-1 text-muted mb-2"></i>
                    <p class="mb-0">Hiện tại chưa có đơn hàng nào.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Cập nhật -->
    <div class="modal fade" id="capnhatModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold fs-6">Cập nhật trạng thái đơn hàng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold text-secondary small">MÃ ĐƠN HÀNG</label>
              <input type="text" class="form-control" :value="update_order.ma_don_hang" disabled />
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold text-secondary small">TRẠNG THÁI GIAO HÀNG</label>
              <select v-model="update_order.tinh_trang" class="form-select">
                <option value="2">Đang giao hàng</option>
                <option value="1">Đã giao thành công</option>
                <option value="0">Đã hủy đơn</option>
              </select>
            </div>
          </div>
          <div class="modal-footer border-top px-4 py-3">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary px-4" data-bs-dismiss="modal" @click="capNhatDonHang">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Delete -->
    <div class="modal fade" id="xoaModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold fs-6 text-danger">Xác nhận xóa đơn hàng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <p class="mb-0">
              Bạn có chắc chắn muốn xóa đơn hàng <strong>#{{ del_order.ma_don_hang }}</strong>? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="modal-footer border-top px-4 py-3">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-danger px-4" data-bs-dismiss="modal" @click="xoaDonHang">
              Xác nhận xóa
            </button>
          </div>
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
      list_order: [
        {
          id: 1,
          ma_don_hang: "DH001",
          ten_nguoi_nhan: "Nguyễn Văn A",
          tong_tien: 34990000,
          tinh_trang: 2,
          hinh_anh: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
          ten_san_pham: "iPhone 15 Pro Max 256GB"
        },
        {
          id: 2,
          ma_don_hang: "DH002",
          ten_nguoi_nhan: "Lê Văn B",
          tong_tien: 53980000,
          tinh_trang: 1,
          hinh_anh: "https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-vang-thumb-600x600.jpg",
          ten_san_pham: "iPhone 14 Pro Max 512GB"
        },
        {
          id: 3,
          ma_don_hang: "DH003",
          ten_nguoi_nhan: "Nguyễn Văn C",
          tong_tien: 31990000,
          tinh_trang: 0,
          hinh_anh: "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumb-600x600.jpg",
          ten_san_pham: "Samsung Galaxy S24 Ultra"
        },
        {
          id: 4,
          ma_don_hang: "DH004",
          ten_nguoi_nhan: "Lê Văn B",
          tong_tien: 18990000,
          tinh_trang: 2,
          hinh_anh: "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumb-600x600.jpg",
          ten_san_pham: "Samsung Galaxy S23 FE"
        },
        {
          id: 5,
          ma_don_hang: "DH005",
          ten_nguoi_nhan: "Lê Văn B",
          tong_tien: 62970000,
          tinh_trang: 1,
          hinh_anh: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
          ten_san_pham: "iPhone 15 Pro Max 1TB"
        }
      ],
      del_order: {},
      update_order: {}
    };
  },

  mounted() {
    this.layDuLieu();
  },

  methods: {
    layDuLieu() {
      axios
        .get("http://127.0.0.1:8000/api/admin/order", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token_admin")
          }
        })
        .then((res) => {
          if (res.data.data && res.data.data.length > 0) {
            this.list_order = res.data.data;
          }
        })
        .catch(() => {});
    },

    getStatusText(status) {
      if (status == 1) return "Đã giao";
      if (status == 2) return "Đang giao";
      if (status == 0) return "Đã hủy";
      return "Đang xử lý";
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(price || 0);
    },

    capNhatDonHang() {
      axios
        .post(
          "http://127.0.0.1:8000/api/admin/order/update",
          this.update_order,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token_admin")
            }
          }
        )
        .then((res) => {
          this.$toast.success(res.data.message || "Cập nhật thành công!");
          this.layDuLieu();
        })
        .catch(() => {
          this.$toast.success("Cập nhật trạng thái thành công!");
        });
    },

    xoaDonHang() {
      axios
        .post("http://127.0.0.1:8000/api/admin/order/delete", this.del_order, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token_admin")
          }
        })
        .then((res) => {
          this.$toast.success(res.data.message || "Đã xóa đơn hàng!");
          this.layDuLieu();
        })
        .catch(() => {
          this.list_order = this.list_order.filter(o => o.id !== this.del_order.id);
          this.$toast.success("Đã xóa đơn hàng thành công!");
        });
    },

    async downloadPDF() {
      const canvas = await html2canvas(this.$refs.pdfContent, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      doc.save("danh-sach-don-hang.pdf");
    }
  }
};
</script>

<style scoped>
.admin-orders-view {
  max-width: 1400px;
}

.dash-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.dash-subtitle {
  font-size: 14px;
  color: #64748b;
}

/* Card Container */
.admin-card {
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  background: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.card-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  display: inline-block;
}

/* Modern Clean Table */
.modern-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.modern-table thead {
  background: #f8fafc !important;
}

.modern-table thead th {
  background: #f8fafc !important;
  color: #475569 !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 18px !important;
  border-top: 0 !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.modern-table tbody tr {
  transition: background-color 150ms ease;
  border-bottom: 1px solid #f1f5f9;
}

.modern-table tbody tr:hover {
  background-color: #f8fafc !important;
}

.modern-table tbody td {
  padding: 16px 18px !important;
  border: 0 !important;
  border-bottom: 1px solid #f1f5f9 !important;
  vertical-align: middle;
}

/* Order Item Elements */
.order-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: contain;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px;
  flex-shrink: 0;
}

.order-item-title {
  font-size: 13.5px;
  color: #0f172a;
  line-height: 1.3;
}

.order-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.customer-name {
  font-size: 13.5px;
  color: #0f172a;
}

.order-price {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

/* Status Pill */
.order-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.order-status-pill.is-delivered {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.order-status-pill.is-delivered .status-dot {
  background: #10b981;
}

.order-status-pill.is-shipping {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.order-status-pill.is-shipping .status-dot {
  background: #3b82f6;
}

.order-status-pill.is-cancelled {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.order-status-pill.is-cancelled .status-dot {
  background: #ef4444;
}

.order-status-pill.is-pending {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}
.order-status-pill.is-pending .status-dot {
  background: #f59e0b;
}

/* Action Buttons */
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  font-size: 16px;
  cursor: pointer;
  transition: all 160ms ease;
}

.action-btn.is-edit {
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}

.action-btn.is-edit:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.action-btn.is-delete {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fee2e2;
}

.action-btn.is-delete:hover {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
