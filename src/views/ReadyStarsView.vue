<template>
  <section class="ready-stars" data-theme="light">
      <notifications position="top right" />

   
    <div class="filters-container">
       <h1 class="filters-header">ТОВАРЫ</h1>
      <div class="filters">
        
        <!-- Фильтр по цвету -->
        <h3>Фильтры:</h3>

        <div class="filter-group">
          <div class="filters-buttons">
            <div class="color-dropdown">
            <button class="dropdown-toggle" @click="toggleColorDropdown">
              <i class="fas fa-palette"></i>
              <span>Цвет</span>
            </button>
            <div class="dropdown-menu" v-if="isColorDropdownOpen">
              <div class="color-options">
                <div 
                  class="color-option"
                  :class="{ 'active': filters.color === '' }"
                  @click="selectColor('')"
                >
                  <div class="color-circle all-colors">
                    <span>Все</span>
                  </div>
                  <div class="color-name">Все цвета</div>
                </div>
                <div 
                  v-for="color in colors" 
                  :key="color"
                  class="color-option"
                  :class="{ 'active': filters.color === color }"
                  @click="selectColor(color)"
                >
                  <div class="color-circle">
                    <img :src="`/colors/${color.en}.png`" :alt="color.ru">
                  </div>
                  <div class="color-name">{{ color.ru }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="filter-group">
            <div class="price-dropdown">
              <button class="dropdown-toggle" @click="togglePriceDropdown">
                <i class="fas fa-coins"></i>
                <span>{{ priceRangeText }}</span>
              </button>
              <div class="dropdown-menu" v-if="isPriceDropdownOpen">
                <div class="price-range">
                  <input v-model.number="tempMinPrice" class="price-input" placeholder="От">
                  <span>-</span>
                  <input v-model.number="tempMaxPrice" class="price-input" placeholder="До">
                </div>
                <div class="filter-actions">
                  <button @click="applyPriceFilter" class="apply-btn">Применить</button>
                  <button @click="resetPriceFilter" class="reset-btn">Сбросить</button>
                </div>
              </div>
            </div>
          </div>




          </div>
        </div>

        <!-- Фильтр по цене -->
        
      </div>
    </div>

     <div class="stars-grid">
      <div 
        v-for="star in sortedStars" 
        :key="star.id" 
        class="star-card"
      >
      <!-- @click="goToProduct(star.id)" -->
        <div class="star-image-container">
          <img :src="star.image" :alt="star.name" class="star-image">
          <div class="product-badge" v-if="star.isNew">Новинка</div>
          <button 
            class="favorite-btn"
            @click.stop="toggleFavorite(star)"
            :class="{ active: isFavorite(star.id) }"
          >
            <i class="fas fa-heart"></i>
          </button>
        </div>
        
        <div class="star-info">
          <h3 class="star-title">{{ star.name }}</h3>
          <p class="star-description">{{ star.description }}</p>
          <div class="price-container">
            <span class="price">{{ formatPrice(star.price) }}</span>
          </div>
          <button class="add-to-cart" @click.stop="addToCart(star)">
            Добавить
          </button>
        </div>
      </div>
    </div>

    <!-- <QuickViewModal 
      v-if="showModal" 
      :star="selectedStar" 
      @close="showModal = false"
      @add-to-cart="addToCart"
    /> -->
  </section>
</template>

<script>
import QuickViewModal from '@/components/QuickViewModal.vue'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


export default {
  components: { 
    QuickViewModal,
    FontAwesomeIcon
  },
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      isColorDropdownOpen: false,
      isPriceDropdownOpen: false,
      sortOption: 'default',
      tempMinPrice: null,
      tempMaxPrice: null,
      filters: {
        color: '',
        minPrice: null,
        maxPrice: null
      },
      showModal: false,
      selectedStar: null,
      stars: [],
      faEye,
      colors: [ 
        {en: 'gold', ru: 'Золотой'},
        {en: 'silver', ru: 'Серебрянный'}, 
        {en: 'ruby', ru: 'Рубиновый'}, 
        {en: 'pearl', ru: 'Жемчужный'}, 
      ],
    }
  },
  async created() {
    await this.loadStars();
  },
  computed: {
    priceRangeText() {
      if (this.filters.minPrice && this.filters.maxPrice) {
        return `${this.filters.minPrice} - ${this.filters.maxPrice} ₽`
      } else if (this.filters.minPrice) {
        return `От ${this.filters.minPrice} ₽`
      } else if (this.filters.maxPrice) {
        return `До ${this.filters.maxPrice} ₽`
      }
      return 'Стоимость'
    },
    availableColors() {
      return [...new Set(this.stars.map(star => star.color))]
    },
    filteredStars() {
      return this.stars.filter(star => {
        // Фильтр по цвету
        if (this.filters.color && star.color !== this.filters.color) {
          return false
        }
        
        // Фильтр по цене
        if (this.filters.minPrice !== null && star.price < this.filters.minPrice) {
          return false
        }
        
        if (this.filters.maxPrice !== null && star.price > this.filters.maxPrice) {
          return false
        }
        
        return true
      })
    },
    sortedStars() {
      const stars = [...this.filteredStars]
      switch (this.sortOption) {
        case 'price-asc':
          return stars.sort((a, b) => a.price - b.price)
        case 'price-desc':
          return stars.sort((a, b) => b.price - a.price)
        default:
          return stars
      }
    }
  },
  methods: {
    async loadStars() {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        
        // Проверка типа ответа
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.stars = await response.json();
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        // Дополнительная обработка ошибки
      }
    },
    toggleColorDropdown() {
      this.isColorDropdownOpen = !this.isColorDropdownOpen
      // Закрываем другое выпадающее меню если открыто
      if (this.isPriceDropdownOpen) this.isPriceDropdownOpen = false
    },  
    selectColor(color) {
      this.filters.color = color
      this.isColorDropdownOpen = false
    },
    togglePriceDropdown() {
      this.isPriceDropdownOpen = !this.isPriceDropdownOpen
    },
    applyPriceFilter() {
      this.filters.minPrice = this.tempMinPrice
      this.filters.maxPrice = this.tempMaxPrice
      this.isPriceDropdownOpen = false
    },
    resetPriceFilter() {
      this.tempMinPrice = null
      this.tempMaxPrice = null
      this.filters.minPrice = null
      this.filters.maxPrice = null
      this.isPriceDropdownOpen = false
    },
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
    },
    openQuickView(star) {
      this.selectedStar = star
      this.showModal = true
    },
    addToCart(star) {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      const existing = cart.find(item => item.id === star.id)
      
      if (existing) {
        existing.quantity += 1
      } else {
        cart.push({ 
          ...star, 
          quantity: 1,
          size: star.display_size,
          full_description: star.full_description || `${star.name} - ${star.display_size}`,
          is_custom: false // Флаг готового товара
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      this.showModal = false
      this.$notify({
        title: 'Добавлено в корзину',
        text: `${star.name} успешно добавлена`,
        type: 'success'
      })
      
      window.dispatchEvent(new CustomEvent('cart-updated'))
    },
    // goToProduct(id) {
    //   this.$router.push({ name: 'Product', params: { id } })
    //     .catch(err => {
    //       console.error('Navigation error:', err)
    //       // Fallback на другой маршрут при ошибке
    //       this.$router.push('/')
    //     })
    // },
    toggleFavorite(star) {
      const index = this.favorites.findIndex(fav => fav.id === star.id);
      
      if (index === -1) {
        this.favorites.push({
          id: star.id,
          name: star.name,
          image: star.image,
          price: star.price
        });
      } else {
        this.favorites.splice(index, 1);
      }
      
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
      this.$notify({
        title: index === -1 ? 'Добавлено в избранное' : 'Удалено из избранного',
        message: star.name,
        type: 'success'
      });
    },
    
    isFavorite(id) {
      return this.favorites.some(fav => fav.id === id);
    }
  },
  watch: {
    'filters.minPrice'(newVal) {
      if (newVal !== null && this.filters.maxPrice !== null && newVal > this.filters.maxPrice) {
        this.filters.maxPrice = newVal
      }
    },
    'filters.maxPrice'(newVal) {
      if (newVal !== null && this.filters.minPrice !== null && newVal < this.filters.minPrice) {
        this.filters.minPrice = newVal
      }
    }
  }
}
</script>

<style scoped>


.favorite-btn {
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;  
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: #696969 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #9f9f9f;
  transition: all 0.3s;
  z-index: 2;
}

.favorite-btn:hover {
  background: white;
  color: #ff6b6b;
}

.favorite-btn.active {
  color: #ff6b6b;
  background: white;
}

.favorite-btn.active:hover {
  color: #ff4757;
}

.star-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
}

