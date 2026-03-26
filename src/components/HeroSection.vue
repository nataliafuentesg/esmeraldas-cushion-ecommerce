<script setup>
</script>

<template>
  <section class="min-h-screen bg-black flex items-center justify-center relative 
                  overflow-hidden pt-20">
    
    <div class="absolute inset-0 z-0">
      <div class="esmeralda-shine w-full h-full"></div>
    </div>

    <div class="relative z-10 text-center px-4 max-w-4xl">
      
      <h1 class="text-7xl md:text-9xl text-brand-white font-serif-elegant 
                 tracking-widest drop-shadow-lg leading-none mb-6"
          style="letter-spacing: 0.15em;">
        CUSHION
      </h1>
      
      <p class="text-xl md:text-3xl text-brand-gold font-sans-luxury uppercase 
                tracking-widest mb-10 drop-shadow-md">
        Joyas & Esmeraldas
      </p>
      
      <RouterLink to="/coleccion" 
        class="inline-block px-10 py-3 border border-brand-gold text-brand-gold 
               uppercase text-sm font-sans-luxury tracking-widest 
               hover:bg-brand-gold hover:text-brand-black transition-all duration-300">
        Explorar Colección
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
/* CLAVE DEL ESTILO: Crear un fondo visualmente profundo y resplandeciente */

/* 1. Fondo de Esmeralda y Oscuridad */
.esmeralda-shine {
    /* Gradiente radial: Negro en el centro (profundidad) que se desvanece a esmeralda (resplandor) */
    background: radial-gradient(circle at 50% 50%, 
                rgba(30, 30, 30, 0.8) 0%, /* Casi negro en el centro */
                rgba(76, 127, 98, 0.7) 50%, /* Nuestro color Esmeralda */
                rgba(30, 30, 30, 0.9) 100% /* Vuelve a negro en los bordes */
                );
    /* Animación sutil para el efecto de luz */
    animation: pulse-shine 15s infinite ease-in-out;
}

/* 2. Brillo Animado Sutil (Simula el movimiento de la luz sobre la gema) */
@keyframes pulse-shine {
  0% { 
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05); /* Ligeramente más grande */
    opacity: 1; /* Ligeramente más brillante */
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* 3. Ajuste para que el texto principal use el color blanco definido en el tema */
h1 {
    color: var(--color-brand-white); 
}
</style>