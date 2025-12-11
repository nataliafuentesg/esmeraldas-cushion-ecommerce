<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const totalItems = computed(() => cartStore.cartCount) 

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleCart = () => {
    cartStore.toggleOffCanvas(); 
};

// Nueva y simétrica estructura de 4 enlaces
const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'ESMERALDAS', path: '/esmeraldas' },
  { name: 'JOYAS', path: '/joyas' }, 
  { name: 'CONTACTO', path: '/contacto' },
]

// División simétrica: 2 y 2
const navItemsLeft = navItems.slice(0, 2);
const navItemsRight = navItems.slice(2, 4);

const mobileNavItems = navItems;
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-5 
              flex justify-between items-center relative">
    
    <div class="flex items-center justify-start lg:pl-10 xl:pl-20"> 
        
        <button @click="toggleMenu" class="lg:hidden text-brand-white z-50">
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <nav class="hidden lg:flex space-x-12 xl:space-x-16">
          <RouterLink 
            v-for="item in navItemsLeft" 
            :key="item.name" 
            :to="item.path"
            class="nav-link text-brand-white hover:text-brand-gold transition-colors 
                   uppercase font-sans-luxury text-xs"
          >
            {{ item.name }}
          </RouterLink>
        </nav>
    </div>

    <RouterLink to="/" 
      class="absolute left-1/2 transform -translate-x-1/2 z-50 px-2 sm:px-4 md:px-6"> 
      <img src="@/assets/images/logo-cushion-white.png" alt="Cushion Joyas & Esmeraldas" class="h-14 md:h-16 p-2">
    </RouterLink>

    <div class="flex items-center justify-end lg:pr-10 xl:pr-20"> 
        
        <nav class="hidden lg:flex space-x-12 xl:space-x-16">
            <RouterLink 
              v-for="item in navItemsRight" 
              :key="item.name" 
              :to="item.path"
              class="nav-link text-brand-white hover:text-brand-gold transition-colors 
                     uppercase font-sans-luxury text-xs"
            >
              {{ item.name }}
            </RouterLink>
        </nav>
      
        <button @click="toggleCart" class="relative text-brand-white hover:text-brand-gold ml-6 lg:ml-12 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="totalItems > 0" class="absolute -top-2 -right-2 bg-brand-primary text-brand-black 
                rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {{ totalItems }}
            </span>
        </button>
        
    </div>
  </div>

  <transition name="slide-down">
    <div v-if="isMenuOpen" 
         class="lg:hidden fixed top-0 left-0 w-full h-screen bg-brand-black/95 backdrop-blur-sm z-40 
                pt-24 pb-10 overflow-y-auto">
      <nav class="flex flex-col items-center space-y-8">
        <RouterLink 
          v-for="item in mobileNavItems" 
          :key="item.name" 
          :to="item.path"
          @click="toggleMenu"
          class="nav-link-mobile text-2xl text-brand-white hover:text-brand-gold 
                 uppercase font-serif-elegant transition-colors"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
      
      <div class="text-center mt-12 text-sm text-gray-500 font-sans-luxury">
        Atención personalizada 24/7
      </div>
    </div>
  </transition>

</template>

<style scoped>
/* Estilos Desktop: Espaciado de letras amplio en la navegación */
.nav-link {
    color: var(--color-brand-white) !important; 
    letter-spacing: 0.2em;
    padding-bottom: 3px;
    border-bottom: 1px solid transparent;
}
.nav-link:hover {
    color: #B89B6A !important; 
    border-color: #B89B6A; 
}

/* Estilos Móviles: Transición de menú */
.slide-down-enter-active, 
.slide-down-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Estilos Móviles: Enlaces grandes y elegantes */
.nav-link-mobile {
    letter-spacing: 0.1em;
}
</style>