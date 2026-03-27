import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/coleccion',
      name: 'coleccion',
      component: () => import('@/views/CollectionView.vue')
    },
    {
      path: '/producto/:slug',
      name: 'product-detail',
      component: () => import('@/views/ProductDetail.vue'),
      props: true
    },
    {
      path: '/finalizar-compra',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue')
    },
    {
      path: '/coleccion/:category',
      name: 'category-view',
      component: () => import('@/views/CollectionView.vue'),
      props: true
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: () => import('@/views/ContactView.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/ProfileView.vue')
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router