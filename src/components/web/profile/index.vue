<template>
  <div class="container">
    <div class="profile-card" :class="{ flipped: isFlipped }">
      <div class="card-front">
        <div class="profile-info">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS_sLYpyeShGPeBAdNVXbZOIBYTN1Vv5qCBQ&s"
            alt="User" class="avatar" @click="flipCard" />
          <h4>{{ user.ho_ten }}</h4>
          <p>Email: {{ user.email }}</p>
          <p>Điện thoại: {{ user.so_dien_thoai }}</p>
          <p>Địa chỉ: {{ user.dia_chi }}</p>
        </div>
      </div>
      <div class="card-back">
        <div class="card">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Họ và tên</h6>
              </div>
              <div class="col-sm-9 text-secondary">
                <input type="text" class="form-control" v-model="user.ho_va_ten" />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Email</h6>
              </div>
              <div class="col-sm-9 text-secondary">
                <input type="text" class="form-control" v-model="user.email" />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Số Điện Thoại</h6>
              </div>
              <div class="col-sm-9 text-secondary">
                <input type="text" class="form-control" v-model="user.so_dien_thoai" />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Địa Chỉ</h6>
              </div>
              <div class="col-sm-9 text-secondary">
                <input type="text" class="form-control" v-model="user.dia_chi" />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6 text-secondary">
                <button class="btn btn-primary px-4" @click="capNhatProfile">
                  Lưu
                </button>

              </div>
              <div class="col-sm-6 text-secondary">
                <button class="btn btn-danger px-4 ms-2" @click="flipCard">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserProfile",
  data() {
    return {
      isFlipped: false,
      user: {},
    };
  },
  mounted() {
    this.layThongTinLogin();
  },
  methods: {
    layThongTinLogin() {
      var token = localStorage.getItem("users_login");
      axios
        .get("http://127.0.0.1:8000/api/customer/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.data.status) {
            this.user = res.data.data;
          } else {
            toaster.error(res.data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu:", error);
        });
    },
    capNhatProfile() {
      const payload = {
        ho_va_ten: this.user.ho_va_ten,
        so_dien_thoai: this.user.so_dien_thoai,
        email: this.user.email,
        dia_chi: this.user.dia_chi,
      };

      axios
        .post(
          "http://127.0.0.1:8000/api/customer/profile/update-profile",
          payload,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("users_login"),
            },
          }
        )
        .then((res) => {
          if (res.data.status) this.$toast.success(res.data.message);
          else this.$toast.error(res.data.message);
          this.layThongTinLogin();
          this.flipCard();
        })
        .catch((err) => {
          console.error(err);
          this.$toast.error("Có lỗi khi cập nhật thông tin.");
        });
    },
    flipCard() {
      this.isFlipped = !this.isFlipped;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #e3e3e3);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.profile-card {
  width: 100%;
  height: 500px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.profile-card.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.card-back {
  transform: rotateY(180deg);
}

.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 3px solid #007bff;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 5px;
}

.delivered {
  background: #d4edda;
  color: #155724;
}

.shipping {
  background: #fff3cd;
  color: #856404;
}
</style>
