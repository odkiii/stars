<template>
  <div class="product-item">
    <img :src="product.link" :alt="product.name">
    <h3>{{ product.name }}</h3>
    <p>{{ product.price }} руб.</p>
    <button @click="addToCart">В корзину</button>
  </div>
</template>

<script>
export default {
  props: ['product'],
  methods: {
    addToCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      const existingItem = cart.find(item => item.id === this.product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({ ...this.product, quantity: 1 })
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      this.$emit('cart-updated')  
      alert('Товар добавлен в корзину!')
    }
  }
}
</script>
  <style scoped>
  .product-item {
    padding: 15px;
    border: 1px solid #222222;
    text-align: center;
  }
  
  .product-image {
    max-width: 200px;
    height: auto;
    margin: 10px 0;
  }
  
  .price {
    font-size: 20px;
    color: #333;
    margin: 10px 0;
  }
  
  .buy-button {
    background-color: #d47d43;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 40px;
    cursor: pointer;
    transition: background-color 0.5s;
  }
  
  .buy-button:hover {
    background-color: #d36703;
  }
  </style>