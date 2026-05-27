<script setup>
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const props = defineProps({
  occasions: {
    type: Array,
    required: true
  },
  isHome: {
    type: Boolean,
    default: false
  },
  currentSelection: {
    type: String,
    default: 'Todas'
  }
});

const emit = defineEmits(['select-category']);
const router = useRouter();

const handleClick = (occ) => {
  if (props.isHome) {
    router.push(`/coleccion/${occ.toLowerCase()}`);
  } else {
    emit('select-category', occ);
  }
};
</script>

<template>
  <section v-if="occasions.length > 0" class="w-full text-center">
    <h3 class="text-brand-white font-serif-elegant text-xs tracking-[0.3em] mb-8 opacity-40">
      {{ isHome ? 'Explorar Colecciones Especiales' : 'Filtrar por Ocasión Especial' }}
    </h3>
    
    <div class="flex flex-row flex-nowrap md:flex-wrap justify-start md:justify-center items-center gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 hide-scrollbar snap-x px-4 relative z-20">
      <div 
        v-for="occ in occasions" 
        :key="occ"
        @click="handleClick(occ)"
        class="shrink-0 snap-center relative group cursor-pointer flex flex-col items-center justify-center border transition-all duration-500 rounded-xl md:rounded-none w-28 h-20 md:w-40 md:h-20 bg-brand-white/[0.02] backdrop-blur-sm"
        :class="(!isHome && currentSelection === occ) ? 'border-brand-gold bg-brand-gold/[0.04] shadow-lg shadow-brand-gold/5' : 'border-brand-white/10 hover:border-brand-gold/30 hover:bg-brand-white/[0.02]'"
      >
        
        <div class="mb-2 md:mb-1 transition-transform duration-500 group-hover:-translate-y-0.5">
          
          <Icon 
            v-if="occ.toLowerCase().includes('compromiso')"
            icon="lucide:gem" 
            class="w-4 h-4 transition-colors duration-500"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/30 group-hover:text-brand-gold'"
          />

          <Icon 
            v-else-if="occ.toLowerCase().includes('boda') || occ.toLowerCase().includes('matrimonio')"
            icon="lucide:heart" 
            class="w-4 h-4 transition-colors duration-500"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/30 group-hover:text-brand-gold'"
          />

          <Icon 
            v-else-if="occ.toLowerCase().includes('quince') || occ.toLowerCase().includes('15')"
            icon="lucide:crown" 
            class="w-4 h-4 transition-colors duration-500"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/30 group-hover:text-brand-gold'"
          />

          <Icon 
            v-else-if="occ.toLowerCase().includes('aniversario')"
            icon="lucide:hourglass" 
            class="w-4 h-4 transition-colors duration-500"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/30 group-hover:text-brand-gold'"
          />

          <Icon 
            v-else-if="occ.toLowerCase().includes('regalo') || occ.toLowerCase().includes('detalle')"
            icon="lucide:gift" 
            class="w-4 h-4 transition-colors duration-500"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/30 group-hover:text-brand-gold'"
          />

          <Icon 
            v-else
            icon="lucide:sparkles" 
            class="w-4 h-4 transition-colors duration-500"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/30 group-hover:text-brand-gold'"
          />

        </div>
        
        <div class="flex flex-col items-center justify-center text-center select-none w-full px-3">
          <span 
            class="text-[9px] md:text-[10px] font-bold tracking-wide transition-colors duration-300 block max-w-full text-center whitespace-nowrap"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold font-extrabold' : 'text-brand-white/70 group-hover:text-brand-white'"
          >
            {{ occ }}
          </span>
          
          <div 
            class="h-[1px] bg-brand-gold transition-all duration-500 mt-1.5"
            :class="(!isHome && currentSelection === occ) ? 'w-4' : 'w-0 group-hover:w-4'"
          ></div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../assets/main.css";

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
</style>