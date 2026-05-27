import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition && to.name === 'coleccion') {
      return savedPosition; // Solo el catálogo recupera el punto exacto
    }
    return { top: 0, behavior: 'instant' }; // El resto del sitio inicia arriba de golpe, sin animaciones erráticas
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Cushion | Alta Joyería' }
    },
    {
      path: '/revista',
      name: 'Revista',
      component: () => import('@/views/Catalog.vue'),
      meta: { title: 'Lookbook Editorial | Cushion' }
    },
    {
      path: '/coleccion/:category?',
      name: 'coleccion',
      component: () => import('@/views/CollectionView.vue'),
      props: true,
      meta: { title: 'Colección Exclusiva | Cushion' }
    },
    {
      path: '/producto/:slug',
      name: 'product-detail',
      component: () => import('@/views/ProductDetail.vue'),
      props: true,
      meta: { title: 'Joya Exclusiva | Cushion' }
    },
    {
      path: '/finalizar-compra',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue')
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
      path: '/buscar',
      name: 'search',
      component: () => import('@/views/SearchView.vue')
    },
    {
      path: '/garantias',
      name: 'garantias',
      component: () => import('@/views/GarantiasView.vue')
    },
    {
      path: '/envios',
      name: 'envios',
      component: () => import('@/views/EnviosView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/FaqView.vue')
    },
    {
      path: '/terminos',
      name: 'terminos',
      component: () => import('@/views/TerminosView.vue')
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPassword.vue')
    },
    {
      path: '/esmeraldas',
      name: 'esmeraldas',
      component: () => import('@/views/EsmeraldasView.vue'),
      meta: { title: 'Esmeraldas Personalizadas | Cushion' }
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.path.startsWith('/admin') && (!authStore.isAuthenticated || !authStore.isAdmin)) return '/auth';
  if (to.path.startsWith('/perfil') && !authStore.isAuthenticated) return '/auth';
  return true;
});

export default router;