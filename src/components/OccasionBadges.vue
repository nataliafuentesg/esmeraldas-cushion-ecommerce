<script setup>
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// Se mantiene exactamente tu misma lógica de Props y Métodos
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

const occasionMetadata = {
  'Compromiso': { img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80' },
  'Bodas': { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80' },
  'Quinceaños': { img: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=300&q=80' },
  'Aniversario': { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80' },
  'Regalo': { img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80' }
};

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
    <h3 class="text-brand-white font-serif-elegant text-xs uppercase tracking-[0.3em] mb-8 opacity-40">
      {{ isHome ? 'Explorar Colecciones Especiales' : 'Filtrar por Ocasión Especial' }}
    </h3>
    
    <div class="flex flex-row flex-nowrap md:flex-wrap justify-start md:justify-center items-center gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 hide-scrollbar snap-x px-4">
      <div 
        v-for="occ in occasions" 
        :key="occ"
        @click="handleClick(occ)"
        class="shrink-0 snap-center relative group cursor-pointer overflow-hidden border transition-all duration-500 rounded-full md:rounded-none w-28 h-16 md:w-40 md:h-20"
        :class="(!isHome && currentSelection === occ) ? 'border-brand-gold shadow-lg shadow-brand-gold/10 scale-95' : 'border-brand-white/10 hover:border-brand-gold/40'"
      >
        <img 
          :src="occasionMetadata[occ]?.img || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80'" 
          :alt="occ"
          class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-30 group-hover:opacity-50"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent"></div>
        
        <div class="absolute inset-0 flex flex-col items-center justify-center p-2 text-center select-none">
          <span 
            class="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.25em] transition-colors duration-300 block max-w-full truncate px-1"
            :class="(!isHome && currentSelection === occ) ? 'text-brand-gold' : 'text-brand-white/80 group-hover:text-brand-gold'"
          >
            {{ occ }}
          </span>
          <div 
            class="h-[1px] bg-brand-gold transition-all duration-500 mt-1"
            :class="(!isHome && currentSelection === occ) ? 'w-6' : 'w-0 group-hover:w-6'"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../assets/main.css";

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
</style>