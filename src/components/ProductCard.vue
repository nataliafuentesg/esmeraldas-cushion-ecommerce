<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  product: { 
    type: Object, 
    required: true 
  }
});

const mainImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    // Buscamos preferiblemente la que esté marcada como isThumbnail
    const thumb = props.product.images.find(img => img.isThumbnail);
    return thumb ? thumb.imageUrl : props.product.images[0].imageUrl;
  }
  return 'https://images.unsplash.com/photo-1588444837495-c6cfaf50c8a9?q=80&w=800'; 
});

const hoverImage = computed(() => {
  if (props.product.images && props.product.images.length > 1) {
    // Si la primera es miniatura, mandamos la segunda. Si no, la primera disponible.
    const nonThumb = props.product.images.find(img => !img.isThumbnail);
    return nonThumb ? nonThumb.imageUrl : props.product.images[1].imageUrl;
  }
  return null;
});
</script>

<template>
  <RouterLink 
    :to="{ name: 'product-detail', params: { slug: product.slug } }"
    class="group flex flex-col h-full w-full bg-brand-black/40 border border-brand-white/5 hover:border-brand-gold/30 text-brand-white transition-all duration-500 relative"
  >
    <div class="aspect-square overflow-hidden relative bg-brand-white/[0.02] border-b border-brand-white/5">
      
      <img 
        :src="mainImage" 
        :alt="product.name" 
        class="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
        :class="{ 'group-hover:opacity-0': hoverImage }"
      />

      <img 
        v-if="hoverImage"
        :src="hoverImage" 
        :alt="product.name + ' vista alternativa'" 
        class="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-all duration-1000 ease-in-out group-hover:opacity-100 group-hover:scale-105"
      />
      
      <span 
        v-if="product.featured" 
        class="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md text-brand-gold border border-brand-gold/30 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.2em] z-10"
      >
        Exclusivo
      </span>
    </div>

    <div class="p-5 md:p-6 text-center flex-1 flex flex-col justify-between gap-4">
      
      <div>
        <p class="text-[9px] text-brand-gold uppercase tracking-[0.3em] mb-2 font-bold opacity-80">
          {{ product.category }}
        </p>
        <h3 class="font-serif-elegant text-base md:text-lg tracking-wide group-hover:text-brand-gold transition-colors duration-300 line-clamp-2 uppercase min-h-[3rem] flex items-center justify-center">
          {{ product.name }}
        </h3>
      </div>

      <div class="pt-3 border-t border-brand-white/5">
        <p class="font-sans-luxury text-brand-white/90 text-sm tracking-widest font-medium">
          $ {{ product.price.toLocaleString() }}
        </p>
      </div>

    </div>
  </RouterLink>
</template>

<style scoped>
@reference "../assets/main.css";

/* Simplificamos los estilos nativos para delegar la animación de elevación 
   a las vistas globales de forma limpia y fluida */
.group {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.group:hover {
  box-shadow: 0 15px 30px rgba(197, 168, 128, 0.05);
}

/* Forzar el truncado a dos líneas máximas si el nombre es kilométrico */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>