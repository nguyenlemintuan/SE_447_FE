<template>
    <div class="row" ref="pdfContent">
        <div class="col-lg-6">
            <h3 class="mt-3">Quản lý mã giảm giá</h3>
        </div>
        <div class="col-lg-6 text-end mt-1">
            <button class="btn btn-primary mt-3 shadow-sm" @click="taiXuongPDF">
                <i class="fa-solid fa-download"></i> Download PDF
            </button>
        </div>

        <div class="col-lg-12 mt-3">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white">
                    <div class="row align-items-center">
                        <div class="col-lg-10 col-md-6 text-start">
                            <h5 class="mb-0 fw-bold">DANH SÁCH MÃ GIẢM GIÁ</h5>
                        </div>
                        <div class="col-lg-2 col-md-6 text-end">
                            <button class="btn btn-primary shadow-sm" @click="moModalThem">
                                <i class="fa fa-plus"></i> Thêm
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive">
                    <table class="table table-hover align-middle text-center">
                        <thead>
                            <tr class="table">
                                <th>#</th>
                                <th>Mã Code</th>
                                <th class="text-start">Tên Voucher</th>
                                <th>Hình Ảnh</th>
                                <th>Bắt Đầu</th>
                                <th>Kết Thúc</th>
                                <th class="text-end">Số Giảm</th>
                                <th class="text-end">Đơn Tối Thiểu</th>
                                <th>Tình Trạng</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(v, index) in danhSachVoucher" :key="v.id">
                                <th>{{ index + 1 }}</th>
                                <td><span class="badge bg-light text-dark fw-normal">{{ v.ma_code }}</span></td>
                                <td class="text-start">{{ v.ten_voucher }}</td>
                                <td><img :src="v.hinh_anh" class="voucher-img" /></td>
                                <td>{{ v.thoi_gian_bat_dau }}</td>
                                <td>{{ v.thoi_gian_ket_thuc }}</td>
                                <td class="text-end fw-bold text-primary">{{ formatTien(v.so_giam_gia, v.loai_giam) }}
                                </td>
                                <td class="text-end">{{ formatTien(v.don_hang_toi_thieu) }}</td>
                                <td>
                                    <button
                                        :class="v.tinh_trang === 1 ? 'btn btn-outline-success btn-sm' : 'btn btn-outline-dark btn-sm'">
                                        {{ v.tinh_trang === 1 ? 'Hiển thị' : 'Ẩn' }}
                                    </button>
                                </td>
                                <td>
                                    <div class="d-flex justify-content-center gap-2">
                                        <button class="btn btn-warning btn-sm" @click="moModalCapNhat(v)">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger btn-sm" @click="moModalXoa(v)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="danhSachVoucher.length === 0">
                                <td colspan="10">Chưa có voucher nào</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="modal fade" id="themVoucherModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content shadow border-0">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Thêm Voucher</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-6">
                                <label>Mã code</label>
                                <input v-model="voucherHienTai.ma_code" class="form-control mb-2" />
                                <label>Tên Voucher</label>
                                <input v-model="voucherHienTai.ten_voucher" class="form-control mb-2" />
                                <label>Hình Ảnh</label>
                                <input v-model="voucherHienTai.hinh_anh" class="form-control mb-2" />
                                <label>Số tiền tối đa</label>
                                <input type="number" v-model="voucherHienTai.so_tien_toi_da"
                                    class="form-control mb-2" />
                                <label>Đơn tối thiểu</label>
                                <input type="number" v-model="voucherHienTai.don_hang_toi_thieu"
                                    class="form-control mb-2" />
                            </div>
                            <div class="col-lg-6">
                                <label>Thời gian bắt đầu</label>
                                <input type="date" v-model="voucherHienTai.thoi_gian_bat_dau"
                                    class="form-control mb-2" />
                                <label>Thời gian kết thúc</label>
                                <input type="date" v-model="voucherHienTai.thoi_gian_ket_thuc"
                                    class="form-control mb-2" />
                                <label>Số giảm</label>
                                <input type="number" v-model="voucherHienTai.so_giam_gia" class="form-control mb-2" />
                                <label>Loại giảm</label>
                                <select v-model="voucherHienTai.loai_giam" class="form-control mb-2">
                                    <option :value="0">Tiền</option>
                                    <option :value="1">Phần trăm</option>
                                </select>
                                <label>Tình trạng</label>
                                <select v-model="voucherHienTai.tinh_trang" class="form-control mb-2">
                                    <option :value="1">Hiển thị</option>
                                    <option :value="0">Ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button class="btn btn-primary" @click="themVoucher">Thêm</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="capNhatVoucherModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content shadow border-0">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">Cập nhật Voucher</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-6">
                                <label>Mã code</label>
                                <input v-model="voucherHienTai.ma_code" class="form-control mb-2" />
                                <label>Tên Voucher</label>
                                <input v-model="voucherHienTai.ten_voucher" class="form-control mb-2" />
                                <label>Hình Ảnh</label>
                                <input v-model="voucherHienTai.hinh_anh" class="form-control mb-2" />
                                <label>Số tiền tối đa</label>
                                <input type="number" v-model="voucherHienTai.so_tien_toi_da"
                                    class="form-control mb-2" />
                                <label>Đơn tối thiểu</label>
                                <input type="number" v-model="voucherHienTai.don_hang_toi_thieu"
                                    class="form-control mb-2" />
                            </div>
                            <div class="col-lg-6">
                                <label>Thời gian bắt đầu</label>
                                <input type="date" v-model="voucherHienTai.thoi_gian_bat_dau"
                                    class="form-control mb-2" />
                                <label>Thời gian kết thúc</label>
                                <input type="date" v-model="voucherHienTai.thoi_gian_ket_thuc"
                                    class="form-control mb-2" />
                                <label>Số giảm</label>
                                <input type="number" v-model="voucherHienTai.so_giam_gia" class="form-control mb-2" />
                                <label>Loại giảm</label>
                                <select v-model="voucherHienTai.loai_giam" class="form-control mb-2">
                                    <option :value="0">Tiền</option>
                                    <option :value="1">Phần trăm</option>
                                </select>
                                <label>Tình trạng</label>
                                <select v-model="voucherHienTai.tinh_trang" class="form-control mb-2">
                                    <option :value="1">Hiển thị</option>
                                    <option :value="0">Ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button class="btn btn-warning" @click="capNhatVoucher">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="xoaModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content shadow border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Xóa Voucher</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger">
                            Bạn có chắc muốn xóa <b>{{ voucherHienTai.ten_voucher }}</b> không?
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button class="btn btn-danger" @click="xoaVoucher">Xác nhận</button>
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
            danhSachVoucher: [],
            voucherHienTai: {
                id: null,
                ma_code: "",
                ten_voucher: "",
                hinh_anh: "",
                thoi_gian_bat_dau: "",
                thoi_gian_ket_thuc: "",
                so_giam_gia: 0,
                so_tien_toi_da: 0,
                don_hang_toi_thieu: 0,
                tinh_trang: 1,
                loai_giam: 0,
            },
        };
    },
    mounted() {
        this.napDuLieu();
    },
    methods: {
        napDuLieu() {
            axios.get("http://127.0.0.1:8000/api/admin/voucher/data", {
                headers: { Authorization: "Bearer " + localStorage.getItem("admin_login") }
            }).then(res => {
                this.danhSachVoucher = res.data?.data || [];
            }).catch(() => this.$toast?.warning("Không lấy được dữ liệu"));
        },
        formatTien(value, loai) {
            if (loai === 1) return value + " %";
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
        },
        moModalThem() {
            this.voucherHienTai = {
                id: null, ma_code: "", ten_voucher: "", hinh_anh: "",
                thoi_gian_bat_dau: "", thoi_gian_ket_thuc: "", so_giam_gia: 0, so_tien_toi_da: 0,
                don_hang_toi_thieu: 0, tinh_trang: 1, loai_giam: 0
            };
            new bootstrap.Modal(document.getElementById("themVoucherModal")).show();
        },
        moModalCapNhat(voucher) {
            this.voucherHienTai = { ...voucher };
            new bootstrap.Modal(document.getElementById("capNhatVoucherModal")).show();
        },
        moModalXoa(voucher) {
            this.voucherHienTai = { ...voucher };
            new bootstrap.Modal(document.getElementById("xoaModal")).show();
        },
        themVoucher() {
            axios.post("http://127.0.0.1:8000/api/admin/voucher/create", this.voucherHienTai, {
                headers: { Authorization: "Bearer " + localStorage.getItem("admin_login") }
            }).then(res => {
                if (res.data.status) this.$toast.success(res.data.message);
                this.napDuLieu();
                bootstrap.Modal.getInstance(document.getElementById("themVoucherModal")).hide();
            }).catch(err => this.handleError(err));
        },
        capNhatVoucher() {
            axios.post("http://127.0.0.1:8000/api/admin/voucher/update", this.voucherHienTai, {
                headers: { Authorization: "Bearer " + localStorage.getItem("admin_login") }
            }).then(res => {
                if (res.data.status) this.$toast.success(res.data.message);
                this.napDuLieu();
                bootstrap.Modal.getInstance(document.getElementById("capNhatVoucherModal")).hide();
            }).catch(err => this.handleError(err));
        },
        xoaVoucher() {
            axios.post("http://127.0.0.1:8000/api/admin/voucher/delete", { id: this.voucherHienTai.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem("admin_login") }
            }).then(res => {
                if (res.data.status) this.$toast.success(res.data.message);
                this.napDuLieu();
            }).catch(err => this.handleError(err));
        },
        handleError(err) {
            if (err.response?.data?.message) this.$toast.error(err.response.data.message);
            else if (err.response?.data?.errors) {
                Object.values(err.response.data.errors).flat().forEach(msg => this.$toast.error(msg));
            } else this.$toast.error("Đã xảy ra lỗi, thử lại!");
        },
        taiXuongPDF() {
            html2canvas(this.$refs.pdfContent).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("l", "mm", "a4");
                pdf.addImage(imgData, "PNG", 5, 5, 287, 0);
                pdf.save("voucher.pdf");
            });
        }
    }
};
</script>

<style scoped>
.voucher-img {
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
}

.table-hover tbody tr:hover {
    background: #f1f5f9;
    transition: .15s;
}

.btn {
    border-radius: 8px;
    font-weight: 500;
}
</style>