<template>
  <div class="cart">
    <notifications position="top right" />

    <h1 class="header-title">КОРЗИНА</h1>

    <!-- Сообщение о пустой корзине -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <h2>Ваша корзина пуста</h2>
      <p>Добавьте товары, чтобы продолжить покупки</p>
      <router-link to="/products" class="btn-choice">Перейти к товарам</router-link>
    </div>

    <div v-else>
      <h2 class="header-title" style="color:darkgray; font-size: medium;">Прошу обратить внимание! Все звезды уникальны, каждая делается художником вручную. Точное повторение звезды невозможно.</h2>
    
    <div class="recovery-box">
      <div class="recovery-input-wrapper">
        <input 
          v-model="starIdInput"
          placeholder="Введите ID звезды"
          class="recovery-input"
        >
        <button class="info-btn" @click="showInfoModal = true" title="Как работает ID?">
          <span class="info-icon">i</span>
        </button>
      </div>
      <button @click="loadStar" class="recovery-button">
        Загрузить звезду
      </button>
    </div>
    <CartList 
      :items="cartItems" 
      @remove-item="removeFromCart"
      @update-quantity="updateQuantity"
    />
    <div class="total">
      <h3>Итого: {{ totalPrice }} руб.</h3>
      <button class="btn-choice" @click="showCheckoutModal = true">Оформить заказ</button>
    </div>

    <div v-if="showCheckoutModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Оформление заказа</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          
           <form @submit.prevent="processOrder" class="order-form">
            <!-- Основные поля -->
            <div class="form-group">
              <label class="form-label">Ваше имя</label>
              <input 
                v-model="orderData.firstName" 
                type="text" 
                class="form-input"
                placeholder="Например: Иван Иванов"
                required
              >
            </div>
              
            <div class="form-group">
              <label class="form-label">Контактный телефон</label>
              <input 
                v-model="orderData.phone" 
                type="tel" 
                class="form-input"
                placeholder="Например: +7 (900) 123-45-67"
                pattern="[+]{0,1}[0-9\s\-]+" 
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">Укажите предпочтительный способ доставки (почта, сдек, яндекс, курьер), регион доставки, комментарий</label>
              <input 
                v-model="orderData.comment" 
                type="text" 
                class="form-input"
                placeholder="Например: Почта РФ, Московская область или Курьер в Москве, внутри МКАД"
                required
              >
            </div>

            <!-- Кнопки -->
            <div class="form-actions">
              <button type="submit" class="btn whatsapp-btn">
                <span class="whatsapp-icon">📱</span>
                Отправить заказ
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- Модальное окно информации об ID -->
      <div v-if="showInfoModal" class="modal-overlay" @click.self="showInfoModal = false">
        <div class="modal-content info-modal">
          <div class="modal-header">
            <h2>Как работает ID звезды?</h2>
            <button class="close-btn" @click="showInfoModal = false">&times;</button>
          </div>
          
          <div class="info-content">
            <div class="info-section">
              <h3>💾 Сохранение вашей звезды</h3>
              <p>Корзина хранится только на этом устройстве. Если вы создали звезду на другом устройстве или хотите сохранить её надолго — используйте ID!</p>
            </div>

            <div class="info-section">
              <h3>🔍 Расшифровка ID</h3>
              <div class="id-example">
                <div class="id-part">
                  <span class="id-letter">C</span>
                  <span class="id-meaning">Цвет (1-4)</span>
                </div>
                <div class="id-part">
                  <span class="id-letter">S</span>
                  <span class="id-meaning">Размер (1-3)</span>
                </div>
                <div class="id-part">
                  <span class="id-letter">T</span>
                  <span class="id-meaning">Текстура (1-4)</span>
                </div>
                <div class="id-part">
                  <span class="id-letter">A</span>
                  <span class="id-meaning">Аксессуар (1-4)</span>
                </div>
              </div>
              <p class="example-text">Пример: <strong>C1S2T1A1</strong> — золотая звезда среднего размера</p>
            </div>

            <div class="info-section">
              <h3>💡 Как использовать</h3>
              <p>Сохраните ID вашей звезды в заметках или перешлите себе в сообщениях. В любой момент вы сможете загрузить её обратно!</p>
            </div>
          </div>

          <div class="info-actions">
            <button class="btn btn-primary" @click="showInfoModal = false">
              Понятно!
            </button>
          </div>
        </div>
      </div>


    </div>
    
  </div>
