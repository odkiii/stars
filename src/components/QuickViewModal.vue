<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="close-btn" @click="close">&times;</button>
        
        <div class="modal-body">
          <div class="modal-image">
            <img :src="star.image" :alt="star.name">
          </div>
          
          <div class="modal-info">
            <h2>{{ star.name }}</h2>
            <p class="price">{{ star.price }} руб.</p>
            <p class="description">{{ star.description }}</p>
            
            <button class="add-to-cart" @click="addToCart">
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['star'],
    methods: {
      close() {
        this.$emit('close')
      },
      addToCart() {
        this.$emit('add-to-cart', this.star)
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 10px;
    width: 80%;
    max-width: 800px;
    max-height: 90vh;
    overflow: auto;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .modal-body {
    display: flex;
    padding: 30px;
  }
  
  .modal-image {
    flex: 1;
    padding-right: 30px;
  }
  
  .modal-image img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .modal-info {
    flex: 1;
  }
  
  .modal-info h2 {
    margin-top: 0;
    color: #333;
  }
  
  .price {
    font-size: 1.8rem;
    font-weight: bold;
    color: #4CAF50;
    margin: 20px 0;
  }
  
  .description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
  }
  
  .add-to-cart {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .add-to-cart:hover {
    background: #3d8b40;
  }
  
  @media (max-width: 768px) {
    .modal-body {
      flex-direction: column;
      padding: 20px;
    }
    
    .modal-image {
      padding-right: 0;
      margin-bottom: 20px;
    }
  }
  </style>