<template>
    <div class="cart-list">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" class="product-image">
        <div class="product-info">
          <h4>{{ item.name }} ID: {{ item.id }}</h4>
          <p>{{ item.price }} руб. × {{ item.quantity }}</p>
        </div>
        <div class="actions">
          <input 
            type="number" 
            v-model.number="item.quantity" 
            min="1" 
            @change="$emit('update-quantity', { id: item.id, quantity: item.quantity })"
          >
          <button @click="$emit('remove-item', item.id)">Удалить</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['items']
  }
  </script>
  
  <style scoped>
  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 15px;
    margin: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #eee;
  }
  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 15px;
  }
  .product-info {
    flex-grow: 1;
  }
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input {
    width: 60px;
    margin-bottom: 5px;
    padding: 5px;
    text-align: center;
  }
  button {
    padding: 5px 10px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>