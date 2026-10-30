<template>
  <div class="container-fluid">
    <!-- Tiêu đề -->
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-11 mt-1">
                <h3><b>Đơn hàng</b></h3>
              </div>
              <div class="col-lg-1 mt-2 d-flex align-items-center">
                <label class="me-2">
                  <h5>Sắp xếp</h5>
                </label>
                <i class="fa-solid fa-sort"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bộ lọc -->
    <div class="row">
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h4 class="fw-bold text-warning">Bộ lọc</h4>
          </div>
          <div class="card-body">
            <h5 class=" fw-semibold border-bottom pb-1 text-primary">Trạng thái đơn hàng</h5>
            <div class="list-group">
              <button v-for="(status, index) in orderStatuses" :key="index"
                class="list-group-item list-group-item-action" :class="{ 'active': selectedStatus === status }"
                @click="filterOrders(status)">
                {{ status }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách đơn hàng -->
      <div class="col-lg-8">
        <div v-for="order in filteredOrders" :key="order.id" class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-2">
                <img :src="order.hinh_anh + '?t=' + new Date().getTime()" alt="" class="img-fluid"
                  style="width: 150px;height: 150px; cursor: pointer;" @click="goToOrderDetail(order.id)">
              </div>
              <div class="col-lg-4">
                <h5>{{ order.ma_don_hang }}</h5>
                <br>
                <h5>Số lượng: {{ order.so_luong }}</h5>
              </div>
              <div class="col-lg-2">
                <h5><b>{{ formatVND(order.tong_tien) }}</b></h5>
              </div>
              <div class="col-lg-4">
                <h5>
                  <i class="fa-solid fa-circle me-2" :style="{ color: getStatusColor(order.tinh_trang) }"></i>
                  {{ getStatusText(order.tinh_trang) }}
                </h5>
                <h5 v-if="order.tinh_trang === 1">Đơn hàng của bạn đã được giao</h5>
                <h5 v-else-if="order.tinh_trang === 0">Đơn hàng của bạn đã hủy</h5>
                <h5 v-else>Đơn hàng của bạn đang được giao</h5>
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
      orders: [],
      filteredOrders: [],
      orderStatuses: ["Tất cả", "Đang giao", "Đã giao", "Đã hủy"],
      selectedStatus: "Tất cả",
    };
  },
  mounted() {
    this.loadOrders();
  },
  methods: {
    loadOrders() {
      axios
        .get('http://127.0.0.1:8000/api/khach-hang/order/data', {
          headers: { Authorization: "Bearer " + localStorage.getItem('users_login') }
        })
        .then(response => {
          this.orders = response.data.data;
          this.filteredOrders = this.orders;
        })
        .catch(error => {
          console.error('Lỗi khi tải đơn hàng:', error);
        });

    },
     formatVND(number) {
            return new Intl.NumberFormat('vi-VI', { style: 'currency', currency: 'VND' }).format(number,)
        },
    filterOrders(status) {
      this.selectedStatus = status;
      if (status === "Tất cả") {
        this.filteredOrders = this.orders;
      } else {
        this.filteredOrders = this.orders.filter(
          order => this.getStatusText(order.tinh_trang) === status
        );
      }
    },
    getStatusColor(tinh_trang) {
      if (tinh_trang == 0) return "red";
      if (tinh_trang == 1) return "green";
      return "yellow";
    },
    getStatusText(tinh_trang) {
      if (tinh_trang == 0) return "Đã hủy";
      if (tinh_trang == 1) return "Đã giao";
      return "Đang giao";
    },
    goToOrderDetail(orderId) {
      this.$router.push(`/order/${orderId}`);
    }
  }

};
</script>

<style>
.card-img-top {
  height: 200px;
  object-fit: cover;
}

.list-group-item.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>