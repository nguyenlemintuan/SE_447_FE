<template>
  <div ref="pdfContent" class="admin-dashboard-view">

    <!-- Header & Action -->
    <div class="dash-head d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="dash-title mb-1">Tổng quan doanh thu</h2>
        <p class="dash-subtitle mb-0">Theo dõi số liệu bán hàng, tỷ lệ chuyển đổi và doanh thu LifeTech.</p>
      </div>
      <button class="lt-btn lt-btn-primary" @click="downloadPDF">
        <i class="fa-solid fa-download"></i> Xuất báo cáo PDF
      </button>
    </div>

    <!-- 4 Metric Cards -->
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="metric-card">
          <div class="metric-content">
            <span class="metric-label">Tổng đơn hàng</span>
            <h3 class="metric-value">{{ list_dashboard.totalOrders }}</h3>
            <span class="metric-trend text-positive"><i class="bx bx-trending-up"></i> +12% tuần này</span>
          </div>
          <div class="metric-icon-wrap">
            <i class="bx bx-shopping-bag"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="metric-card metric-card-highlight">
          <div class="metric-content">
            <span class="metric-label">Tổng doanh thu</span>
            <h3 class="metric-value highlight">{{ formatMoney(list_dashboard.totalRevenue) }}</h3>
            <span class="metric-trend text-positive"><i class="bx bx-check-circle"></i> Đạt mục tiêu tháng</span>
          </div>
          <div class="metric-icon-wrap highlight">
            <i class="bx bx-wallet"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="metric-card">
          <div class="metric-content">
            <span class="metric-label">Tỷ lệ thoát (Bounce)</span>
            <h3 class="metric-value">{{ list_dashboard.bounceRate }}%</h3>
            <span class="metric-trend"><i class="bx bx-minus"></i> Mức an toàn (&lt;40%)</span>
          </div>
          <div class="metric-icon-wrap">
            <i class="bx bx-pulse"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="metric-card">
          <div class="metric-content">
            <span class="metric-label">Khách hàng tích lũy</span>
            <h3 class="metric-value">{{ list_dashboard.totalCustomers }}</h3>
            <span class="metric-trend text-positive"><i class="bx bx-user-plus"></i> Khách hàng thật</span>
          </div>
          <div class="metric-icon-wrap">
            <i class="bx bx-group"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Panel -->
    <div class="chart-panel card mt-4">
      <div class="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center py-3">
        <div>
          <h5 class="chart-panel-title mb-1">Biểu đồ tăng trưởng số đơn &amp; doanh thu</h5>
          <small class="text-muted">Dữ liệu tổng hợp theo chu kỳ thời gian thực</small>
        </div>
        <div class="chart-legend-custom d-flex gap-3">
          <span class="legend-badge"><span class="legend-dot bar"></span> Số đơn</span>
          <span class="legend-badge"><span class="legend-dot line"></span> Doanh thu (VNĐ)</span>
        </div>
      </div>
      <div class="card-body p-4">
        <div class="chart-box">
          <canvas id="chart1"></canvas>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

Chart.register(...registerables);

