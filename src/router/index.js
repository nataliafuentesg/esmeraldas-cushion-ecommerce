import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import Catalog from '@/views/Catalog.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      meta: { title: 'Lookbook Editorial | Cushion Jewelry' } 
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
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: {
        title: 'Panel de Control | Cushion',
        description: 'Administración exclusiva del sistema Cushion.'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Esto hace que al cambiar de página, siempre suba al inicio
    return { top: 0 }
  }
})

// --- MAGIA: EL GUARDIÁN MULTIUSOS ---
router.beforeEach((to, from, next) => {
  // 1. MOTOR SEO: Actualizar el título de la pestaña y la meta descripción
  document.title = to.meta.title || 'Cushion | Alta Joyería';

  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description || 'Alta joyería colombiana.');
  } else {
    // Si la etiqueta no existe en el index.html, la crea dinámicamente
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = to.meta.description || 'Alta joyería colombiana.';
    document.head.appendChild(metaDescription);
  }

  // 2. MOTOR DE SEGURIDAD: Proteger rutas privadas
  const authStore = useAuthStore();

  if (to.path.startsWith('/admin')) {
    // ¿Va para el Admin? Validamos Token Y Rol
    if (authStore.isAuthenticated && authStore.isAdmin) {
      next(); // Pasa, es el jefe.
    } else {
      next('/auth'); // ¡Intruso! Lo mandamos a que inicie sesión.
    }
  }
  else if (to.path.startsWith('/perfil')) {
    // ¿Va para su Perfil? Validamos que al menos tenga sesión iniciada
    if (authStore.isAuthenticated) {
      next();
    } else {
      next('/auth');
    }
  }
  else {
    // Rutas públicas (Home, Catálogo, etc.), pase libre
    next();
  }
})

export default router