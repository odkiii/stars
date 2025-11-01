import './assets/main.css'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Notifications from '@kyvg/vue3-notification'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); 

const app = createApp(App)
app.use(router)
app.use(Notifications)
app.mount('#app')
