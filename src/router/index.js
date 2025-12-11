import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductDetail from '../views/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // CLAVE: Apunta HomeView a la ruta raíz
    },
    {
      path: '/detalle/:slug', 
      name: 'product-detail',
      component: ProductDetail,
      props: true // Esto pasa el ':slug' al componente como una prop
    },
  ],
  // Garantizar que la página siempre inicie en la parte superior
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router