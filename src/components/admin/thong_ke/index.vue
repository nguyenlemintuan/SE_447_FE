<template>
    <div class="row mt-3" ref="pdfContent">
        <div class="row">
            <div class="col-lg-6">
                <h3 class="mt-3">Thống kê khách hàng</h3>

            </div>
            <div class="col-lg-6 text-end mt-1">
                <button class="btn btn-primary mt-3" @click="downloadPDF">
                    <i class="fa-solid fa-download"></i> Download PDF
                </button>
            </div>
        </div>

        <!-- Bộ lọc ngày -->
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body row">
                    <div class="col-lg-5">
                        <label>Từ ngày</label>
                        <input type="date" v-model="fromDate" class="form-control mt-2 mb-2">
                    </div>
                    <div class="col-lg-5">
                        <label>Đến ngày</label>
                        <input type="date" v-model="toDate" class="form-control mt-2">
                    </div>
                    <div class="col-lg-2">
                        <label>&nbsp;</label>
                        <button class="btn btn-primary w-100 mt-2" @click="thongKe">Thống kê</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Biểu đồ + Bảng thống kê -->
        <div class="col-lg-12 mt-3">
            <div class="card">
                <div class="card-body row">
                    <!-- Biểu đồ -->
                    <div class="col-lg-6 text-center">
                        <h6><b>Bảng thống kê</b></h6>
                        <hr>
                        <div class="chart-wrapper">
                            <canvas id="chart"></canvas>
                        </div>
                    </div>

                    <!-- Bảng khách hàng -->
                    <div class="col-lg-6">
                        <h6><b>THỐNG KÊ KHÁCH HÀNG</b></h6>
                        <hr>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover align-middle">
                                <thead>
                                    <tr class="table-danger text-center">
                                        <th>#</th>
                                        <th>Tên Khách Hàng</th>
                                        <th>Số Đơn</th>
                                        <th>Tổng Tiền</th>
                                        <th>Đơn Lớn Nhất</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(c, i) in customers" :key="i">
                                        <td class="text-center">{{ i + 1 }}</td>
                                        <td>{{ c.ten_nguoi_nhan }}</td>
                                        <td class="text-center">{{ c.orders }}</td>
                                        <td class="text-center">{{ formatMoney(c.total) }}</td>
                                        <td class="text-end">{{ formatMoney(c.maxOrder) }}</td>
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
<!-- 
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
            customers: []
        };
    },
    mounted() {
        this.fetchCustomers();
    },
    methods: {
        async fetchCustomers() {
            try {
                const params = {};
                if (this.fromDate) params.from = this.fromDate;
                if (this.toDate) params.to = this.toDate;

                const res = await axios.get('http://127.0.0.1:8000/api/admin/statistical/customers', { params });
                console.log("API trả về:", res.data);
                this.customers = res.data.data || [];
                this.renderChart();
            } catch (error) {
                console.error(error);
            }
        }
        ,
        thongKe() {
            this.fetchCustomers();
        },
        renderChart() {
            const ctx = document.getElementById("chart").getContext("2d");
            if (this.chart) this.chart.destroy();

            this.chart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: this.customers.map(c => c.ten_nguoi_nhan),
                    datasets: [{
                        data: this.customers.map(c => c.total),
                        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
            });
        },
        formatMoney(v) {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
        },
        async downloadPDF() {
            const doc = new jsPDF("p", "mm", "a4");
            const pdfContent = this.$refs.pdfContent;
            const canvas = await html2canvas(pdfContent, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            doc.save("statistical-report.pdf");
        }
    }
};
</script> -->
<script>
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

            // ===== MOCK CUSTOMERS =====
            customersDB: [
                { id: 1, ho_va_ten: "Nguyễn Văn A" },
                { id: 2, ho_va_ten: "Trần Thị B" },
                { id: 3, ho_va_ten: "Lê Văn C" }
            ],

            // ===== MOCK ORDERS =====
            ordersDB: [
                { id_khach_hang: 1, tong_tien: 15000000, created_at: "2026-03-01" },
                { id_khach_hang: 1, tong_tien: 30000000, created_at: "2026-03-05" },
                { id_khach_hang: 2, tong_tien: 10000000, created_at: "2026-03-03" },
                { id_khach_hang: 3, tong_tien: 45000000, created_at: "2026-03-07" },
                { id_khach_hang: 3, tong_tien: 8000000, created_at: "2026-03-09" },
            ],

            customers: []
        };
    },

    mounted() {
        this.thongKe();
    },

    methods: {

        thongKe() {

            let orders = this.ordersDB;

            if (this.fromDate) {
                orders = orders.filter(o => o.created_at >= this.fromDate);
            }

            if (this.toDate) {
                orders = orders.filter(o => o.created_at <= this.toDate);
            }

            const result = [];

            this.customersDB.forEach(c => {

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
            this.renderChart();
        },

        renderChart() {

            const ctx = document.getElementById("chart").getContext("2d");
            if (this.chart) this.chart.destroy();

            this.chart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: this.customers.map(c => c.ten_nguoi_nhan),
                    datasets: [{
                        data: this.customers.map(c => c.total),
                        backgroundColor: [
                            "#36A2EB",
                            "#FF6384",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                            "#FF9F40"
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } }
                }
            });

        },

        formatMoney(v) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(v);
        },

        async downloadPDF() {

            const doc = new jsPDF("p", "mm", "a4");
            const pdfContent = this.$refs.pdfContent;

            const canvas = await html2canvas(pdfContent, { scale: 2 });

            const imgData = canvas.toDataURL("image/png");

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            doc.save("statistical-report.pdf");

        }
    }
};
</script>
<style>
.chart-wrapper {
    width: 300px;
    height: 300px;
    margin: auto;
}
</style>
