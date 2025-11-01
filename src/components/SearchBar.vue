<template>
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Поиск товаров..." 
        @input="handleInput"
      />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      handleInput() {
        this.$emit('search', this.searchQuery)
      }
    }
  }
  </script>
  
  <style scoped>
  .search-bar {
    margin: 20px 0;
  }
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  </style>