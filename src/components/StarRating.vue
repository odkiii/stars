<template>
  <div class="star-rating">
    <span 
      v-for="star in 5" 
      :key="star" 
      @click="setRating(star)"
      :class="{ 'active': star <= modelValue }"
    >
      ★
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Number
  },
  emits: ['update:modelValue'],
  methods: {
    setRating(rating) {
      this.$emit('update:modelValue', rating);
    }
  }
}
</script>
    
<style>
.star-rating span {
  cursor: pointer;
  font-size: 2em;
  color: #ccc;
  transition: color 0.2s;
}

.star-rating .active {
  color: #ffd700;
}
</style>