<script setup>
import { ref } from 'vue';
import api from '@/api/axios';

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const isSent = ref(false);
const isSubmitting = ref(false);

const submitContact = async () => {
  isSubmitting.value = true;
  try {
    await api.post('/contact', form.value);
    isSent.value = true;
    form.value = { name: '', email: '', phone: '', message: '' }; // Limpiar
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    alert("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-20 pb-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-4 tracking-wide">
          Contacto
        </h1>
        <p class="text-brand-white/60 font-sans-luxury text-xs tracking-wide">
          Estamos aquí para asesorarte en la búsqueda de tu joya perfecta.
        </p>
      </div>

      <div v-if="isSent" class="border border-brand-gold p-12 text-center bg-brand-gold/5">
        <h2 class="text-2xl font-serif-elegant text-brand-gold mb-4 tracking-wider">Mensaje Recibido</h2>
        <p class="text-brand-white/80 font-sans-luxury text-sm tracking-wide">
          Un asesor de Cushion se pondrá en contacto contigo en breve.
        </p>
        <button @click="isSent = false" class="mt-8 text-xs text-brand-white hover:text-brand-gold tracking-wide underline underline-offset-4">
          Enviar otro mensaje
        </button>
      </div>

      <form v-else @submit.prevent="submitContact" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input v-model="form.name" type="text" placeholder="Nombre Completo" required
                 class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wider">
          
          <input v-model="form.phone" type="tel" placeholder="Teléfono / WhatsApp" required
                 class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wider">
        </div>

        <input v-model="form.email" type="email" placeholder="Correo Electrónico" required
               class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wider">

        <textarea v-model="form.message" rows="4" placeholder="¿En qué podemos ayudarte?" required
                  class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wider resize-none"></textarea>

        <div class="text-center pt-4">
          <button type="submit" :disabled="isSubmitting"
                  class="bg-brand-white text-brand-black px-12 py-4 text-xs font-bold tracking-wide hover:bg-brand-gold transition-colors duration-300 disabled:opacity-50">
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>