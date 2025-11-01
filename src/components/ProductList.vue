<template>
  <div class="product-container">
    <ProductItem 
      v-for="product in products" 
      :key="product.id" 
      :product="product" 
      @view-product="viewProduct"
    />
  </div>
</template>

<script>
import ProductItem from './ProductItem.vue'

export default {
  components: {
    ProductItem
  },
  props: ['products'],
  methods: {
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`)
    }
  }
}
</script>

<style scoped>
.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>