h3 {
  color:#333;
}

.filters-buttons{
  display: flex;
  flex-direction: row;
}

.color-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  min-width: 120px;
  text-align: left;
  font-size: 0.9rem;
}

.dropdown-toggle:hover {
  border-color: #aaa;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 5px;
  width: 250px;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.2s;
}

.color-option:hover {
  background: #f5f5f5;
}

.color-option.active {
  background: #e8f5e9;
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.color-option.active .color-circle {
  border-color: #4CAF50;
}

.color-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.all-colors {
  background: linear-gradient(45deg, #f5f5f5, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.all-colors span {
  font-size: 12px;
  color: #555;
}

.color-name {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* Иконки */
.fa-palette, .fa-coins {
  color: #555;
  font-size: 14px;
}

.color-filter {
  display: flex;
  align-items: center;
  gap: 15px;
}

.color-filter-label {
  font-weight: bold;
  color: #555;
}

.color-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.05);
}

.color-option.active .color-circle {
  border: 2px solid #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.color-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.all-colors {
  background: linear-gradient(45deg, #f5f5f5, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.all-colors span {
  font-size: 12px;
  color: #555;
}

.color-name {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.ready-stars {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filters-container {
  margin-bottom: 30px;
  color: #C4C4C4;
}

.filters-header{
  margin-top: 60px;
  margin-bottom: 20px;
  font-size: 3vw;
  text-align: center;
  justify-content: center;

}

.filters {  
  display: flex;
  flex-direction: row;
  gap: 20px;
  background: #f8f8f8;
  padding: 15px;
  border-radius: 15px;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  min-width: 200px;
  cursor: pointer;
}

.price-dropdown {
  position: relative;
}

.dropdown-toggle {
  padding: 10px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  min-width: 180px;
  text-align: left;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 5px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.price-input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.apply-btn {
  padding: 8px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn {
  padding: 8px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.star-card {
  background: #ffffff;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.star-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.star-image-container {
  position: relative;
  /* margin: 20px; */
  
  width: 100%;
  height: 380px;
  /* border-radius: 10px; */
  overflow: hidden;
}

.star-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

/* .star-card:hover .star-image {
  transform: scale(1.05);
} */

.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #FF5722;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.quick-view-btn {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  color: white;
  border: none;
  padding: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: bottom 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.star-card:hover .quick-view-btn {
  bottom: 0;
}

.star-info {
  padding:  0 20px 20px 20px;
  display: grid;
}

.star-title {
  margin: 10px 0 ;
  font-size: 1.3rem;
  color: #333;
}

.price-container {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #696969;
}

.price-old {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.add-to-cart {
  background: #58A926;
  color: rgb(255, 255, 255);
  border: #2abe1c 2px solid;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition:  0.3s ease;
  width: 100%;
  margin: 0 auto;
  text-transform: uppercase;
}
.add-to-cart:hover {
  transform: translateY(-2px);
  background: #396d18;
  border: #396d18 2px solid;
  color: #ededed;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .filters h3 {
    margin-bottom: 10px;
    text-align: center;
  }

  .filters-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    width: 90%;
    gap: 10px;
  }

  .filters-buttons .filter-group {
    flex: 1 1 45%;
    display: flex;
    justify-content: center;
  }

  .filters-buttons .dropdown-toggle {
    width: 100%;
    text-align: center;
    padding: 10px;
  }

  .filters-buttons .dropdown-menu {
    width: 100%;
    left: 0;
    right: 0;
  }
}



@media (max-width: 480px) {
  .stars-grid {
    grid-template-columns: 1fr;
  }
}
</style>