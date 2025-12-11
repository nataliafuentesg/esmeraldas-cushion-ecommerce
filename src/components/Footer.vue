<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'; 

// ... (El resto del script, navItems, commitmentIcons, socialMedia, etc., permanece igual) ...
// ... (asegúrate de que los arrays y constantes siguen arriba) ...

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Esmeraldas', path: '/esmeraldas' },
    { name: 'Nuestra Historia', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' },
];

const supportItems = [
    { name: 'Garantías y Certificados', path: '/garantias' },
    { name: 'Política de Envíos', path: '/envios' },
    { name: 'Preguntas Frecuentes (FAQ)', path: '/faq' },
    { name: 'Términos y Condiciones', path: '/terminos' },
];

const whatsappLink = 'https://wa.me/573001234567?text=Hola%2C%20me%20gustaría%20personalizar%20una%20joya%20Cushion.';

const commitmentIcons = [
    { name: 'Certificación GIA', iconName: 'lucide:gem', description: 'Cada esmeralda CUSHION es verificada y viene con un certificado de autenticidad y origen expedido por laboratorios de prestigio.' },
    { name: 'Envío Asegurado', iconName: 'lucide:truck', description: 'Su joya será enviada de forma discreta, con seguro a todo riesgo y solo requiere firma al recibir, garantizando su tranquilidad.' },
    { name: 'Soporte de Lujo', iconName: 'lucide:phone-call', description: 'Nuestro equipo de asesores personales está disponible 24 horas al día, 7 días a la semana, para resolver cualquier duda.' },
];

const socialMedia = [
    { name: 'Instagram', iconName: 'lucide:instagram', link: 'https://instagram.com/cushionjoyas' },
    { name: 'Facebook', iconName: 'lucide:facebook', link: 'https://facebook.com/cushionjoyas' },
    { name: 'Pinterest', iconName: 'lucide:pinterest', link: 'https://pinterest.com/cushionjoyas' },
];
</script>

<template>
<footer class="bg-emerald-dark text-brand-white pt-16 mt-12 border-t border-brand-white/10 emerald-texture">    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-12 border-b border-brand-white/20 pb-10">
          <h3 class="text-2xl md:text-3xl font-serif-elegant mb-4">
              ¿Diseño Personalizado?
          </h3>
          <p class="text-xl font-sans-luxury mb-6 max-w-2xl mx-auto">
              Escríbenos por WhatsApp y personalizaremos la joya que soñaste con la esmeralda perfecta.
          </p>
          
          <a :href="whatsappLink" target="_blank"
             class="inline-flex items-center justify-center px-8 py-3 bg-brand-primary text-brand-black 
                    uppercase font-bold text-sm tracking-widest hover:bg-brand-gold transition-colors duration-300">
              <Icon icon="lucide:message-square" class="w-5 h-5 mr-3" /> 
              Personalizar mi Joya
          </a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-16 pt-8">
        <div v-for="item in commitmentIcons" :key="item.name" class="text-center">
            <Icon :icon="item.iconName" class="w-12 h-12 mx-auto mb-4 text-brand-gold" />
            <h3 class="text-lg font-serif-elegant mb-3 uppercase tracking-widest">
                {{ item.name }}
            </h3>
            <p class="text-sm font-sans-luxury text-brand-white/80 leading-relaxed">
                {{ item.description }}
            </p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10 pb-16 border-t border-brand-white/20 pt-10">
        
        <div class="col-span-2 md:col-span-1">
          <RouterLink to="/" class="block mb-4">
              <img src="@/assets/images/logo-cushion-white.jpg" alt="Cushion Joyas & Esmeraldas" class="h-10">
          </RouterLink>
          <p class="text-sm font-sans-luxury leading-relaxed max-w-xs">
            La belleza eterna de la esmeralda, diseñada con precisión moderna.
          </p>
        </div>
        
        <div>
          <h4 class="text-lg font-serif-elegant mb-4 uppercase tracking-widest border-b border-brand-gold pb-1">Navegación</h4>
          <ul class="space-y-3 font-sans-luxury text-sm">
            <li v-for="item in navItems" :key="item.name">
              <RouterLink :to="item.path" class="hover:text-brand-gold transition-colors">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-serif-elegant mb-4 uppercase tracking-widest border-b border-brand-gold pb-1">Soporte</h4>
          <ul class="space-y-3 font-sans-luxury text-sm">
            <li v-for="item in supportItems" :key="item.name">
              <RouterLink :to="item.path" class="hover:text-brand-gold transition-colors">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="md:col-span-1">
          <h4 class="text-lg font-serif-elegant mb-4 uppercase tracking-widest border-b border-brand-gold pb-1">Contáctanos</h4>
          <ul class="space-y-3 font-sans-luxury text-sm">
            <li>Email: <a href="mailto:info@cushion.com" class="hover:text-brand-gold transition-colors">info@cushion.com</a></li>
            <li>Teléfono: <a href="tel:+5715555555" class="hover:text-brand-gold transition-colors">+57 (1) 555-5555</a></li>
          </ul>
          
          <h4 class="text-lg font-serif-elegant mt-6 mb-4 uppercase tracking-widest border-b border-brand-gold pb-1">Síguenos</h4>
          <div class="flex space-x-5 text-brand-white">
              <a v-for="social in socialMedia" :key="social.name" :href="social.link" target="_blank"
                 class="hover:text-brand-gold transition-colors duration-200">
                  <Icon :icon="social.iconName" class="w-6 h-6" />
              </a>
          </div>
        </div>
        
      </div>
      
      <div class="border-t border-brand-white/20 pt-6 pb-8 text-center">
        <p class="text-xs font-sans-luxury text-brand-white/70">
          © 2025 CUSHION Joyas & Esmeraldas. Todos los derechos reservados.
        </p>
      </div>
      
    </div>
  </footer>
</template>

<style scoped>
/* 2. CLASE DE TEXTURA PERSONALIZADA */
.emerald-texture {
  /* Simula una textura de líneas muy sutiles, como un patrón de diamante o chevron */
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.03), /* Líneas de luz muy tenues */
    rgba(255, 255, 255, 0.03) 1px,
    transparent 1px,
    transparent 10px
  );
}

/* El resto de estilos scoped, si tienes alguno, se mantiene aquí */
</style>