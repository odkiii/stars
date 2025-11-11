<template>
  <div class="admin-panel">
    <h1>Управление товарами</h1>
    
     <div class="product-form">
      <h2>{{ editingProduct ? 'Редактировать товар' : 'Добавить новый товар' }}</h2>
      
      <div class="form-group">
        <label>Название:</label>
        <input v-model="currentProduct.name" required>
      </div>
      
      <div class="form-group">
        <label>Описание:</label>
        <textarea v-model="currentProduct.description"></textarea>
      </div>
      
      <div class="form-group">
        <label>Цена:</label>
        <input v-model.number="currentProduct.price" type="number" min="0" required>
      </div>
      
      <div class="form-group">
        <label>Цвет:</label>
        <select v-model="currentProduct.color" required>
          <option value="">Выберите цвет</option>
          <option v-for="color in availableColors" :key="color.en" :value="color.en">
            {{ color.ru }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Изображение:</label>
        <input 
          type="file" 
          ref="fileInput"
          @change="handleImageUpload"
          accept="image/*"
          required
        >
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          @click="editingProduct ? updateProduct() : addProduct()"
          :disabled="isProcessing"
        >
          {{ editingProduct ? 'Обновить' : 'Добавить' }}
        </button>
        <button 
          v-if="editingProduct" 
          type="button" 
          @click="cancelEdit"
        >
          Отмена
        </button>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <div class="products-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p>{{ product.price }} ₽</p>
          <p>{{ product.color }}</p>
        </div>
        <div class="product-actions">
          <button @click="editProduct(product)" class="edit-btn">Редактировать</button>
          <button @click="deleteProduct(product.id)" class="delete-btn">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      availableColors: [
        {en: 'gold', ru: 'Золотой'},
        {en: 'silver', ru: 'Серебряный'}, 
        {en: 'ruby', ru: 'Рубиновый'},
        {en: 'pearl', ru: 'Жемчужный'},
        {en: 'multicolor', ru: 'Разноцветный'}
      ],
      products: [],
      currentProduct: {
        name: '',
        description: '',
        price: 0,
        color: '',
        image: null
      },
      isProcessing: false,

      editingProduct: null
    }
  },
  async mounted() {
    await this.loadProducts();
  },
  methods: {
    async loadProducts() {
      const response = await fetch('/api/products');
      this.products = await response.json();
    },
    handleImageUpload(e) {
      this.currentProduct.image = e.target.files[0];
    },
     async addProduct() {
      try {
        this.isProcessing = true;
        this.error = null;
        
        // Валидация
        if (!this.currentProduct.name || 
            !this.currentProduct.price || 
            !this.currentProduct.color || 
            !this.currentProduct.image) {
          throw new Error('Заполните все обязательные поля');
        }
        
        const formData = new FormData();
        formData.append('name', this.currentProduct.name);
        formData.append('description', this.currentProduct.description);
        formData.append('price', this.currentProduct.price.toString());
        formData.append('color', this.currentProduct.color);
        formData.append('image', this.currentProduct.image);
        
        const response = await fetch('/api/products', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Ошибка сервера');
        }
        
        await this.loadProducts();
        // this.resetForm();
        // this.$notify({
        //   title: 'Успешно',
        //   message: 'Товар добавлен',
        //   type: 'success'
        // });
        
      } catch (err) {
        console.error('Ошибка при добавлении товара:', err);
        this.error = err.message;
        // this.$notify({
        //   title: 'Ошибка',
        //   message: err.message,
        //   type: 'error'
        // });
      } finally {
        this.isProcessing = false;
      }
    },
    editProduct(product) {
      this.editingProduct = product.id;
      this.currentProduct = { ...product };
      this.$refs.fileInput.value = '';
    },
     async updateProduct() {
      const formData = new FormData();
      formData.append('name', this.currentProduct.name);
      formData.append('description', this.currentProduct.description);
      formData.append('price', this.currentProduct.price);
      formData.append('color', this.currentProduct.color);

      if (this.currentProduct.image instanceof File) {
        formData.append('image', this.currentProduct.image);
      }

      try {
        const response = await fetch(`/api/products/${this.editingProduct}`, {
          method: 'PUT',
          body: formData
        });

        if (!response.ok) throw new Error('Ошибка обновления');
        
        await this.loadProducts();
        this.resetForm();
      } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
        alert('Не удалось обновить товар');
      }
    },
  async deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Ошибка удаления');
      
      await this.loadProducts();
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      alert('Не удалось удалить товар');
    }
  },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.currentProduct = {
        name: '',
        price: 0,
        color: '',
        image: ''
      };
      this.editingProduct = null;
      this.$refs.fileInput.value = '';
      this.error = null;
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.error-message {
  margin-top: 15px;
  color: #f44336;
  font-size: 0.9rem;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.admin-panel h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2rem;
  font-weight: 600;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}

.product-form {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.color-select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-form h2 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.product-form input {
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.product-form input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.product-form input[type="file"] {
  padding: 10px;
  border: 1px dashed #aaa;
  background-color: #fafafa;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-grow: 1;
  font-weight: 500;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-grow: 1;
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.product-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.product-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.product-info {
  padding: 15px;
  flex-grow: 1;
}

.product-info h3 {
  color: #2c3e50;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.product-info p {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.3rem;
  margin: 0;
}

.product-actions {
  display: flex;
  gap: 10px;
  padding: 0 15px 15px;
}

.edit-btn {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-grow: 1;
}

.edit-btn:hover {
  background-color: #e67e22;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-grow: 1;
}

.delete-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 20px 15px;
  }
  
  .products-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .products-list {
    grid-template-columns: 1fr;
  }
  
  .product-form {
    padding: 20px 15px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>