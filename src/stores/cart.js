import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // Здесь будут храниться товары в корзине
  }),
  
  actions: {
    addCustomStar(item) {
      // Проверяем, нет ли уже точно такой же звезды в корзине
      const existingIndex = this.items.findIndex(i => 
        i.configuration.color === item.configuration.color &&
        i.configuration.texture === item.configuration.texture &&
        JSON.stringify(i.configuration.accessories) === JSON.stringify(item.configuration.accessories)
      );
      
      if (existingIndex > -1) {
        // Если звезда с такой конфигурацией уже есть - увеличиваем количество
        this.items[existingIndex].quantity += 1;
      } else {
        // Если нет - добавляем новую запись
        this.items.push({
          ...item,
          quantity: 1
        });
      }
    },
    
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
    },
    
    updateQuantity(itemId, newQuantity) {
      const item = this.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = Math.max(1, newQuantity);
      }
    }
  },
  
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },
  
  persist: true // Включаем сохранение состояния между перезагрузками страницы
});