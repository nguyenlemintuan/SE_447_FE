<template>
  <div class="admin-thongke-view">
    <!-- Header Page -->
    <div class="dash-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h2 class="dash-title mb-1">Thống kê khách hàng</h2>
        <p class="dash-subtitle mb-0">Phân tích tần suất mua hàng, giá trị đơn hàng trung bình và top khách hàng tiềm năng.</p>
      </div>
      <button class="lt-btn lt-btn-primary" @click="downloadPDF">
        <i class="bx bx-download"></i> Xuất báo cáo PDF
      </button>
    </div>

    <!-- Bộ lọc ngày -->
    <div class="admin-card card border-0 shadow-sm mb-4">
      <div class="card-body p-3 px-4">
        <form class="row g-3 align-items-end" @submit.prevent="thongKe">
          <div class="col-12 col-md-4">
            <label class="form-label fw-semibold small text-secondary">TỪ NGÀY</label>
            <input type="date" v-model="fromDate" class="form-control" />
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label fw-semibold small text-secondary">ĐẾN NGÀY</label>
            <input type="date" v-model="toDate" class="form-control" />
          </div>
          <div class="col-12 col-md-4 d-flex gap-2">
            <button type="submit" class="lt-btn lt-btn-primary flex-grow-1" :disabled="loading">
              <i v-if="loading" class="bx bx-loader-alt bx-spin"></i>
              <i v-else class="bx bx-filter-alt"></i>
              {{ loading ? 'Đang lọc...' : 'Lọc số liệu' }}
            </button>
            <button type="button" class="lt-btn lt-btn-outline" @click="resetBoLoc">
              <i class="bx bx-reset"></i>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Biểu đồ & Bảng số liệu -->
    <div class="row g-4" ref="pdfContent">
      <!-- Biểu đồ Tỷ trọng -->
      <div class="col-12 col-xl-5">
        <div class="admin-card card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center gap-2">
            <span class="card-badge-dot"></span>
            <h5 class="mb-0 fw-bold fs-6 text-dark">Tỷ trọng đóng góp doanh thu</h5>
          </div>
          <div class="card-body d-flex align-items-center justify-content-center p-4">
            <div class="chart-wrapper w-100">
              <canvas id="chartCustomer"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Bảng khách hàng -->
      <div class="col-12 col-xl-7">
        <div class="admin-card card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <span class="card-badge-dot"></span>
              <h5 class="mb-0 fw-bold fs-6 text-dark">Bảng xếp hạng đóng góp</h5>
            </div>
            <span class="badge bg-light text-secondary border">{{ customers.length }} khách</span>
          </div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table modern-table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th class="ps-4 text-start">Khách hàng</th>
                    <th class="text-center">Số đơn</th>
                    <th class="text-end">Tổng tiền mua</th>
                    <th class="text-end pe-4">Đơn lớn nhất</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(c, i) in customers" :key="i">
                    <td class="ps-4 text-start">
                      <div class="d-flex align-items-center gap-2">
                        <span class="customer-avatar">{{ c.ten_nguoi_nhan ? c.ten_nguoi_nhan.charAt(0) : 'K' }}</span>
                        <strong>{{ c.ten_nguoi_nhan }}</strong>
                      </div>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-light text-dark border px-2 py-1">{{ c.orders }} đơn</span>
                    </td>
                    <td class="text-end">
                      <strong class="text-dark">{{ formatMoney(c.total) }}</strong>
                    </td>
                    <td class="text-end pe-4">
                      <span class="text-muted">{{ formatMoney(c.maxOrder) }}</span>
                    </td>
                  </tr>

                  <tr v-if="customers.length === 0">
                    <td colspan="4" class="text-center text-muted py-5">
                      <div class="py-4">
                        <i class="bx bx-user-x fs-1 text-muted mb-2"></i>
                        <p class="mb-0">Không có dữ liệu khách hàng trong khoảng thời gian đã chọn.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

Chart.register(...registerables);

