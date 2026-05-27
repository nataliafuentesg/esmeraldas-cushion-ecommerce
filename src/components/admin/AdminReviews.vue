<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { Icon } from '@iconify/vue';

const reviews = ref([]);
const loading = ref(true);

onMounted(async () => {
  await loadReviews();
});

const loadReviews = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/reviews');
    reviews.value = res.data;
  } catch (error) {
    console.error("Error cargando reseñas:", error);
  } finally {
    loading.value = false;
  }
};

const deleteReview = async (id) => {
  if (confirm("¿Borrar esta reseña del sistema de forma permanente?")) {
    try {
      await api.delete(`/admin/reviews/${id}`);
      await loadReviews();
    } catch (error) {
      alert("Error al borrar reseña");
    }
  }
};
</script>

<template>
  <div class="font-sans">
    <h3 class="text-2xl font-serif-elegant text-brand-white tracking-wide mb-8 border-b border-brand-white/10 pb-4">
      Moderación de Reseñas
    </h3>
    
    <div v-if="loading" class="text-brand-gold tracking-wide text-xs animate-pulse text-center py-20">
      Cargando base de datos de reseñas...
    </div>
    
    <div v-else-if="reviews.length === 0" class="text-center py-20 border border-brand-white/5 bg-brand-black/50">
      <p class="text-brand-white/50 text-sm font-sans-luxury tracking-wide">
        No hay reseñas registradas actualmente.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="rev in reviews" 
        :key="rev.id" 
        class="border border-brand-white/10 bg-brand-black/50 p-6 flex flex-col md:flex-row justify-between items-start gap-6 hover:border-brand-gold/30 transition-colors group"
      >
        <div class="flex-1 w-full">
          
          <div class="flex flex-wrap items-center gap-4 mb-3">
            <div class="flex gap-1">
              <Icon 
                v-for="star in 5" :key="star" 
                icon="lucide:star" 
                :class="star <= rev.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-white/20'" 
                class="w-4 h-4" 
              />
            </div>
            
            <span class="text-brand-white font-serif-elegant tracking-wider text-sm">
              {{ rev.author || 'Cliente Anónimo' }}
            </span>
            
            <span class="text-brand-white/30 text-[10px] tracking-wide">
              {{ rev.date ? new Date(rev.date).toLocaleDateString() : 'Fecha Reciente' }}
            </span>
          </div>
          
          <p class="text-brand-white/80 font-sans-luxury text-sm leading-relaxed mb-4 italic">
            "{{ rev.comment }}"
          </p>
          
          <div class="flex items-center gap-2 text-[10px] tracking-wide bg-brand-white/5 w-fit px-3 py-1.5 border border-brand-white/5">
            <Icon icon="lucide:gem" class="w-3 h-3 text-brand-gold" />
            <span class="text-brand-white/60">Pieza Vinculada: 
              <span class="text-brand-white font-bold">
                {{ rev.productName || rev.product?.name || rev.slug || `Referencia ID: ${rev.product?.id || 'Desconocida'}` }}
              </span>
            </span>
          </div>

        </div>

        <button 
          @click="deleteReview(rev.id)" 
          class="shrink-0 flex items-center gap-2 text-red-500/70 hover:text-red-500 text-[10px] tracking-wide transition-colors border border-red-900/30 bg-red-950/20 px-4 py-2 hover:bg-red-950/50"
        >
          <Icon icon="lucide:trash-2" class="w-4 h-4" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</template>