</template>

<script>
import CartList from '@/components/CartList.vue'

export default {
components: { CartList },
data() {
  return {
    cartItems: [],
    showCheckoutModal: false,
    showAuthModal: false,
    showInfoModal: false,
    starIdInput: '',
    // Данные формы
    authData: {
      email: '',
      password: '',
      firstName: '', 
      phone: ''     
    },

    // Ошибки
    authError: '',
    orderData: {
      firstName: '',
      phone: '',
      comment: '',
      paymentMethod: '',
      communicationMethod: ''
    }
  }
},
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    totalQuantity() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  },
  created() {
    this.loadCart()
    window.addEventListener('cart-updated', this.loadCart)
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.loadCart)
  },
  methods: {
    openInfoModal() {
      this.showInfoModal = true;
    },
    
    closeInfoModal() {
      this.showInfoModal = false;
    },
  // Основной метод обработки заказа
    async processOrder() {
      if (this.isLoading) return;
      
      // Валидация формы
      if (!this.orderData.firstName?.trim() || !this.orderData.phone?.trim()) {
        this.$notify({
          title: 'Ошибка',
          text: 'Пожалуйста, заполните имя и телефон',
          type: 'warn'
        });
        return;
      }

      this.isLoading = true;

      try {
        // 1. Отправляем заказ на почту владельцу
        await this.sendOrderToOwner();
        this.saveOrderToStorage();

        // this.openWhatsApp();
        
        // 3. Очищаем корзину и закрываем модальное окно
        this.clearCart();
        this.closeModal();
        
        this.$notify({
              title: 'Заказ отправлен',
              text: 'Мы свяжемся с вами в течение 2 часов!',
              type: 'success'
            });       

      } catch (error) {
        console.error('Ошибка оформления заказа:', error);
      this.$notify({
            title: 'Ошибка',
            text: 'Произошла ошибка при отправке заказа. Попробуйте позже или свяжитесь напрямую.',
            type: 'error'
          });
        } finally {
        this.isLoading = false;
      }
    },

    // Отправка заказа на почту владельцу
    async sendOrderToOwner() {
      const formatTime = () => {
        return new Date().toLocaleString('ru-RU', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      const orderData = {
        // to: 'ivan.balyvredin@gmail.com',
        to: 'nadyaonline@gmail.com',  
        subject: `Новый заказ от ${this.orderData.firstName}`,
        order: {
          customer: {
            name: this.orderData.firstName,
            phone: this.orderData.phone,
            comment: this.orderData.comment
          },
          items: this.cartItems,
          total: this.totalPrice,
          quantity: this.totalQuantity,
          timestamp: formatTime()
        }
      };

      try {
        const response = await fetch('/api/send-order-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Заказ успешно отправлен на почту владельца');
        return await response.json();
      } catch (error) {
        console.error('Не удалось отправить заказ на почту:', error);
        throw error; // Пробрасываем ошибку для обработки в processOrder
      }
    },

    // Сохраняем заказ в localStorage (временное решение вместо email)
    saveOrderToStorage() {
      const order = {
        id: Date.now(),
        customer: {
          name: this.orderData.firstName,
          phone: this.orderData.phone
        },
        items: this.cartItems,
        total: this.totalPrice,
        quantity: this.totalQuantity,
        timestamp: new Date().toLocaleString('ru-RU')
      };

      // Сохраняем заказы в localStorage
      const orders = JSON.parse(localStorage.getItem('website_orders') || '[]');
      orders.push(order);
      localStorage.setItem('website_orders', JSON.stringify(orders));
      
      console.log('📦 Новый заказ сохранен:', order);
      console.log('📧 Для просмотра заказов откройте консоль браузера и выполните:');
      console.log('localStorage.getItem("website_orders")');
    },

    // Простое открытие WhatsApp без форматированного сообщения
    // openWhatsApp() {
    //   const ownerPhone = '79258476457';
    //   const whatsappUrl = `https://wa.me/${ownerPhone}`;
      
    //   window.open(whatsappUrl, '_blank');
    // },

    restoreOrderData() {
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (pendingOrder) {
        try {
          const { orderData, cartItems } = JSON.parse(pendingOrder);
          this.orderData = { ...this.orderData, ...orderData };
          localStorage.removeItem('pendingOrder');
        } catch (error) {
          console.error('Ошибка восстановления данных заказа:', error);
        }
      }
    },
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      this.cartItems = savedCart ? JSON.parse(savedCart) : [];
      this.restoreOrderData();
    },

    removeFromCart(productId) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      const newCart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      this.loadCart();
      window.dispatchEvent(new CustomEvent('cart-updated'));
    },

    updateQuantity({ id, quantity }) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity = Number(quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart();
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    },
    toggleAuthMode() {
      this.isLoginMode = !this.isLoginMode;
    },
    async placeOrder() {
      const token = localStorage.getItem('token');
      if (!token) {
        // this.showAuthModal = true;
        this.saveOrderData();
        this.$router.push('/profile');
        return;
      }
       try {
        // Формируем правильную структуру данных для заказа
        const orderPayload = {
          ...this.orderData,
          quantity: this.totalQuantity, // Добавляем общее количество
          total: this.totalPrice, // Добавляем общую сумму
          items: this.cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            configuration: item.configuration
          }))
        };

        console.log('Отправляемые данные заказа:', orderPayload);

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        }); 

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка сервера' }));
          throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }

        const result = await response.json();

        this.$notify({
          title: 'Заказ успешно оформлен',
          text: 'Ваш заказ принят! Мы скоро с вами свяжемся.',
          type: 'success'
        });

        this.clearCart();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        alert(`Не удалось оформить заказ: ${error.message}`);
      }
    },
    async login() {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.authData.email,
            password: this.authData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          this.authError = data.error || 'Ошибка входа';
          return;
        }

        localStorage.setItem('token', data.token);
        this.showAuthModal = false;
        this.placeOrder(); // продолжаем оформление заказа
      } catch (error) {
        this.authError = 'Не удалось подключиться к серверу';
        console.error('Ошибка входа:', error);
      }
    },

    async register() {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.authData.email,
            password: this.authData.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Ошибка сети' }));
          console.error('Ошибка регистрации:', errorData);
          throw new Error(errorData.error || 'Не удалось зарегистрироваться');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        this.showAuthModal = false;
        this.placeOrder();
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        this.authError = error.message;
      }
    },
    handleConfirmOrder() {
      const token = localStorage.getItem('token');
      if (token) {
        this.placeOrder();
      } else {
        this.saveOrderData();
        this.$router.push('/profile');
        this.closeModal();
      }
    },
    async loadStar() {
      try {
        if (!/^C\d+S\d+T\d+A\d+$/.test(this.starIdInput)) {
          throw new Error('Неверный формат ID звезды');
        }
        
        const response = await fetch(`/api/stars/${this.starIdInput}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const starData = await response.json();
        
        // Добавление в корзину
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({
          id: starData.id,
          name: `Кастомная звезда (${this.getColorName(starData.color_hex)})`,
          price: starData.price,
          size: starData.size,
          configuration: {
            color: starData.color_hex,
            size: starData.size,
            texture: starData.texture_id,
            accessory: starData.accessory_id
          },
          quantity: 1
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart();
        this.$notify({
          title: 'Звезда добавлена в корзину!',
          type: 'success'
        });
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert(`Ошибка: ${error.message}`);
      }
    },
    
    getColorName(hex) {
      const colors = {
        '#FFD700': 'Золотая',
        '#C0C0C0': 'Серебряная',
        '#FF6347': 'Рубиновая',
        '#FDF5E6': 'Жемчужная'
      };
      return colors[hex] || 'Особая';
    },
    async submitOrder() {
      try {
        const orderPayload = {
          ...this.orderData,
          items: this.cartItems
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        })

        if (response.ok) {
          localStorage.removeItem('cart')
          this.cartItems = []
          this.closeModal()
          window.dispatchEvent(new CustomEvent('cart-updated'))
          this.$notify({
            title: 'Заказ успешно оформлен',
            text: 'Ваш заказ принят! Мы скоро с вами свяжемся.',
            type: 'success'
          });
          
        }
      } catch (error) {
        console.error('Ошибка оформления заказа:', error)
      }
    },
    saveOrderData() {
      localStorage.setItem('pendingOrder', JSON.stringify({
        orderData: this.orderData,
        cartItems: this.cartItems
      }));
    },
    
    

    clearCart() {
      this.cartItems = [];
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    closeModal() {
      this.showCheckoutModal = false
    },
    
    async checkout() {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: this.cartItems }) 
        })
        if (response.ok) {
          localStorage.removeItem('cart')
          this.cartItems = []
          window.dispatchEvent(new CustomEvent('cart-updated'))
          this.$notify({
            title: 'Заказ успешно оформлен',
            text: 'Ваш заказ принят! Мы скоро с вами свяжемся.',
            type: 'success'
          });

        }
      } catch (error) {
        console.error('Ошибка оформления заказа:', error)
      }
    }
  }
}
</script>
  
<style scoped>
.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-cart h2 {
  margin-bottom: 1rem;
  color: #888;
}

.empty-cart p {
  margin-bottom: 2rem;
  color: #999;
}

.btn-choice {
  padding: 0.7rem 1.6rem;
  font-size: clamp(14px, 2.2vw, 16px);
  border: 2px solid #2F553D;
  background: white;
  color: #2F553D;
  border-radius: 25px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-choice:hover {
  background: #2F553D;
  color: white;
}

.cart {
  max-width: 1100px;
  margin: 2rem auto 3rem;
  padding: 0 1rem;
  color: #0E2A1F;
}

h1.header-title {
  color: #c4c4c4; /* Меняем #C4C4C4 на #2F553D */
  margin-top: 80px;
  margin-bottom: 20px;
  font-size: 3vw;
  text-align: center;
  justify-content: center;
}

h2.header-title {
  max-width: 820px;
  margin: 0 auto 1.25rem;
  font-size: 0.98rem !important; /* переопределяем inline "medium" */
  color: #42514B !important;      /* мягкий графит вместо чистого серого */
  opacity: 0.85;
}

/* ===== ВОССТАНОВЛЕНИЕ ЗВЕЗДЫ ПО ID ===== */
.recovery-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: min(360px, 90%);
}
.recovery-box {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 22px auto 28px;
  flex-wrap: wrap;
}
.recovery-input {
  width: min(360px, 90%);
  padding: 12px 14px;
  border-radius: 25px;
  border: 1.5px solid #CED7D3;
  background: #fff;
  font-size: 0.98rem;
  transition: border-color .25s, box-shadow .25s;
}

.recovery-input:focus {
  border-color: #2F553D;
  outline: none;
}

.recovery-button {
  padding: 0.7rem 1.6rem;
  font-size: clamp(14px, 2.2vw, 16px);
  border: 2px solid #2F553D;
  background: white;
  color: #2F553D;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.recovery-button:hover {
  background: #2F553D;
  color: white;
}


.info-btn {
  position: absolute;
  right: 10px;
  background: #2F553D;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.info-btn:hover {
  background: #234237;
  transform: scale(1.1);
}

.info-icon {
  font-style: italic;
  font-family: serif;
}

/* Стили для модального окна информации */
.info-modal {
  max-width: 500px;
}

.info-content {
  padding: 10px 0;
}

.info-section {
  margin-bottom: 25px;
}

.info-section h3 {
  color: #2F553D;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.info-section p {
  color: #555;
  line-height: 1.5;
  margin-bottom: 10px;
}

/* Блок с примером ID */
.id-example {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  flex-wrap: wrap;
  gap: 10px;
}

.id-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 80px;
}

.id-letter {
  background: #2F553D;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.id-meaning {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.3;
}

.example-text {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #2F553D;
  margin-top: 15px;
}

.info-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* ===== ИТОГО И КНОПКА ОФОРМЛЕНИЯ ===== */
.total {
  margin-top: 28px;
  padding: 18px 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 22px rgba(0,0,0,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.total h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0E2A1F;
  font-weight: 800;
}

.total .btn-choice {
    padding: 0.7rem 1.6rem;
  font-size: clamp(14px, 2.2vw, 16px);
  border: 2px solid #2F553D;
  background: white;
  color: #2F553D;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  width: auto;
  display: inline-block;
  min-width: 180px;
}

.total .btn-choice:hover {
  background: #2F553D;
  color: white;
  transform: translateY(-1px);
}

.form-actions .btn.primary,
.form-actions .btn.secondary {
  padding: 12px 24px; /* Немного увеличиваем padding */
  font-size: 1rem;
  border: 2px solid #2F553D;
  background: white;
  color: #2F553D;
  border-radius: 25px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
}

.form-actions .btn.primary:hover,
.form-actions .btn.secondary:hover {
  background: #2F553D;
  color: white;
}

.form-actions .btn.primary {
  background: #2F553D;
  color: white;
}

.form-actions .btn.primary:hover {
  background: white;
  color: #2F553D;
}

.form-actions .btn.secondary:hover {
  background: #2F553D;
  color: white;
}

/* ===== МОДАЛКА ОФОРМЛЕНИЯ ===== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(11, 19, 16, 0.6);
  backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  animation: fadeIn .25s ease-out;
}
.modal-content {
  background: #ffffff;
  border-radius: 20px;
  width: min(560px, 92vw);
  padding: 22px 22px 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.18);
  position: relative;
  animation: slideUp .24s ease-out;
  border: 1px solid rgba(14, 42, 31, 0.08);
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}



.modal-header h2 {
  margin: 0; 
  font-size: 1.35rem; 
  color: #2F553D; /* Меняем #6b0630 на #2F553D */
  font-weight: 800;
}

.close-btn {
  align-content: end;
  appearance: none;
  background: transparent; border: none; cursor: pointer;
  font-size: 28px; line-height: 1; color: #7a8a84;
  border-radius: 10px; padding: 2px 6px;
  transition: background .2s, color .2s, transform .1s;
}
.close-btn:hover { color: #0E2A1F; background: rgba(14,42,31,.06); }
.close-btn:active { transform: scale(.96); }

/* ===== ФОРМА ЗАКАЗА ===== */
.order-form { 
  display: grid; 
  gap: 20px; /* Увеличиваем отступ между группами */
  margin-top: 6px; 
}

.form-group { 
  display: grid; 
  gap: 12px; /* Увеличиваем отступ между лейблом и инпутом */
}

.form-label {
  font-weight: 700; 
  font-size: .95rem; 
  color: #234237;
  margin-bottom: 4px; /* Добавляем отступ снизу */
}

.form-input {
  width: 100%;
  padding: 14px 16px; /* Увеличиваем padding для лучшего визуального восприятия */
  border: 1.5px solid #D9E1DD;
  border-radius: 12px;
  background: #fff;
  transition: border-color .25s, box-shadow .25s;
  font-size: 1rem; /* Чуть увеличиваем размер шрифта */
  box-sizing: border-box; /* Важно для правильного расчета ширины */
}

.form-input:focus {
  border-color: #2F553D; /* Меняем на темно-зеленый вместо бордового */
  outline: none;
  box-shadow: 0 0 0 4px rgba(47, 85, 61, 0.12); /* Соответственно меняем цвет тени */
}

/* ===== ВАРИАНТЫ ОПЛАТЫ/СВЯЗИ ===== */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.option-card {
  position: relative;
  border: 2px solid #E8EEEB;
  border-radius: 14px;
  padding: 14px 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color .25s, box-shadow .25s, background .25s, transform .15s;
  user-select: none;
}
.option-card:hover {
  border-color: #0E2A1F;
  box-shadow: 0 6px 18px rgba(14, 42, 31, 0.12);
  transform: translateY(-1px);
}
.option-card.active {
  border-color: #194d38;
  background: #fbfffd; /* лёгкий оттенок бордового */
  box-shadow: 0 10px 22px rgba(6, 107, 65, 0.15);
}
.option-card input[type="radio"] { position: absolute; opacity: 0; pointer-events: none; }
.option-content { display: grid; justify-items: center; gap: 10px; }
.payment-icon, .social-icon {
  width: 64px; height: 64px;
  display: grid; place-items: center;
  border-radius: 14px;
  background: #F4F7F6;
  border: 1px solid #E6ECE9;
}
.payment-icon img, .social-icon img { width: 34px; height: 34px; object-fit: contain; }
.social-icon.whatsapp { background: #E6F6EA; }
.social-icon.telegram { background: #E8F2FA; }

.form-actions {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 6px;
  flex-wrap: wrap;
}
.btn {
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .25s ease, opacity .2s, background .25s;
}
.btn.primary {
  background: linear-gradient(135deg, #6b0630, #0E2A1F);
  color: #fff;
  box-shadow: 0 10px 22px rgba(14, 42, 31, 0.22);
}
.btn.primary:hover { transform: translateY(-1px); }
.btn.primary:active { transform: translateY(0); opacity: .92; }
.btn.secondary {
  background: #F2F5F4;
  color: #234237;
  box-shadow: inset 0 0 0 1px #DDE5E1;
}
.btn.secondary:hover { background: #E9EFEC; }
.btn-link {
  background: none;
  border: none;
  color: #6b0630;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

/* ===== МОДАЛКА АВТОРИЗАЦИИ ВНУТРИ ОФОРМЛЕНИЯ ===== */
.auth-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(11, 19, 16, 0.6);
  display: grid; place-items: center;
  z-index: 10000;
  animation: fadeIn .25s ease-out;
}

.auth-modal-content {
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 18px;
  padding: 24px 24px 26px; /* Увеличиваем padding */
  box-shadow: 0 18px 36px rgba(0,0,0,0.18);
  animation: slideUp .24s ease-out;
  border: 1px solid rgba(14, 42, 31, 0.08);
}

.auth-modal-content h3 {
  margin: 0 0 12px; /* Увеличиваем отступ снизу */
  font-size: 1.15rem;
  color: #2F553D; /* Меняем на темно-зеленый */
  font-weight: 800;
}

.auth-modal-content p {
  margin: 0 0 20px; /* Увеличиваем отступ снизу */
  font-size: 0.92rem;
  color: #51665D;
}

.auth-modal-content input {
  width: 100%;
  padding: 14px 16px; /* Увеличиваем padding как в основной форме */
  margin-bottom: 16px; /* Увеличиваем отступ между инпутами */
  border: 1.5px solid #D9E1DD;
  border-radius: 12px;
  transition: border-color .25s, box-shadow .25s;
  font-size: 1rem;
  box-sizing: border-box;
}

.auth-modal-content input:focus {
  border-color: #2F553D; /* Меняем на темно-зеленый */
  outline: none;
  box-shadow: 0 0 0 4px rgba(47, 85, 61, 0.12);
}

.auth-error { color: #c03838; font-size: .9rem; margin-bottom: 10px; }

/* ===== СТИЛИ ДЛЯ CartList.vue (если используются эти классы) ===== */
.cart-list {
  margin-top: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 6px 22px rgba(0,0,0,0.06);
}
.cart-item {
  display: flex; align-items: center; justify-content: space-between;
  gap: 14px; padding: 14px 0;
  border-bottom: 1px solid #ECF1EF;
}

.cart-item img{
  width: 80px;
  height: 80px;
}

.cart-item:last-child { border-bottom: none; }
.cart-item .item-info h4 {
  margin: 0; color: #0E2A1F; font-size: 1rem; font-weight: 800;
}
.cart-item .item-info p { margin: 4px 0 0; color: #6b0630; font-weight: 700; }
.cart-item .item-controls { display: flex; align-items: center; gap: 10px; }
.quantity-control { display: inline-flex; align-items: center; gap: 10px; }
.quantity-control input {
  width: 48px; text-align: center; padding: 8px 6px;
  border: 1.5px solid #D9E1DD; border-radius: 10px;
}
.quantity-control button {
  background: #F2F5F4; border: none; padding: 8px 10px;
  border-radius: 10px; font-weight: 800; cursor: pointer;
}
.quantity-control button:hover { background: #E9EFEC; }
.remove-button {
  color: #c03838; background: #FFE9E9;
  border: none; padding: 8px 10px; border-radius: 10px; cursor: pointer;
}
.remove-button:hover { background: #FFD9D9; }

/* ===== АНИМАЦИИ ===== */
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { transform: translateY(18px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

/* ===== АДАПТИВ ===== */
@media (max-width: 640px) {
  .recovery-input-wrapper {
    width: 100%;
  }
  
  .id-example {
    justify-content: center;
  }
  
  .id-part {
    min-width: 70px;
  }
  .total { padding: 16px; }
  .form-actions { justify-content: stretch; }
  .form-actions .btn { flex: 1 1 auto; }
}
@media (max-width: 480px) {
  .info-modal {
    margin: 20px;
  }
  
  .id-part {
    min-width: 60px;
  }
  
  .id-letter {
    width: 25px;
    height: 25px;
    font-size: 0.9rem;
  }
  
  .id-meaning {
    font-size: 0.8rem;
  }
}
</style>