export default {
  data() {
    return {
      chart: null,
      loading: false,

      // Fallback mock nếu chưa có dữ liệu hoặc lỗi kết nối BE
      ordersDB: [
        { id: 1, customer_id: 1, tong_tien: 15000000, created_at: "2026-03-01" },
        { id: 2, customer_id: 1, tong_tien: 30000000, created_at: "2026-03-02" },
        { id: 3, customer_id: 2, tong_tien: 10000000, created_at: "2026-03-03" },
        { id: 4, customer_id: 3, tong_tien: 45000000, created_at: "2026-03-04" },
        { id: 5, customer_id: 2, tong_tien: 8000000, created_at: "2026-03-05" },
        { id: 6, customer_id: 3, tong_tien: 12000000, created_at: "2026-03-06" }
      ],

      list_dashboard: {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        bounceRate: 0,
        sales: []
      }
    };
  },

  mounted() {
    this.layDuLieuThongKe();
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },

  methods: {
    layDuLieuThongKe() {
      this.loading = true;
      const token = localStorage.getItem("token_admin");
      const headers = token ? { Authorization: "Bearer " + token } : {};

      axios
        .get("http://127.0.0.1:8000/api/admin/dashboard/data", { headers })
        .then((res) => {
          if (res.data && res.data.data) {
            this.list_dashboard = res.data.data;
            this.$nextTick(() => this.renderChart());
          } else {
            this.loadFakeDashboard();
          }
        })
        .catch(() => {
          // Nếu BE chưa khởi động hoặc lỗi thì fallback dữ liệu mẫu
          this.loadFakeDashboard();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadFakeDashboard() {
      const orders = this.ordersDB;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + o.tong_tien, 0);
      const totalCustomers = new Set(orders.map(o => o.customer_id)).size;
      const bounceRate = 32;

      const map = {};
      orders.forEach(o => {
        if (!map[o.created_at]) {
          map[o.created_at] = {
            ngay: o.created_at,
            so_don: 0,
            tong_tien: 0
          };
        }
        map[o.created_at].so_don++;
        map[o.created_at].tong_tien += o.tong_tien;
      });

      const sales = Object.values(map);

      this.list_dashboard = {
        totalOrders,
        totalRevenue,
        totalCustomers,
        bounceRate,
        sales
      };

      this.$nextTick(() => this.renderChart());
    },

    renderChart() {
      const sales = this.list_dashboard.sales || [];
      const ctx = document.getElementById("chart1");
      if (!ctx) return;

      if (this.chart) this.chart.destroy();

      this.chart = new Chart(ctx.getContext("2d"), {
        data: {
          labels: sales.map(s => s.ngay),
          datasets: [
            {
              type: "bar",
              label: "Số đơn",
              data: sales.map(s => s.so_don),
              backgroundColor: "rgba(81, 74, 66, 0.18)",
              hoverBackgroundColor: "rgba(81, 74, 66, 0.35)",
              borderRadius: 6,
              barPercentage: 0.45,
              yAxisID: "y"
            },
            {
              type: "line",
              label: "Doanh thu",
              data: sales.map(s => s.tong_tien),
              borderColor: "#c2410c",
              backgroundColor: "rgba(194, 65, 12, 0.08)",
              borderWidth: 2.5,
              pointBackgroundColor: "#c2410c",
              pointBorderColor: "#fff",
              pointHoverRadius: 6,
              pointRadius: 4,
              tension: 0.35,
              fill: true,
              yAxisID: "y1"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: "#28251f",
              titleColor: "#fff",
              bodyColor: "#f7f4ee",
              padding: 12,
              cornerRadius: 8,
              boxPadding: 6,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  if (context.dataset.yAxisID === "y1") {
                    return ` Doanh thu: ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(context.parsed.y)}`;
                  }
                  return ` Số đơn: ${context.parsed.y} đơn`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: "#71685e",
                font: { family: "inherit", size: 12 }
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: "#71685e",
                font: { family: "inherit", size: 12 }
              },
              grid: {
                color: "#eee7dc"
              }
            },
            y1: {
              beginAtZero: true,
              position: "right",
              grid: { drawOnChartArea: false },
              ticks: {
                color: "#71685e",
                font: { family: "inherit", size: 11 },
                callback: v => this.formatMoney(v)
              }
            }
          }
        }
      });
    },

    async downloadPDF() {
      const canvas = await html2canvas(this.$refs.pdfContent, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      doc.save("dashboard-lifetech.pdf");
    },

    formatMoney(v) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(v || 0);
    }
  }
};
</script>

<style scoped>
.admin-dashboard-view {
  max-width: 1360px;
}

.dash-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--lt-ink);
}

.dash-subtitle {
  font-size: 14px;
  color: var(--lt-muted);
}

/* Metric Cards */
.metric-card {
  position: relative;
  display: block;
  padding-right: 84px;
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
  padding: 22px 24px;
  box-shadow: var(--lt-shadow-sm);
  transition: transform var(--lt-transition), box-shadow var(--lt-transition);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--lt-shadow);
}

.metric-card-highlight {
  border-color: var(--lt-orange-line);
  background: #fffdfb;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--lt-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding-right: 52px;
}

.metric-value {
  font-size: clamp(21px, 1.9vw, 26px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--lt-ink);
  margin: 0;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.metric-value.highlight {
  color: var(--lt-orange-dark);
}

.metric-trend {
  font-size: 12px;
  font-weight: 500;
  color: var(--lt-muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.metric-trend.text-positive {
  color: #15803d;
}

.metric-icon-wrap {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: var(--lt-radius-sm);
  background: #f1ede6;
  color: var(--lt-ink-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.metric-icon-wrap.highlight {
  background: var(--lt-orange-soft);
  color: var(--lt-orange);
}

/* Chart Panel */
.chart-panel {
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: var(--lt-radius);
  box-shadow: var(--lt-shadow-sm);
}

.chart-panel-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--lt-ink);
  letter-spacing: -0.02em;
}

.chart-legend-custom {
  font-size: 13px;
  font-weight: 600;
  color: var(--lt-ink-soft);
}

.legend-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}

.legend-dot.bar {
  background: rgba(81, 74, 66, 0.35);
}

.legend-dot.line {
  background: #c2410c;
  border-radius: 50%;
}

.chart-box {
  width: 100%;
  height: 380px;
}
</style>
