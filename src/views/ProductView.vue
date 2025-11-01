<template>
  <div class="product-view">
    <div v-if="product" class="product-details">
      <div class="product-images">
        <img :src="product.image" :alt="product.name" class="main-image">
      </div>
      <div class="product-info">
        <h2>{{ product.name }}</h2>
        <p class="product-description">{{ product.description }}</p>
        <div class="price-container">
          <span class="price">{{ formatPrice(product.price) }}</span>
          <span class="price-old" v-if="product.oldPrice">{{ formatPrice(product.oldPrice) }}</span>
        </div>
        <button class="add-to-cart" @click="addToCart(product)">
          В корзину
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    product() {
      return this.$store.state.products.find(p => p.id === parseInt(this.id));
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product);
    }
  }
}
</script>

<style scoped>
.product-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-details {
  display: flex;
  gap: 40px;
}

.product-images {
  flex: 1;
}

.main-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-description {
  margin: 20px 0;
  line-height: 1.6;
  color: #555;
}

.price-container {
  margin: 20px 0;
}

.price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4CAF50;
}

.price-old {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.add-to-cart {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart:hover {
  background: #388E3C;
}

@media (max-width: 768px) {
  .product-details {
    flex-direction: column;
  }
}
</style>