export default {
  data() {
    return {
      fromDate: "",
      toDate: "",
      chart: null,
      loading: false,

      // Fallback mock nếu API chưa có dữ liệu
      customersDB: [
        { id: 1, ho_va_ten: "Nguyễn Văn A" },
        { id: 2, ho_va_ten: "Trần Thị B" },
        { id: 3, ho_va_ten: "Lê Văn C" }
      ],
      ordersDB: [
        { id_khach_hang: 1, tong_tien: 15000000, created_at: "2026-03-01" },
        { id_khach_hang: 1, tong_tien: 30000000, created_at: "2026-03-05" },
        { id_khach_hang: 2, tong_tien: 10000000, created_at: "2026-03-03" },
        { id_khach_hang: 3, tong_tien: 45000000, created_at: "2026-03-07" },
        { id_khach_hang: 3, tong_tien: 8000000, created_at: "2026-03-09" }
      ],

      customers: []
    };
  },

  mounted() {
    this.fetchCustomers();
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },

  methods: {
    fetchCustomers() {
      this.loading = true;
      const token = localStorage.getItem("token_admin");
      const headers = token ? { Authorization: "Bearer " + token } : {};

      const params = {};
      if (this.fromDate) params.from = this.fromDate;
      if (this.toDate) params.to = this.toDate;

      axios
        .get("http://127.0.0.1:8000/api/admin/statistical/customers", {
          headers,
          params
        })
        .then((res) => {
          if (res.data && res.data.data && res.data.data.length > 0) {
            this.customers = res.data.data;
            this.$nextTick(() => this.renderChart());
          } else {
            this.loadMockThongKe();
          }
        })
        .catch(() => {
          this.loadMockThongKe();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadMockThongKe() {
      let orders = this.ordersDB;
      if (this.fromDate) orders = orders.filter(o => o.created_at >= this.fromDate);
      if (this.toDate) orders = orders.filter(o => o.created_at <= this.toDate);

      const result = [];
      this.customersDB.forEach((c) => {
        const list = orders.filter(o => o.id_khach_hang == c.id);
        if (list.length > 0) {
          const total = list.reduce((sum, o) => sum + o.tong_tien, 0);
          const maxOrder = Math.max(...list.map(o => o.tong_tien));
          result.push({
            ten_nguoi_nhan: c.ho_va_ten,
            orders: list.length,
            total,
            maxOrder
          });
        }
      });

      this.customers = result;
      this.$nextTick(() => this.renderChart());
    },

    thongKe() {
      this.fetchCustomers();
    },

    resetBoLoc() {
      this.fromDate = "";
      this.toDate = "";
      this.fetchCustomers();
    },

    renderChart() {
      const canvas = document.getElementById("chartCustomer");
      if (!canvas) return;

      if (this.chart) this.chart.destroy();

      const labels = this.customers.map(c => c.ten_nguoi_nhan || "Khách");
      const data = this.customers.map(c => c.total || 0);

      const colors = ["#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"];

      this.chart = new Chart(canvas.getContext("2d"), {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors.slice(0, data.length),
              borderWidth: 2,
              borderColor: "#ffffff"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 16,
                font: { family: "inherit", size: 12 }
              }
            },
            tooltip: {
              backgroundColor: "#28251f",
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: (context) => {
                  return ` ${context.label}: ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(context.raw)}`;
                }
              }
            }
          },
          cutout: "65%"
        }
      });
    },

    formatMoney(v) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(v || 0);
    },

    async downloadPDF() {
      const doc = new jsPDF("p", "mm", "a4");
      const pdfContent = this.$refs.pdfContent;
      const canvas = await html2canvas(pdfContent, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      doc.save("thong-ke-khach-hang.pdf");
    }
  }
};
</script>

<style scoped>
.admin-thongke-view {
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

/* Chart Canvas Wrapper */
.chart-wrapper {
  position: relative;
  height: 320px;
}

/* Modern Clean Table */
.modern-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
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

.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1ede6;
  color: #c2410c;
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
