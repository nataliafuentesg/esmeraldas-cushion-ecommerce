<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const messages = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/contact');
    messages.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.warn("Aún no hay controlador de contacto, o falló la petición.");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h3 class="text-2xl font-serif-elegant text-brand-white tracking-widest uppercase mb-8 border-b border-brand-white/10 pb-4">Bandeja de Entrada</h3>
    
    <div v-if="loading" class="text-brand-gold uppercase tracking-widest text-xs animate-pulse">Cargando mensajes...</div>
    
    <div v-else-if="messages.length === 0" class="text-brand-white/50 text-sm font-sans-luxury uppercase tracking-widest">
      No hay mensajes nuevos.
    </div>

    <div v-else class="space-y-4">
      <div v-for="msg in messages" :key="msg.id" class="border border-brand-white/10 bg-brand-black/50 p-6">
        <h4 class="text-brand-gold font-serif-elegant text-lg">{{ msg.name }}</h4>
        <p class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">{{ msg.email }} | Tel: {{ msg.phone }}</p>
        <p class="text-brand-white/80 font-sans-luxury text-sm mt-4 border-t border-brand-white/10 pt-4">{{ msg.message }}</p>
      </div>
    </div>
  </div>
</template>