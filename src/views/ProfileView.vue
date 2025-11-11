<template>
  <div class="profile-container">
    <notifications position="top right" />
    <div v-if="!user" class="auth-form">
      <div class="tabs">
        <button :class="{ active: isLogin }" @click="isLogin = true">Вход</button>
        <button :class="{ active: !isLogin }" @click="isLogin = false">Регистрация</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Почта</label>
          <input type="email" v-model="form.email" required />
        </div>

        <div class="form-group">
          <label>Пароль</label>
          <input type="password" v-model="form.password" required />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>


        <button type="submit" class="btn primary">
          {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </form>
    </div>

    <!-- Основной контент профиля -->
    <div v-if="user" class="user-info">
      <h1>Мой профиль</h1>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Дата регистрации:</strong> {{ formatDate(user.created_at) }}</p>
    </div>

    <div v-if="user">
      <div v-if="orders.length" class="orders-section">
        <h2>Мои заказы</h2>
        <div class="order-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <p>Заказ #{{ order.id }}</p>
            <p>Дата: {{ formatDate(order.order_date) }}</p>
            <p>Сумма: {{ order.total_price }} ₽</p>
          </div>
        </div>
      </div>

      <div v-else class="no-orders">
        <p>У вас пока нет заказов</p>
        <router-link to="/products" class="btn primary">Перейти к покупкам</router-link>
      </div>
    </div>
    


    <div v-if="user && favorites.length" class="favorites-section">
      <h2>Избранные товары</h2>
      <div class="favorites-grid">
        <div 
          v-for="item in favorites" 
          :key="item.id" 
          class="favorite-item"
          @click="$router.push(`/product/${item.id}`)"
        >
          <img :src="item.image" :alt="item.name" class="favorite-image">
          <div class="favorite-info">
            <h3>{{ item.name }}</h3>
            <p>{{ formatPrice(item.price) }}</p>
          </div>
          <button 
            class="remove-favorite"
            @click.stop="removeFavorite(item.id)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="user" class="no-favorites">
      <p>У вас пока нет избранных товаров</p>
    </div>

    <!-- Кнопка выхода -->
    <div v-if="user" class="logout-section">
      <button @click="logout" class="btn danger">Выйти из аккаунта</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      user: null,
      orders: [],
      loading: false,
      error: null,
      successMessage: null,


      // Авторизация
      isLogin: true,
      form: {
        email: '',
        password: ''
      }
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    console.log('Токен:', token && token !== 'undefined' ? 'есть' : 'отсутствует');
    if (!token || token === 'undefined') {
      return;
    }

    try {
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('userResponse.status:', userResponse.status);
      this.user = await userResponse.json();
      console.log('После регистрации user:', this.user);

      console.log('Получен пользователь:', this.user);

      const ordersResponse = await fetch(`/api/orders/user/${this.user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('ordersResponse.status:', ordersResponse.status);
      if (ordersResponse.ok) {
        this.orders = await ordersResponse.json();
        console.log('Полученные заказы:', this.orders);
      }

    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      alert('Не удалось загрузить данные профиля');
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },
    logout() {
      // Показываем подтверждение с предупреждением
      const confirmLogout = confirm(
        'При выходе из аккаунта ваша корзина и избранные товары будут очищены. Продолжить?'
      );
      
      if (!confirmLogout) return;

      // Очищаем все пользовательские данные
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');
      
      // Сбрасываем состояние компонента
      this.user = null;
      this.orders = [];
      this.favorites = [];
      
      this.$router.push('/profile');
      window.dispatchEvent(new CustomEvent('auth-changed'));
      
      // Уведомление о успешном выходе
      this.$notify({
        title: 'Выход выполнен',
        text: 'Вы вышли из аккаунта. Корзина и избранные товары очищены.',
        type: 'success'
      });
    },
    async handleSubmit() {
      const url = this.isLogin 
        ? '/api/auth/login'
        : '/api/auth/register';

      try {
        this.error = null;
        this.successMessage = null;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Ошибка авторизации');
        }

        // ✅ Сохраняем токен
        localStorage.setItem('token', data.token);

        // ✅ Если была регистрация — показываем сообщение
        if (!this.isLogin) {
          this.successMessage = 'Регистрация прошла успешно!';
        }

        // ✅ Получаем пользователя и сразу сохраняем в this.user
        const me = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        if (!me.ok) throw new Error('Не удалось получить данные пользователя');

        this.user = await me.json();  // ⬅️ ЭТО главный переключатель

        // ✅ Загружаем заказы
        const ordersRes = await fetch(`/api/orders/user/${this.user.id}`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        if (ordersRes.ok) {
          this.orders = await ordersRes.json();
        }

        // 💡 Очищаем поля формы
        this.form.email = '';
        this.form.password = '';
      } catch (err) {
        this.error = err.message;
      }
    },

    removeFavorite(id) {
      this.favorites = this.favorites.filter(item => item.id !== id);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }
  }
};
</script>
<style scoped>

.success-message {
  color: #28a745;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.profile-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: "Inter", sans-serif;
  color: #0E2A1F;
}

/* --- Авторизация --- */
.auth-form {
  max-width: 420px;
  margin: 4rem auto;
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.tabs {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
}

.tabs button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
  border-radius: 12px 12px 0 0;
}

.tabs button.active {
  color: #2F553D;
  border-bottom: 3px solid #2F553D;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #0E2A1F;
}

.form-group input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #2F553D;
  outline: none;
}

.error-message {
  color: #d9534f;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.success-message {
  color: #28a745;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* --- Кнопки --- */
.btn {
  padding: 0.7rem 1.6rem;
  font-size: clamp(14px, 2.2vw, 16px);
  border: 2px solid #2F553D;
  background: white;
  color: #2F553D;
  border-radius: 25px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  text-align: center;
}

.btn.primary {
  background: #2F553D;
  color: white;
}

.btn.primary:hover {
  background: #1e3b2a;
  border-color: #1e3b2a;
}

.btn.danger {
  border-color: #d9534f;
  color: #d9534f;
  background: white;
}

.btn.danger:hover {
  background: #d9534f;
  color: white;
}

/* --- Профиль --- */
.user-info {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
}

.user-info h1 {
  margin-bottom: 1rem;
  color: #2F553D;
}

.orders-section {
  margin: 2rem 0;
}

.order-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  background: #fff;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateY(-3px);
}

.no-orders {
  text-align: center;
  padding: 2rem;
  color: #666;
  border-radius: 16px;
}

/* --- Избранное --- */
.favorites-section {
  margin: 2rem 0;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
  margin-top: 1rem;
}

.favorite-item {
  position: relative;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.favorite-item:hover {
  transform: translateY(-5px);
}

.favorite-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.favorite-info {
  padding: 1rem;
}

.favorite-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
  font-weight: 600;
  color: #0E2A1F;
}

.favorite-info p {
  margin: 0;
  font-weight: bold;
  color: #2F553D;
  font-size: 0.95rem;
}

.remove-favorite {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #2F553D;
  font-size: 14px;
  transition: background 0.3s;
}

.remove-favorite:hover {
  background: #f5f5f5;
}

.no-favorites {
  text-align: center;
  margin: 2rem 0;
  color: #777;
  border-radius: 12px;
}

/* --- Logout --- */
.logout-section {
  margin-top: 2rem;
  text-align: center;
}
</style>
