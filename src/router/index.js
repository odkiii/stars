import { createRouter, createWebHistory } from 'vue-router'
import ReviewsView from '../views/ReviewsView.vue'
import CartView from '../views/CartView.vue'
import StarCreatorView from '../views/StarCreatorView.vue'
import ReadyStarsView from '../views/ReadyStarsView.vue'
import HomeView from '@/views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import ProfileView from '@/views/ProfileView.vue' 
import ContactsView from '@/views/ContactsView.vue'



const routes = [
  { path: '/admin', name: 'admin', component: AdminPanel },
  { path: '/info', name: 'landing', component: LandingView },
  { path: '/blog', name: 'blog', component: HomeView },
  { path: '/reviews', name: 'reviews', component: ReviewsView },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/products', name: 'products', component: ReadyStarsView },
{
  path: '/product/:id',
  name: 'Product',
  component: () => import('@/views/ProductPage.vue').catch(() => import('../views/ProductPage.vue')),
  props: true
},  
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/create', name: 'create', component: () => import('@/views/StarCreatorView.vue'), meta: { keepAlive: false } },
  { path: '/contacts', name: 'contacts', component: ContactsView },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Всегда прокручивать вверх при переходе
    return { top: 0 }
  }
})

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
  
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next('/login');
  // } else {
//     next();
//   }
// });

export default router