<script setup>
const heroImagePcUrl = "https://res.cloudinary.com/dfmvlqtfb/image/upload/v1774902048/2U5A4981_cyohne.jpg"; 
const heroImageMobileUrl = "https://res.cloudinary.com/dfmvlqtfb/image/upload/v1774902043/2U5A4648_rr9snu.jpg"; 
</script>

<template>
  <section class="min-h-screen bg-brand-black flex items-center justify-center relative 
                  overflow-hidden">
    
    <div class="absolute inset-0 z-0 bg-brand-black">
      
      <picture class="w-full h-full hero-image-container">
        <source :srcset="heroImagePcUrl" media="(min-width: 1024px)" class="w-full h-full object-cover">
        <source :srcset="heroImagePcUrl" media="(min-width: 768px)" class="w-full h-full object-cover">
        <img 
          :src="heroImageMobileUrl" 
          alt="Alta Joyería Cushion" 
          class="w-full h-full object-cover hero-image"
        />
      </picture>

      <div class="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-transparent to-brand-black/60"></div>

      <div class="absolute inset-0 bg-[#4C7F62]/5 mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 text-center px-4 max-w-4xl -translate-y-16 md:-translate-y-20">
      
      <h1 class="text-7xl md:text-9xl text-brand-white font-serif-elegant 
                 tracking-widest leading-none mb-6"
          style="letter-spacing: 0.15em; text-shadow: 0px 4px 20px rgba(0,0,0,0.8);">
        CUSHION
      </h1>
      
      <p class="text-xl md:text-3xl text-brand-gold font-sans-luxury uppercase 
                tracking-widest mb-10"
         style="text-shadow: 0px 2px 12px rgba(0,0,0,0.9);">
        Joyas & Esmeraldas
      </p>
      
      <RouterLink to="/coleccion" 
        class="inline-block px-10 py-4 border border-brand-gold text-brand-gold 
               uppercase text-xs font-bold font-sans-luxury tracking-[0.3em] 
               hover:bg-brand-gold hover:text-brand-black transition-all duration-500
               backdrop-blur-sm bg-black/30 shadow-2xl">
        Explorar Colección
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
@reference "../assets/main.css";

/* Mantenemos la animación Ken Burns sutil */
.hero-image {
  animation: slow-zoom 20s linear infinite alternate;
  object-position: center center;
}

@keyframes slow-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

/* Ajuste específico para que la animación funcione con la etiqueta <picture> */
.hero-image-container img {
  @apply w-full h-full object-cover;
}
</style>