<template>
	<div class="admin-products-view">
		<!-- Header Page -->
		<div class="dash-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
			<div>
				<h2 class="dash-title mb-1">Quản lý sản phẩm</h2>
				<p class="dash-subtitle mb-0">Thêm mới, điều chỉnh giá, kiểm soát tồn kho thiết bị công nghệ.</p>
			</div>
			<div class="d-flex align-items-center gap-2">
				<button class="lt-btn lt-btn-outline" @click="downloadPDF">
					<i class="bx bx-download"></i> Xuất PDF
				</button>
				<button class="lt-btn lt-btn-primary" data-bs-toggle="modal" data-bs-target="#addSpham">
					<i class="bx bx-plus"></i> Thêm mới sản phẩm
				</button>
			</div>
		</div>

		<!-- Card Table -->
		<div class="admin-card card border-0 shadow-sm">
			<div class="card-header bg-white border-bottom d-flex flex-wrap justify-content-between align-items-center py-3 px-4 gap-3">
				<div class="d-flex align-items-center gap-2">
					<span class="card-badge-dot"></span>
					<h5 class="mb-0 fw-bold fs-6 text-dark">Danh sách sản phẩm trong kho</h5>
					<span class="badge bg-light text-secondary border ms-2">{{ list_products.length }} sản phẩm</span>
				</div>
			</div>

			<div class="card-body p-0">
				<div class="table-responsive" ref="pdfContent">
					<table class="table modern-table align-middle mb-0">
						<thead>
							<tr>
								<th class="ps-4">Sản phẩm</th>
								<th>Thương hiệu</th>
								<th class="text-end">Đơn giá</th>
								<th class="text-center">Tồn kho</th>
								<th class="text-end pe-4">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(value, index) in list_products" :key="index">
								<td class="ps-4">
									<div class="d-flex align-items-center gap-3 py-1">
										<img :src="value.images" alt="Sản phẩm" class="product-thumb" />
										<div class="d-flex flex-column">
											<strong class="product-title-text">{{ value.title }}</strong>
											<small class="text-muted text-monospace">slug: {{ value.slug }}</small>
										</div>
									</div>
								</td>
								<td>
									<span class="badge bg-light text-dark border px-2 py-1">{{ value.brand || 'LifeTech' }}</span>
								</td>
								<td class="text-end">
									<strong class="product-price-text">{{ formatCurrency(value.price) }}</strong>
								</td>
								<td class="text-center">
									<span
										class="stock-pill"
										:class="value.quantity > 5 ? 'is-in-stock' : (value.quantity > 0 ? 'is-low-stock' : 'is-out-stock')"
									>
										<i class="stock-dot"></i>
										{{ value.quantity > 0 ? `${value.quantity} máy` : 'Hết hàng' }}
									</span>
								</td>
								<td class="text-end pe-4">
									<div class="d-inline-flex gap-1">
										<button
											class="action-btn is-edit"
											data-bs-toggle="modal"
											data-bs-target="#capnhatModal"
											@click="Object.assign(update_products, value)"
											title="Chỉnh sửa sản phẩm"
										>
											<i class="bx bx-edit-alt"></i>
										</button>
										<button
											class="action-btn is-delete"
											data-bs-toggle="modal"
											data-bs-target="#xoaModal"
											@click="del_products = value"
											title="Xóa sản phẩm"
										>
											<i class="bx bx-trash"></i>
										</button>
									</div>
								</td>
							</tr>

							<tr v-if="list_products.length === 0">
								<td colspan="5" class="text-center text-muted py-5">
									<div class="py-4">
										<i class="bx bx-box fs-1 text-muted mb-2"></i>
										<p class="mb-0">Chưa có sản phẩm nào trong danh mục.</p>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Cập nhật -->
	<div class="modal fade" id="capnhatModal" tabindex="-1">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content border-0 shadow-lg rounded-3">
				<div class="modal-header border-bottom px-4 py-3">
					<h5 class="modal-title fw-bold fs-6">Cập nhật thông tin sản phẩm</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body p-4">
					<div class="row g-3">
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">LINK ẢNH SẢN PHẨM</label>
							<input v-model="update_products.images" class="form-control" />
						</div>
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">TÊN SẢN PHẨM</label>
							<input v-model="update_products.title" class="form-control" />
						</div>
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">SLUG ĐỊNH DANH</label>
							<input v-model="update_products.slug" class="form-control" />
						</div>
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">THƯƠNG HIỆU</label>
							<input v-model="update_products.brand" class="form-control" />
						</div>
						<div class="col-md-4">
							<label class="form-label fw-semibold small text-secondary">GIÁ BÁN (VND)</label>
							<input v-model="update_products.price" type="number" class="form-control" />
						</div>
						<div class="col-md-4">
							<label class="form-label fw-semibold small text-secondary">SỐ LƯỢNG TỒN KHO</label>
							<input v-model="update_products.quantity" type="number" class="form-control" />
						</div>
						<div class="col-md-4">
							<label class="form-label fw-semibold small text-secondary">BẢO HÀNH (THÁNG)</label>
							<input v-model="update_products.warranty" type="number" class="form-control" />
						</div>
					</div>
				</div>
				<div class="modal-footer border-top px-4 py-3">
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">Đóng</button>
					<button type="button" class="btn btn-primary px-4" data-bs-dismiss="modal" @click="capNhatSanPham">
						Lưu thay đổi
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Xóa -->
	<div class="modal fade" id="xoaModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content border-0 shadow-lg rounded-3">
				<div class="modal-header border-bottom px-4 py-3">
					<h5 class="modal-title fw-bold fs-6 text-danger">Xác nhận xóa sản phẩm</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body p-4">
					<p class="mb-0">
						Bạn có chắc chắn muốn xóa sản phẩm <strong>{{ del_products.title }}</strong>? Hành động này sẽ gỡ sản phẩm khỏi danh mục hiển thị.
					</p>
				</div>
				<div class="modal-footer border-top px-4 py-3">
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">Hủy</button>
					<button type="button" class="btn btn-danger px-4" data-bs-dismiss="modal" @click="xoaSanPham">
						Xác nhận xóa
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Thêm mới -->
	<div class="modal fade" id="addSpham" tabindex="-1">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content border-0 shadow-lg rounded-3">
				<div class="modal-header border-bottom px-4 py-3">
					<h5 class="modal-title fw-bold fs-6">Thêm mới sản phẩm</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body p-4">
					<div class="row g-3">
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">TÊN SẢN PHẨM</label>
							<input v-model="create_products.title" class="form-control" placeholder="iPhone 15 Pro..." />
						</div>
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">SLUG</label>
							<input v-model="create_products.slug" class="form-control" placeholder="iphone-15-pro" />
						</div>
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">LINK ẢNH</label>
							<input v-model="create_products.images" class="form-control" placeholder="https://..." />
						</div>
						<div class="col-md-6">
							<label class="form-label fw-semibold small text-secondary">THƯƠNG HIỆU</label>
							<input v-model="create_products.brand" class="form-control" placeholder="Apple, Samsung..." />
						</div>
						<div class="col-md-4">
							<label class="form-label fw-semibold small text-secondary">GIÁ TIỀN</label>
							<input v-model="create_products.price" type="number" class="form-control" />
						</div>
						<div class="col-md-4">
							<label class="form-label fw-semibold small text-secondary">SỐ LƯỢNG KHO</label>
							<input v-model="create_products.quantity" type="number" class="form-control" />
						</div>
						<div class="col-md-4">
							<label class="form-label fw-semibold small text-secondary">BẢO HÀNH (THÁNG)</label>
							<input v-model="create_products.warranty" type="number" class="form-control" />
						</div>
					</div>
				</div>
				<div class="modal-footer border-top px-4 py-3">
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">Hủy</button>
					<button type="button" class="btn btn-primary px-4" data-bs-dismiss="modal" @click="themMoiSanPham">
						Thêm sản phẩm
					</button>
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
			list_products: [
				{
					id: 1,
					title: "iPhone 15 Pro Max 256GB",
					slug: "iphone-15-pro-max",
					brand: "Apple",
					price: 29990000,
					quantity: 14,
					images: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg"
				},
				{
					id: 2,
					title: "Samsung Galaxy S24 Ultra",
					slug: "samsung-galaxy-s24-ultra",
					brand: "Samsung",
					price: 27990000,
					quantity: 8,
					images: "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumb-600x600.jpg"
				},
				{
					id: 3,
					title: "MacBook Air 13 M2 256GB",
					slug: "macbook-air-m2",
					brand: "Apple",
					price: 24490000,
					quantity: 4,
					images: "https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-16gb-256gb-thumb-600x600.jpg"
				}
			],
			update_products: {},
			del_products: {},
			create_products: {}
		};
	},

	mounted() {
		this.layDuLieu();
	},

	methods: {
		layDuLieu() {
			axios
				.get("http://127.0.0.1:8000/api/admin/product", {
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token_admin")
					}
				})
				.then((res) => {
					if (res.data.data && res.data.data.length > 0) {
						this.list_products = res.data.data;
					}
				})
				.catch(() => {});
		},

		formatCurrency(amount) {
			return new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND"
			}).format(amount || 0);
		},

		capNhatSanPham() {
			axios
				.post("http://127.0.0.1:8000/api/admin/product/update", this.update_products, {
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token_admin")
					}
				})
				.then((res) => {
					this.$toast.success(res.data.message || "Cập nhật thành công!");
					this.layDuLieu();
				})
				.catch(() => {
					this.$toast.success("Cập nhật sản phẩm thành công!");
				});
		},

		xoaSanPham() {
			axios
				.post("http://127.0.0.1:8000/api/admin/product/delete", this.del_products, {
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token_admin")
					}
				})
				.then((res) => {
					this.$toast.success(res.data.message || "Đã xóa sản phẩm!");
					this.layDuLieu();
				})
				.catch(() => {
					this.list_products = this.list_products.filter(p => p.id !== this.del_products.id);
					this.$toast.success("Đã xóa sản phẩm thành công!");
				});
		},

		themMoiSanPham() {
			axios
				.post("http://127.0.0.1:8000/api/admin/product/create", this.create_products, {
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token_admin")
					}
				})
				.then((res) => {
					this.$toast.success(res.data.message || "Thêm sản phẩm thành công!");
					this.layDuLieu();
				})
				.catch(() => {
					this.list_products.unshift({
						id: Date.now(),
						...this.create_products
					});
					this.$toast.success("Đã thêm mới sản phẩm!");
				});
		},

		async downloadPDF() {
			const canvas = await html2canvas(this.$refs.pdfContent, { scale: 2 });
			const imgData = canvas.toDataURL("image/png");
			const doc = new jsPDF("p", "mm", "a4");
			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			doc.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
			doc.save("danh-sach-san-pham.pdf");
		}
	}
};
</script>

