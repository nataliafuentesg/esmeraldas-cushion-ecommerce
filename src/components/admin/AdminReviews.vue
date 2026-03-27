<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

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
  <div>
    <h3 class="text-2xl font-serif-elegant text-brand-white tracking-widest uppercase mb-8 border-b border-brand-white/10 pb-4">Moderación de Reseñas</h3>
    
    <div v-if="loading" class="text-brand-gold uppercase tracking-widest text-xs animate-pulse">Cargando reseñas...</div>
    
    <div v-else-if="reviews.length === 0" class="text-brand-white/50 text-sm font-sans-luxury uppercase tracking-widest">
      No hay reseñas registradas.
    </div>

    <div v-else class="space-y-4">
      <div v-for="rev in reviews" :key="rev.id" class="border border-brand-white/10 bg-brand-black/50 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div class="flex items-center space-x-2 mb-2 flex-wrap gap-2">
            <span class="text-brand-gold font-bold">{{ rev.rating }} ★</span>
            <span class="text-brand-white font-serif-elegant">{{ rev.customerName }}</span>
            <span v-if="rev.isVerifiedPurchase" class="bg-green-900/50 text-green-500 text-[10px] px-2 py-0.5 uppercase tracking-widest rounded-sm">Verificado</span>
          </div>
          <p class="text-brand-white/80 font-sans-luxury text-sm">{{ rev.comment }}</p>
          <p class="text-[10px] text-brand-white/40 uppercase tracking-[0.2em] mt-2">Producto ID: {{ rev.product?.id || 'Desconocido' }}</p>
        </div>
        <button @click="deleteReview(rev.id)" class="text-red-400 text-xs uppercase tracking-widest hover:text-red-600 underline">Borrar</button>
      </div>
    </div>
  </div>
</template>