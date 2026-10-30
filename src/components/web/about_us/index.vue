<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <img src="https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" class="img-fluid w-100 mb-4" alt="Giới thiệu">
        
        <h5 class="mt-1 text-success">Về Chúng Tôi</h5>
        <p class="text-muted">Chúng tôi khởi đầu với niềm đam mê công nghệ và mong muốn mang đến những sản phẩm điện máy chất lượng cao cho khách hàng. Hành trình của chúng tôi là sự nỗ lực không ngừng để mang đến giải pháp tốt nhất cho gia đình Việt.</p>

        <h5 class="mt-4 text-success">Sứ Mệnh Của Chúng Tôi</h5>
        <p class="text-muted">Cung cấp các sản phẩm điện máy tiên tiến, giúp nâng cao chất lượng cuộc sống và mang đến trải nghiệm mua sắm thuận tiện, đáng tin cậy.</p>

        <h5 class="mt-4 text-success">Giá Trị Cốt Lõi</h5>
        <ul class="list-unstyled">
          <li><strong>Chất Lượng:</strong> Cam kết mang đến sản phẩm chính hãng, bền bỉ và hiện đại.</li>
          <li><strong>Uy Tín:</strong> Minh bạch trong mọi hoạt động kinh doanh, lấy khách hàng làm trung tâm.</li>
          <li><strong>Đổi Mới:</strong> Luôn cập nhật công nghệ mới nhất, mang đến sự tiện nghi và thông minh.</li>
        </ul>

        <h5 class="mt-4 text-success">Đội Ngũ Của Chúng Tôi</h5>
      </div>
    </div>

    <div class="row justify-content-center row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 mt-3">
      <div class="col text-center" v-for="(member, index) in team" :key="index">
        <div class="card h-100">
          <img src="https://e7.pngegg.com/pngimages/358/473/png-clipart-computer-icons-user-profile-person-child-heroes.png" class="card-img-top mx-auto" style="width: 100px;" alt="Thành viên">
          <div class="card-body">
            <h5 class="card-title">{{ member.name }}</h5>
            <p class="card-text text-muted">{{ member.position }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      team: [
        { name: 'Ông Dũng', position: 'Giám Đốc Điều Hành (CEO)' },
        { name: 'Bà Lan', position: 'Giám Đốc Công Nghệ (CTO)' },
        { name: 'Ông Nam', position: 'Giám Đốc Tài Chính (CFO)' },
        { name: 'Bà Linh', position: 'Giám Đốc Marketing (CMO)' },
        { name: 'Ông Hoàng', position: 'Giám Đốc Vận Hành (COO)' }
      ]
    };
  }
};
</script>

<style scoped>
.container-fluid {
  padding: 2rem 0;
}
.card-img-top {
  border-radius: 50%;
}
.card-title {
  margin-top: 0.5rem;
  font-weight: bold;
}
.text-success {
  color: #28a745 !important;
}
.text-muted {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.6;
}
ul li {
  margin-bottom: 0.5rem;
}
.row-cols-lg-5 > .col {
  max-width: 200px;
}
</style>