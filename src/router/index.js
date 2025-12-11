import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // CLAVE: Apunta HomeView a la ruta raíz
    },
  ],
  // Garantizar que la página siempre inicie en la parte superior
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router