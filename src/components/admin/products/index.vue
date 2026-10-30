<template>
	<div class="row">
		<div class="col-lg-6">
			<h3 class="mt-3">Quản lý sản phẩm</h3>
		</div>
		<div class="col-lg-6 text-end mt-3">
			<button class="btn btn-success me-3" data-bs-toggle="modal" data-bs-target="#addSpham">
				<i class="fa-solid fa-plus"></i> Thêm mới sản phẩm
			</button>
			<button class="btn btn-primary" @click="downloadPDF">
				<i class="fa-solid fa-download"></i> Download PDF
			</button>
		</div>

		<!-- TABLE -->
		<div class="col-lg-12 mt-4">
			<h5><b>Danh sách sản phẩm</b></h5>
			<div class="table-responsive">
				<table class="table table-hover table-bordered align-middle text-center">
					<thead class="table-light">
						<tr>
							<th>Ảnh</th>
							<th>Tên</th>
							<th>Slug</th>
							<th>Giá</th>
							<th>Số lượng</th>
							<th>Hành động</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(value, index) in list_products" :key="index">
							<td><img :src="value.images" alt="img" style="width: 60px;" /></td>
							<td>{{ value.title }}</td>
							<td>{{ value.slug }}</td>
							<td>{{ formatCurrency(value.price) }}</td>
							<td>{{ value.quantity }}</td>
							<td>
								<button class="btn btn-sm btn-primary me-2" data-bs-toggle="modal"
									data-bs-target="#capnhatModal" @click="Object.assign(update_products, value)">
									Cập nhật
								</button>
								<button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#xoaModal"
									@click="del_products = value">
									Xóa
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Modal Cập nhật -->
	<div class="modal fade" id="capnhatModal" tabindex="-1">
		<div class="modal-dialog modal-lg">
			<div class="modal-content shadow-lg border-0 rounded-4">
				<div class="modal-header bg-primary text-white">
					<h5 class="modal-title">Cập nhật sản phẩm</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<!-- Cột trái -->
						<div class="col-lg-6">
							<h6 class="text-primary fw-bold mb-2">Thông tin chung</h6>
							<label>Ảnh</label>
							<input v-model="update_products.images" class="form-control mb-2" />
							<label>Tên sản phẩm</label>
							<input v-model="update_products.title" class="form-control mb-2" />
							<label>Slug</label>
							<input v-model="update_products.slug" class="form-control mb-2" />
							<label>Thương hiệu</label>
							<input v-model="update_products.brand" class="form-control mb-2" />
							<label>Bảo hành (tháng)</label>
							<input v-model="update_products.warranty" type="number" class="form-control mb-2" />
							<label>Giá (VND)</label>
							<input v-model="update_products.price" type="number" class="form-control mb-2" />
							<label>Số lượng</label>
							<input v-model="update_products.quantity" type="number" class="form-control mb-2" />
							<label>Mô tả</label>
							<textarea v-model="update_products.description" class="form-control mb-2"></textarea>
						</div>

						<!-- Cột phải -->
						<div class="col-lg-6">
							<h6 class="text-primary fw-bold mb-2">Thông số kỹ thuật</h6>
							<div class="row">
								<div class="col-md-6">
									<label>Pin (mAh)</label>
									<input v-model="update_products.pin" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Hỗ trợ sạc tối đa</label>
									<input v-model="update_products.cong_suat" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Thời gian sạc (h)</label>
									<input v-model="update_products.thoi_gian_sac" type="text"
										class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Cổng kết nối/sạc</label>
									<input v-model="update_products.ketnoi" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Tính năng</label>
									<input v-model="update_products.tinh_nang" type="text" class="form-control mb-2" />
								</div>
							</div>
						</div>

					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
					<button class="btn btn-primary" @click="updateProducts()">Lưu thay đổi</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Thêm (giao diện tương tự Update) -->
	<div class="modal fade" id="addSpham" tabindex="-1">
		<div class="modal-dialog modal-lg">
			<div class="modal-content shadow-lg border-0 rounded-4">
				<div class="modal-header bg-success text-white">
					<h5 class="modal-title">Thêm mới sản phẩm</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-6">
							<h6 class="text-success fw-bold mb-2">Thông tin chung</h6>
							<label>Ảnh</label>
							<input v-model="products.images" class="form-control mb-2" />
							<label>Tên sản phẩm</label>
							<input v-model="products.title" class="form-control mb-2" />
							<label>Slug</label>
							<input v-model="products.slug" class="form-control mb-2" />
							<label>Thương hiệu</label>
							<input v-model="products.brand" class="form-control mb-2" />
							<label>Bảo hành (tháng)</label>
							<input v-model="products.warranty" type="number" class="form-control mb-2" />
							<label>Giá (VND)</label>
							<input v-model="products.price" type="number" class="form-control mb-2" />
							<label>Số lượng</label>
							<input v-model="products.quantity" type="number" class="form-control mb-2" />
							<label>Mô tả</label>
							<textarea v-model="products.description" class="form-control mb-2"></textarea>
						</div>

						<div class="col-lg-6">
							<h6 class="text-primary fw-bold mb-2">Thông số kỹ thuật</h6>
							<div class="row">
								<div class="col-md-6">
									<label>Pin (mAh)</label>
									<input v-model="products.pin" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Hỗ trợ sạc tối đa</label>
									<input v-model="products.cong_suat" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Thời gian sạc (h)</label>
									<input v-model="products.thoi_gian_sac" type="text"
										class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Cổng kết nối/sạc</label>
									<input v-model="products.ketnoi" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label>Tính năng</label>
									<input v-model="update_products.tinh_nang" type="text" class="form-control mb-2" />
								</div>
							</div>
						</div>

					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
					<button class="btn btn-success" @click="createProducts()">Lưu sản phẩm</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Xóa -->
	<div class="modal fade" id="xoaModal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content border-0 shadow-lg rounded-4">
				<div class="modal-header bg-danger text-white">
					<h5 class="modal-title">Xóa sản phẩm</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<div class="alert alert-danger">
						Bạn có chắc muốn xóa <b>{{ del_products.title }}</b> không?
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
					<button class="btn btn-danger" @click="deleteProducts()">Xác nhận</button>
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
			list_products: [],
			products: {
				images: "",
				title: "",
				slug: "",
				price: null,
				quantity: null,
				brand: "",
				description: "",
				warranty: "",
				status: "active",
				pin: "",
				cong_suat: "",
				dientich: "",
				ketnoi: "",
				cao: "",
			},
			update_products: {},
			del_products: {},
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			axios.get("http://127.0.0.1:8000/api/admin/products/data").then((res) => {
				this.list_products = res.data.data.map(item => {
                    // parse specs JSON
                    const specs = item.specs ? JSON.parse(item.specs) : {};
                    return {
                        ...item,
                        pin: specs.pin || "",
                        cong_suat: specs.cong_suat || "",
                        thoi_gian_sac: specs.thoi_gian_sac || "",
                        ketnoi: specs.ketnoi || "",
                        tinh_nang: specs.tinh_nang || "",
                     };
                });
			});
		},
		createProducts() {
			const specs = JSON.stringify({
				pin: this.update_products.pin,
				cong_suat: this.update_products.cong_suat,
				thoi_gian_sac: this.update_products.thoi_gian_sac,
				ketnoi: this.update_products.ketnoi,
				tinh_nang: this.update_products.tinh_nang,
			});
			const payload = { ...this.products, specs };
			axios.post("http://127.0.0.1:8000/api/admin/products/create", payload)
				.then((res) => {
					if (res.data.status) {
						this.$toast.success(res.data.message);
						this.loadData();
					}
				})
				.catch(this.handleError);
		},
		updateProducts() {
			const specs = JSON.stringify({
				pin: this.update_products.pin,
				cong_suat: this.update_products.cong_suat,
				thoi_gian_sac: this.update_products.thoi_gian_sac,
				ketnoi: this.update_products.ketnoi,
				tinh_nang: this.update_products.tinh_nang,
			});
			const payload = { ...this.update_products, specs };
			axios.post("http://127.0.0.1:8000/api/admin/products/update", payload)
				.then((res) => {
					if (res.data.status) {
						this.$toast.success(res.data.message);
						this.loadData();
					}
				})
				.catch(this.handleError);
		},
		deleteProducts() {
			axios.post("http://127.0.0.1:8000/api/admin/products/delete", this.del_products)
				.then((res) => {
					if (res.data.status) {
						this.$toast.success(res.data.message);
						this.loadData();
					}
				})
				.catch(this.handleError);
		},
		handleError(error) {
			if (error.response?.data?.errors) {
				Object.values(error.response.data.errors).flat().forEach((msg) => this.$toast.error(msg));
			}
		},
		async downloadPDF() {
			const doc = new jsPDF("p", "mm", "a4");
			const canvas = await html2canvas(this.$el.querySelector(".table-responsive"), { scale: 2 });
			const imgData = canvas.toDataURL("image/png");
			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
			doc.save("products-report.pdf");
		},
		formatCurrency(value) {
			if (!value) return "0 đ";
			return new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(value);
		},
	},
};
</script>

<style>
.table-responsive {
	max-height: 70vh;
	overflow-x: auto;
	overflow-y: auto;
}

.modal-content {
	animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
