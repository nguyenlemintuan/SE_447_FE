<template>
  <div ref="pdfContent" class="container-fluid">

    <!-- Thống kê -->
    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 mt-4">

      <div class="col">
        <div class="card radius-10 border-start border-info border-3">
          <div class="card-body d-flex align-items-center">
            <div>
              <p class="mb-0 text-secondary">Total Orders</p>
              <h4 class="text-info">{{ list_dashboard.totalOrders }}</h4>
            </div>
            <div class="ms-auto"><i class="bx bxs-cart fs-1 text-info"></i></div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card radius-10 border-start border-danger border-3">
          <div class="card-body d-flex align-items-center">
            <div>
              <p class="mb-0 text-secondary">Total Revenue</p>
              <h4 class="text-danger">{{ formatMoney(list_dashboard.totalRevenue) }}</h4>
            </div>
            <div class="ms-auto"><i class="bx bxs-wallet fs-1 text-danger"></i></div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card radius-10 border-start border-success border-3">
          <div class="card-body d-flex align-items-center">
            <div>
              <p class="mb-0 text-secondary">Bounce Rate</p>
              <h4 class="text-success">{{ list_dashboard.bounceRate }}%</h4>
            </div>
            <div class="ms-auto"><i class="bx bxs-bar-chart-alt-2 fs-1 text-success"></i></div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card radius-10 border-start border-warning border-3">
          <div class="card-body d-flex align-items-center">
            <div>
              <p class="mb-0 text-secondary">Total Customers</p>
              <h4 class="text-warning">{{ list_dashboard.totalCustomers }}</h4>
            </div>
            <div class="ms-auto"><i class="bx bxs-group fs-1 text-warning"></i></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Download -->
    <div class="text-end mt-3">
      <button class="btn btn-primary" @click="downloadPDF">
        Download PDF
      </button>
    </div>

    <!-- Chart -->
    <div class="card mt-4">
      <div class="card-body">
        <div class="chart-box">
          <canvas id="chart1"></canvas>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

Chart.register(...registerables);

export default {
  data() {
    return {
      chart: null,

      // ===== MOCK DB =====
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
    this.loadFakeDashboard();
  },

  methods: {

    loadFakeDashboard() {

      const orders = this.ordersDB;

      const totalOrders = orders.length;

      const totalRevenue = orders.reduce((sum, o) => sum + o.tong_tien, 0);

      const totalCustomers =
        new Set(orders.map(o => o.customer_id)).size;

      const bounceRate = Math.floor(Math.random() * 40) + 10;

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
        type: "bar",
        data: {
          labels: sales.map(s => s.ngay),
          datasets: [
            {
              type: "bar",
              label: "Số đơn",
              data: sales.map(s => s.so_don),
              backgroundColor: "rgba(20,171,239,0.6)",
              borderRadius: 6,
              yAxisID: "y"
            },
            {
              type: "line",
              label: "Doanh thu",
              data: sales.map(s => s.tong_tien),
              borderColor: "#ff6b6b",
              backgroundColor: "rgba(255,107,107,0.2)",
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              yAxisID: "y1"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
            y1: {
              beginAtZero: true,
              position: "right",
              grid: { drawOnChartArea: false },
              ticks: {
                callback: v => this.formatMoney(v)
              }
            }
          }
        }
      });

    },

    async downloadPDF() {

      const canvas =
        await html2canvas(this.$refs.pdfContent, { scale: 2 });

      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);

      doc.save("dashboard.pdf");
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

<style>
.chart-box {
  width: 100%;
  height: 350px;
}
</style>