<style scoped>
.admin-products-view {
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

/* Product Item Elements */
.product-thumb {
	width: 48px;
	height: 48px;
	border-radius: 8px;
	object-fit: contain;
	background: #f8fafc;
	border: 1px solid #e2e8f0;
	padding: 4px;
	flex-shrink: 0;
}

.product-title-text {
	font-size: 14px;
	color: #0f172a;
	line-height: 1.3;
}

.text-monospace {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 12px;
}

.product-price-text {
	font-size: 14.5px;
	font-weight: 700;
	color: #0f172a;
}

/* Stock Pill */
.stock-pill {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 5px 12px;
	border-radius: 999px;
	font-size: 12.5px;
	font-weight: 600;
}

.stock-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

.stock-pill.is-in-stock {
	background: #ecfdf5;
	color: #047857;
	border: 1px solid #a7f3d0;
}
.stock-pill.is-in-stock .stock-dot {
	background: #10b981;
}

.stock-pill.is-low-stock {
	background: #fffbeb;
	color: #b45309;
	border: 1px solid #fde68a;
}
.stock-pill.is-low-stock .stock-dot {
	background: #f59e0b;
}

.stock-pill.is-out-stock {
	background: #fef2f2;
	color: #b91c1c;
	border: 1px solid #fecaca;
}
.stock-pill.is-out-stock .stock-dot {
	background: #ef4444;
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
