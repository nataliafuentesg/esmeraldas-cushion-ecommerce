import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Forzamos un comportamiento de scroll nativo suave para evitar saltos bruscos en móviles
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Cushion | Alta Joyería y Esmeraldas Colombianas',
        description: 'Descubre Cushion. Colección exclusiva de alta joyería, anillos de compromiso y las más finas esmeraldas colombianas extraídas éticamente. Envíos internacionales.'
      }
    },
    {
      path: '/revista',
      name: 'Revista',
      component: () => import('@/views/Catalog.vue'),
      meta: { title: 'Lookbook Editorial | Cushion Joyería' }
    },
    {
      path: '/coleccion',
      name: 'coleccion',
      component: () => import('@/views/CollectionView.vue'),
      meta: {
        title: 'Colección Exclusiva | Cushion Joyería',
        description: 'Explora nuestra colección de alta joyería. Anillos, collares, pulseras y aretes elaborados por maestros artesanos en oro de 18k y platino.'
      }
    },
    {
      path: '/coleccion/:category',
      name: 'category-view',
      component: () => import('@/views/CollectionView.vue'),
      props: true,
      meta: {
        title: 'Colección por Categoría | Cushion Joyería',
        description: 'Encuentra tu pieza ideal. Navega por nuestras categorías de esmeraldas puras, anillos, aretes y collares de lujo.'
      }
    },
    {
      path: '/producto/:slug',
      name: 'product-detail',
      component: () => import('@/views/ProductDetail.vue'),
      props: true,
      meta: {
        title: 'Joya Exclusiva | Cushion',
        description: 'Detalles de nuestra pieza de alta joyería. Artesanía colombiana, gemas certificadas y diseño atemporal.'
      }
    },
    {
      path: '/finalizar-compra',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
      meta: {
        title: 'Finalizar Compra | Cushion',
        description: 'Completa tu pedido de alta joyería de forma segura. Ofrecemos envíos nacionales e internacionales con seguro total.'
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: {
        title: 'Mi Cuenta | Cushion',
        description: 'Inicia sesión o regístrate en Cushion para acceder a tus pedidos, guardar tu lista de deseos y recibir atención personalizada.'
      }
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: () => import('@/views/ContactView.vue'),
      meta: {
        title: 'Contacto y Asesoría | Cushion Joyería',
        description: 'Contáctanos para atención personalizada, diseño de anillos de compromiso a medida o consultas sobre esmeraldas de Muzo y Chivor.'
      }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        title: 'Mi Perfil | Cushion',
        description: 'Gestiona tu cuenta, revisa el estado de tus pedidos de joyería y actualiza tu información de envío.'
      }
    },
    {
      path: '/buscar',
      name: 'search',
      component: () => import('@/views/SearchView.vue')
    },
    {
      path: '/garantias',
      name: 'garantias',
      component: () => import('@/views/GarantiasView.vue'),
      meta: { title: 'Garantías y Certificados | Cushion' }
    },
    {
      path: '/envios',
      name: 'envios',
      component: () => import('@/views/EnviosView.vue'),
      meta: { title: 'Políticas de Envío Seguro | Cushion' }
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/FaqView.vue'),
      meta: { title: 'Preguntas Frecuentes | Cushion' }
    },
    {
      path: '/terminos',
      name: 'terminos',
      component: () => import('@/views/TerminosView.vue'),
      meta: { title: 'Términos y Condiciones Legales | Cushion' }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: {
        title: 'Panel de Control | Cushion',
        description: 'Administración exclusiva del sistema Cushion.'
      }
    }
  ]
});

// ✨ IMPLEMENTACIÓN SEGUIDORES DE NAVEGACIÓN MODERNA Y FLUIDA (EVITA CONGELAMIENTOS)
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // Validación de Rutas Administrativas
  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      return '/auth'; // Redirección limpia mediante retorno de objeto
    }
  }

  if (to.path.startsWith('/perfil')) {
    if (!authStore.isAuthenticated) {
      return '/auth';
    }
  }

  return true;
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;