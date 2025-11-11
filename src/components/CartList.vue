<template>
  <div class="cart-list">
    <div v-for="item in items" :key="item.id" class="cart-item">
      <img 
        :src="item.image" 
        :alt="item.name" 
        class="product-image"
      >
      <div class="product-info">
        <h4>{{ item.name }} ID: {{ item.id }}</h4>
        <p>{{ item.price }} руб. × {{ item.quantity }}</p>
        <p class="item-total">Итого: {{ item.price * item.quantity }} руб.</p>
      </div>
      <div class="actions">
        <div class="quantity-controls">
          <button 
            class="quantity-btn minus" 
            @click="decreaseQuantity(item)"
            :disabled="item.quantity <= 1"
          >-</button>
          <span class="quantity-display">{{ item.quantity }}</span>
          <button 
            class="quantity-btn plus" 
            @click="increaseQuantity(item)"
          >+</button>
        </div>
        <button class="remove-btn" @click="$emit('remove-item', item.id)">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items'],
  methods: {
    increaseQuantity(item) {
      const newQuantity = item.quantity + 1;
      this.$emit('update-quantity', { id: item.id, quantity: newQuantity });
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        this.$emit('update-quantity', { id: item.id, quantity: newQuantity });
      }
    }
  }
}
</script>

<style scoped>
.cart-list {
  margin-top: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 6px 22px rgba(0,0,0,0.06);
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  margin: 20px;
  border: 1px solid #eee;
  border-radius: 16px;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
}

.product-info {
  flex-grow: 1;
}

.product-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.product-info p {
  margin: 4px 0;
  color: #666;
}

.item-total {
  font-weight: bold;
  color: #2F553D !important;
  font-size: 1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 25px;
  padding: 4px;
  border: 1px solid #ddd;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #2F553D;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #234237;
  transform: scale(1.1);
}

.quantity-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.quantity-btn.plus {
  background: #4CAF50;
}

.quantity-btn.plus:hover:not(:disabled) {
  background: #45a049;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.remove-btn {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #d32f2f;
  transform: translateY(-1px);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .product-image {
    margin-right: 0;
    margin-bottom: 15px;
    width: 100px;
    height: 100px;
  }
  
  .product-info {
    margin-bottom: 15px;
  }
  
  .actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .quantity-controls {
    margin-right: 10px;
  }
}
</style>