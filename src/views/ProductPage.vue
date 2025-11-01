<template>
  <div class="product-page">
    <div class="product-container">
      <div class="product-gallery">
        <img :src="product.image" :alt="product.name" class="main-image">
        <!-- Можно добавить миниатюры, если есть дополнительные изображения -->
      </div>
      
      <div class="product-details">
        <h1 class="product-title">{{ product.name }}</h1>
        <div class="product-meta">
          <span class="product-sku">Артикул: {{ product.id }}</span>
          <span class="product-availability">В наличии</span>
        </div>
        
        <div class="product-description">
          <h3>Описание</h3>
          <p>{{ product.description }}</p>
        </div>
        
        <div class="product-price">
          <span class="current-price">{{ formatPrice(product.price) }}</span>
          <span class="old-price" v-if="product.oldPrice">{{ formatPrice(product.oldPrice) }}</span>
        </div>
        
        <div class="product-actions">
          <button class="add-to-cart-btn" @click="addToCart">
            Добавить в корзину
          </button>
          <button class="buy-now-btn" @click="buyNow">
            Купить сейчас
          </button>
        </div>
        
        <div class="product-attributes">
          <div class="attribute" v-if="product.color">
            <span class="attribute-name">Цвет:</span>
            <span class="attribute-value">{{ product.color }}</span>
          </div>
          <div class="attribute" v-if="product.size">
            <span class="attribute-name">Размер:</span>
            <span class="attribute-value">{{ product.size }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="back-to-catalog">
      <router-link to="/products" class="back-link">
        ← Вернуться в каталог
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductPage',
  props: ['id'],
  data() {
    return {
      product: {}
    }
  },
  async created() {
    await this.fetchProduct();
  },
  methods: {
    ...mapActions(['addItemToCart']),
    
    async fetchProduct() {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${this.id}`);
        this.product = await response.json();
      } catch (error) {
        console.error('Ошибка загрузки товара:', error);
      }
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    },
    
    addToCart() {
      this.addItemToCart({
        product: this.product,
        quantity: 1
      });
      this.$notify({
        title: 'Товар добавлен',
        message: `${this.product.name} добавлен в корзину`,
        type: 'success'
      });
    },
    
    buyNow() {
      this.addToCart();
      this.$router.push('/cart');т
    }
  }
}
</script>

<style scoped>
.product-page {
  min-height: 100vh;
  padding: 40px;
  background-color: #f8f8f8;
}

.product-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.product-gallery {
  flex: 1;
  padding: 30px;
  background: #f5f5f5;
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
  border-radius: 8px;
}

.product-details {
  flex: 1;
  padding: 40px;
}

.product-title {
  font-size: 2.2rem;
  margin-bottom: 15px;
  color: #333;
}

.product-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  color: #777;
  font-size: 0.9rem;
}

.product-description {
  margin: 30px 0;
  line-height: 1.6;
}

.product-description h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #444;
}

.product-price {
  margin: 30px 0;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
}

.old-price {
  font-size: 1.4rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 15px;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin: 40px 0;
}

.add-to-cart-btn, .buy-now-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background: #4CAF50;
  color: white;
}

.add-to-cart-btn:hover {
  background: #388E3C;
  transform: translateY(-2px);
}

.buy-now-btn {
  background: #2196F3;
  color: white;
}

.buy-now-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.product-attributes {
  margin-top: 30px;
}

.attribute {
  display: flex;
  margin-bottom: 12px;
}

.attribute-name {
  font-weight: 600;
  color: #555;
  min-width: 100px;
}

.back-to-catalog {
  max-width: 1200px;
  margin: 30px auto 0;
}

.back-link {
  color: #2196F3;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0d8aee;
}


</style>