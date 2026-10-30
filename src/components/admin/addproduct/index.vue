<template>
	<div class="card">
		<div class="card-body p-4">
			<h5 class="card-title">Thêm mới sản phẩm</h5>
			<hr class="border-primary border-top border-3 border-0">
			<div class="form-body mt-4">
				<div class="row">
					<div class="col-lg-12">
						<div class="border border-3 p-4 rounded">

							<!-- Thông tin cơ bản -->
							<div class="mb-3">
								<label class="form-label text-start d-block">Product Title</label>
								<input type="text" class="form-control" v-model="product.title"
									placeholder="Enter product title">
							</div>
							<div class="mb-3">
								<label class="form-label text-start d-block">Slug</label>
								<input type="text" class="form-control" v-model="product.slug"
									placeholder="Enter product slug">
							</div>
							<div class="mb-3">
								<label class="form-label text-start d-block">Product Images</label>
								<input type="text" class="form-control" v-model="product.images"
									placeholder="Enter product image URL">
							</div>
							<div class="mb-3">
								<label class="form-label text-start d-block">Price</label>
								<input type="number" class="form-control" v-model="product.price" placeholder="00.00">
							</div>
							<div class="mb-3">
								<label class="form-label text-start d-block">Quantity</label>
								<input type="number" class="form-control" v-model="product.quantity" placeholder="00">
							</div>
							<div class="mb-3">
								<label class="form-label text-start d-block">Thương Hiệu</label>
								<input class="form-control" v-model="product.brand" placeholder="Brand">
							</div>

							<!-- Thông số kỹ thuật -->
							<h6 class="text-primary fw-bold mb-2 mt-3">Thông số kỹ thuật</h6>
							<div class="row">
								<div class="col-md-6">
									<label class="form-label text-start d-block">Pin (mAh)</label>
									<input v-model="product.pin" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label class="form-label text-start d-block">Hỗ trợ sạc tối đa</label>
									<input v-model="product.cong_suat" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label class="form-label text-start d-block">Thời gian sạc (h)</label>
									<input v-model="product.thoi_gian_sac" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label class="form-label text-start d-block">Thời gian bảo hành (tháng)</label>
									<input v-model="product.warranty" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label class="form-label text-start d-block">Cổng kết nối/sạc:</label>
									<input v-model="product.ketnoi" type="text" class="form-control mb-2" />
								</div>
								<div class="col-md-6">
									<label class="form-label text-start d-block">Tính năng</label>
									<input v-model="product.tinh_nang" type="text" class="form-control mb-2" />
								</div>
							</div>

							<div class="col-12 mt-3">
								<div class="d-grid">
									<button type="button" class="btn btn-primary" @click="createProduct">
										Thêm mới sản phẩm
									</button>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			product: {
				images: "",
				title: "",
				slug: "",
				price: null,
				quantity: null,
				status: "active",
				pin: "",
				cong_suat: "",
				thoi_gian_sac: "",
				ketnoi: "",
				tinh_nang: "",
				warranty: "",
			},
		};
	},
	methods: {
		createProduct() {
			const specs = JSON.stringify({
				pin: this.product.pin,
				cong_suat: this.product.cong_suat,
				thoi_gian_sac: this.product.thoi_gian_sac,
				ketnoi: this.product.ketnoi,
				tinh_nang: this.product.tinh_nang,
			});
			const payload = { ...this.product, specs };

			axios.post('http://127.0.0.1:8000/api/admin/products/create', payload)
				.then(res => {
					if (res.data.status) {
						this.$toast.success(res.data.message);
						this.resetForm();
						this.$emit('reloadData');
					} else {
						this.$toast.error(res.data.message);
					}
				})
				.catch(error => {
					if (error.response?.data?.errors) {
						Object.values(error.response.data.errors).flat().forEach(msg => this.$toast.error(msg));
					}
				});
		},
		resetForm() {
			this.product = {
				images: "",
				title: "",
				slug: "",
				price: null,
				quantity: null,
				status: "active",
				pin: "",
				cong_suat: "",
				thoi_gian_sac: "",
				ketnoi: "",
				tinh_nang: "",
				warranty: "",
			};
		},
	}
};
</script>
