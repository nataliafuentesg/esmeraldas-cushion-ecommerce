<script setup>
import { Icon } from '@iconify/vue';
import { defineProps } from 'vue';

const props = defineProps({
  reviews: {
    type: Array,
    default: () => []
  }
});


const getStarIcons = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(i < rating ? 'lucide:star' : 'lucide:star-outline');
  }
  return stars;
};
</script>

<template>
    <div class="py-16">
        <h2 class="text-3xl font-serif-elegant text-brand-white text-center mb-10 border-b border-brand-gold/50 pb-4 uppercase tracking-widest">
            Opiniones de Nuestros Clientes
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="review in mockReviews" :key="review.id" class="p-6 bg-brand-black/50 border border-brand-white/10 hover:border-brand-gold/50 transition-all duration-300">
                
                <div class="flex mb-3">
                    <Icon v-for="(star, index) in getStarIcons(review.rating)" 
                          :key="index" 
                          :icon="star" 
                          class="w-5 h-5"
                          :class="{'text-brand-gold': star === 'lucide:star', 'text-brand-white/30': star === 'lucide:star-outline'}"
                    />
                </div>
                
                <p class="text-base font-sans-luxury text-brand-white/80 italic mb-4">
                    "{{ review.text }}"
                </p>
                
                <p class="text-sm font-sans-luxury text-brand-white/50 border-t border-brand-white/10 pt-2">
                    — {{ review.author }}, {{ review.date }}
                </p>
            </div>
        </div>
        
        <div class="text-center mt-12">
            <button class="px-8 py-3 bg-brand-black border border-brand-white/50 text-brand-white uppercase font-bold text-sm tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors duration-300">
                Ver Todas las Opiniones
            </button>
        </div>
        
    </div>
</template>