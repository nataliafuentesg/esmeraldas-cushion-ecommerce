<template>
  <section class="bg-brand-black text-brand-white py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <h2 class="text-center text-5xl font-serif-elegant mb-20">
        El Legado de la Esmeralda
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
        
        <div class="lg:order-1 order-2">
          <h3 class="text-3xl font-serif-elegant text-brand-gold mb-4">
            Origen y Pureza
          </h3>
          <p class="text-lg font-sans-luxury leading-relaxed mb-6">
            Nuestras esmeraldas provienen de las minas más prestigiosas de Colombia. Cada gema es seleccionada a mano, valorando la intensidad de su color y la pureza de su cristal. Este legado geológico es la base de cada pieza que creamos.
          </p>
          <RouterLink to="/nosotros" class="uppercase text-sm tracking-widest font-sans-luxury border-b border-brand-white hover:text-brand-gold hover:border-brand-gold transition-colors">
            Conoce Nuestras Minas
          </RouterLink>
        </div>
        
        <div class="lg:order-2 order-1">
          <img src="" alt="Minas de Esmeraldas en Colombia" class="w-full h-auto object-cover shadow-2xl">
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        <div class="lg:order-1 order-1">
           <img src="" alt="Diseño de Joyería Moderna" class="w-full h-auto object-cover shadow-2xl">
        </div>
        
        <div class="lg:order-2 order-2">
          <h3 class="text-3xl font-serif-elegant text-brand-gold mb-4">
            Precisión Moderna
          </h3>
          <p class="text-lg font-sans-luxury leading-relaxed mb-6">
            Combinamos la tradición milenaria de la esmeralda con técnicas de orfebrería de vanguardia. Cada montura y cada diamante acompañante son colocados con una precisión que excede los estándares de la alta joyería, garantizando que su pieza sea tan duradera como bella.
          </p>
          <RouterLink to="/nosotros" class="uppercase text-sm tracking-widest font-sans-luxury border-b border-brand-white hover:text-brand-gold hover:border-brand-gold transition-colors">
            Ver el Proceso
          </RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>