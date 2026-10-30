<template>
    <div class="row">
        <div class="col-lg-6">
            <h3 class="mt-3">User Account</h3>
        </div>
        <div class="col-lg-5 text-end mt-1 ">
            <button class="btn btn-success mt-3 me-3" data-bs-toggle="modal" data-bs-target="#addNhanVien">
                <i class="fa-solid fa-plus"></i> Thêm User
            </button>
            <button class="btn btn-primary mt-3" @click="downloadPDF">
                <i class="fa-solid fa-download "></i> Download PDF
            </button>
        </div>
        <!-- Table -->
        <div class="row mt-3">
            <div class="col-lg-12" ref="pdfContent">
                <table class="table table-hover table-bordered">
                    <thead>
                        <tr class="text-center align-middle">
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Số Điện Thoại</th>
                            <th>Địa Chỉ</th>
                            <th>Ngày Sinh</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="value in list_account" :key="value.id" class="text-center align-middle">
                            <td>{{ value.ho_va_ten }}</td>
                            <td>{{ value.email }}</td>
                            <td>{{ '*'.repeat(value.password.length) }}</td>
                            <td>{{ value.so_dien_thoai }}</td>
                            <td>{{ value.dia_chi }}</td>
                            <td>{{ value.ngay_sinh }}</td>
                            <td>
                                <button class="btn btn-primary btn-sm me-2" @click="openUpdateModal(value)">
                                    Cập nhật
                                </button>
                                <button class="btn btn-danger btn-sm" @click="openDeleteModal(value)">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Thêm -->
    <div class="modal fade" id="addNhanVien" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Thêm nhân viên</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-lg-6">
                            <label>Họ và tên</label>
                            <input v-model="account.ho_va_ten" type="text" class="form-control"
                                placeholder="Nhập họ và tên" />
                        </div>
                        <div class="col-lg-6">
                            <label>Email</label>
                            <input v-model="account.email" type="email" class="form-control" placeholder="Nhập Email" />
                        </div>
                        <div class="col-lg-6">
                            <label>Password</label>
                            <div class="input-group">
                                <input :type="showPassword ? 'text' : 'password'" v-model="account.password"
                                    class="form-control" placeholder="Nhập Password" />
                                <span class="input-group-text" @click="showPassword = !showPassword"
                                    style="cursor: pointer;">
                                    <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                                </span>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <label>Số điện thoại</label>
                            <input v-model="account.so_dien_thoai" type="text" class="form-control"
                                placeholder="Nhập số điện thoại" />
                        </div>
                        <div class="col-lg-6">
                            <label>Địa chỉ</label>
                            <input v-model="account.dia_chi" type="text" class="form-control"
                                placeholder="Nhập địa chỉ" />
                        </div>
                        <div class="col-lg-6">
                            <label>Ngày sinh</label>
                            <input v-model="account.ngay_sinh" type="date" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button class="btn btn-success" @click="createAccount">Thêm mới</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Cập nhật -->
    <div class="modal fade" id="capnhatModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Cập nhật tài khoản</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-lg-6">
                            <label>Họ và tên</label>
                            <input v-model="update_account.ho_va_ten" type="text" class="form-control" />
                        </div>
                        <div class="col-lg-6">
                            <label>Email</label>
                            <input v-model="update_account.email" type="email" class="form-control" />
                        </div>
                        <div class="col-lg-6">
                            <label>Password</label>
                            <input v-model="update_account.password" type="password" class="form-control" />
                        </div>
                        <div class="col-lg-6">
                            <label>Số điện thoại</label>
                            <input v-model="update_account.so_dien_thoai" type="text" class="form-control" />
                        </div>
                        <div class="col-lg-6">
                            <label>Địa chỉ</label>
                            <input v-model="update_account.dia_chi" type="text" class="form-control" />
                        </div>
                        <div class="col-lg-6">
                            <label>Ngày sinh</label>
                            <input v-model="update_account.ngay_sinh" type="date" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button class="btn btn-primary" @click="updateAccount">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Xóa -->
    <div class="modal fade" id="xoaModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Xóa tài khoản</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Bạn có chắc muốn xóa tài khoản <b>{{ del_account.ho_va_ten }}</b>?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button class="btn btn-danger" @click="deleteAccount">Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
    data() {
        return {
            showPasswordAdd: false,
            showPasswordUpdate: false,
            list_account: [],
            account: {
                ho_va_ten: "",
                email: "",
                password: "",
                so_dien_thoai: "",
                dia_chi: "",
                ngay_sinh: "",
            },
            update_account: {},
            del_account: {},
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            axios
                .get('http://127.0.0.1:8000/api/admin/user-account/data')
                .then((res) => {
                    this.list_account = res.data.data;
                });
        },
        createAccount() {
            if (!this.account.ho_va_ten || !this.account.email || !this.account.password) {
                this.$toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
                return;
            }

            if (!this.account.email.includes("@")) {
                this.$toast.error("Email không hợp lệ!");
                return;
            }
            axios
                .post("http://127.0.0.1:8000/api/admin/user-account/create", this.account)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadData();
                        this.account = {
                            ho_va_ten: "",
                            email: "",
                            password: "",
                            so_dien_thoai: "",
                            dia_chi: "",
                            ngay_sinh: "",
                        };
                        bootstrap.Modal.getInstance(document.getElementById("addNhanVien"))?.hide();
                    } else this.$toast.error(res.data.message);
                })
                .catch(this.handleError);
        },
        updateAccount() {
            axios
                .post("http://127.0.0.1:8000/api/admin/user-account/update", this.update_account)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadData();
                        bootstrap.Modal.getInstance(document.getElementById("capnhatModal"))?.hide();
                    } else this.$toast.error(res.data.message);
                })
                .catch(this.handleError);
        },
        deleteAccount() {
            axios
                .post("http://127.0.0.1:8000/api/admin/user-account/delete", this.del_account)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadData();
                        bootstrap.Modal.getInstance(document.getElementById("xoaModal"))?.hide();
                    } else this.$toast.error(res.data.message);
                })
                .catch(this.handleError);
        },
        openUpdateModal(value) {
            this.update_account = { ...value };
            new bootstrap.Modal(document.getElementById("capnhatModal")).show();
        },
        openDeleteModal(value) {
            this.del_account = { ...value };
            new bootstrap.Modal(document.getElementById("xoaModal")).show();
        },
        async downloadPDF() {
            const pdfContent = this.$refs.pdfContent;

            // Chụp lại DOM thành ảnh
            const canvas = await html2canvas(pdfContent, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            // Tạo PDF
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // chiều rộng A4
            const pageHeight = 297; // chiều cao A4
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Trang đầu
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Nếu còn nội dung thì thêm trang mới
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("user-account.pdf");
        }
    },
}
</script>


<style></style>
