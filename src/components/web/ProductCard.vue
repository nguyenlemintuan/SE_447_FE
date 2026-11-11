<template>
  <article class="sf-product" @click="goToDetail">
    <div class="sf-product-media">
      <img :src="product.images || fallbackImage" :alt="product.title" loading="lazy" @error="onImageError" />
      <span v-if="stockBadge" class="sf-product-flag" :class="stockBadge.className">
        {{ stockBadge.label }}
      </span>
    </div>

    <div class="sf-product-body">
      <span class="sf-product-brand">{{ product.brand || "LifeTech" }}</span>
      <h3 class="sf-product-title" :title="product.title">{{ product.title }}</h3>

      <div class="sf-product-meta">
        <span class="sf-product-rating">
          <i class="bx bxs-star"></i>
          {{ product.avgRating ? product.avgRating : "Mới" }}
          <small v-if="product.reviewCount">({{ product.reviewCount }})</small>
        </span>
        <span class="sf-product-sold">Đã bán {{ product.sold_quantity || 0 }}</span>
      </div>

      <div class="sf-product-bottom">
        <strong class="sf-product-price">{{ formatCurrency(product.price) }}</strong>
        <button class="sf-product-btn" type="button" title="Thêm vào giỏ hàng" @click.stop="$emit('add', product)">
          <i class="bx bxs-cart-add"></i>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  product: { type: Object, required: true },
});

defineEmits(["add"]);

const router = useRouter();

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f8fafc'/%3E%3Crect x='140' y='110' width='120' height='190' rx='18' fill='none' stroke='%23cbd5e1' stroke-width='8'/%3E%3Ccircle cx='200' cy='265' r='8' fill='%23cbd5e1'/%3E%3C/svg%3E";

const stockBadge = computed(() => {
  const quantity = Number(props.product.quantity);
  if (!Number.isNaN(quantity) && quantity <= 0) {
    return { label: "Hết hàng", className: "is-danger" };
  }
  if (!Number.isNaN(quantity) && quantity <= 3) {
    return { label: "Sắp hết", className: "is-warning" };
  }
  return { label: "Chính hãng", className: "is-brand" };
});

function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(number);
}

function goToDetail() {
  router.push(`/web/chi-tiet-san-pham/${props.product.id}`);
}

function onImageError(event) {
  event.target.src = fallbackImage;
}
</script>

<style scoped>
.sf-product {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1px solid var(--lt-line);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--lt-transition), box-shadow var(--lt-transition),
    border-color var(--lt-transition);
}

.sf-product:hover {
  transform: translateY(-2px);
  border-color: #fed7aa;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
}

.sf-product:active {
  transform: translateY(0);
}

.sf-product-media {
  position: relative;
  aspect-ratio: 1 / 0.95;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}

.sf-product-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.35s ease;
}

.sf-product:hover .sf-product-media img {
  transform: scale(1.03);
}

.sf-product-flag {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--lt-line);
  color: var(--lt-ink-soft);
}

.sf-product-flag.is-brand {
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
  border-color: var(--lt-orange-line);
}

.sf-product-flag.is-warning {
  color: var(--lt-warning);
  background: var(--lt-warning-soft);
  border-color: #fde6b8;
}

.sf-product-flag.is-danger {
  color: var(--lt-danger);
  background: var(--lt-danger-soft);
  border-color: #fbd5d5;
}

.sf-product-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
  padding: 14px 16px 16px;
}

.sf-product-brand {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lt-orange-dark);
}

.sf-product-title {
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.45;
  margin: 0;
  color: var(--lt-ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.sf-product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: var(--lt-muted);
}

.sf-product-rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #b45309;
  font-weight: 600;
}

.sf-product-rating i {
  color: #f59e0b;
  font-size: 14px;
}

.sf-product-rating small {
  color: var(--lt-muted);
  font-weight: 500;
}

.sf-product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 8px;
}

.sf-product-price {
  font-size: 16.5px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--lt-ink);
}

.sf-product-btn {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--lt-orange-line);
  border-radius: 11px;
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--lt-transition);
}

.sf-product-btn:hover {
  background: var(--lt-orange);
  border-color: var(--lt-orange);
  color: #fff;
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.28);
}

.sf-product-btn:active {
  transform: scale(0.92);
}
</style>
