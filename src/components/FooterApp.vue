<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue';
import { useLocaleStore } from '@/stores/locale';
import { useAnalytics } from '@/composables/useAnalytics';
const L = useLocaleStore();
const { trackCustomizeClick } = useAnalytics();

const supportItems = [
    { key: 'footer.link.track', path: '/rastrear' },
    { key: 'footer.link.warranty', path: '/garantias' },
    { key: 'footer.link.shipping', path: '/envios' },
    { key: 'footer.link.sizeGuide', path: '/guia-de-tallas' },
    { key: 'footer.link.faq', path: '/faq' },
    { key: 'footer.link.terms', path: '/terminos' },
    { key: 'footer.link.privacy', path: '/privacidad' },
];

const whatsappLink = 'https://wa.me/573136133822?text=Hola%2C%20me%20gustaría%20personalizar%20una%20joya%20Cushion.';

const commitmentIcons = [
    { nameKey: 'trust.gia', iconName: 'lucide:gem', descKey: 'trust.gia.desc' },
    { nameKey: 'trust.insured', iconName: 'lucide:truck', descKey: 'trust.insured.desc' },
    { nameKey: 'trust.support', iconName: 'lucide:phone-call', descKey: 'trust.support.desc' },
];

const socialMedia = [
    { name: 'Instagram', iconName: 'lucide:instagram', link: 'https://www.instagram.com/joyasyesmeraldas/' },
    { name: 'Facebook', iconName: 'lucide:facebook', link: 'https://www.facebook.com/cushionjewels' },
    { name: 'TikTok', iconName: 'ic:baseline-tiktok', link: 'https://www.tiktok.com/@cushion.joyas.esmeraldas' },
];
</script>

<template>
  <footer class="text-brand-white pt-16 mt-12 border-t border-brand-white/10 emerald-texture">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <div class="text-center mb-12 border-b border-brand-white/20 pb-10">
          <h3 class="text-2xl md:text-3xl font-serif-elegant mb-4">
              {{ L.t('footer.customTitle') }}
          </h3>
          <p class="text-xl font-sans-luxury mb-6 max-w-2xl mx-auto">
              {{ L.t('footer.customText') }}
          </p>

          <RouterLink to="/esmeraldas" @click="trackCustomizeClick('footer')"
             class="inline-flex items-center justify-center px-8 py-3 bg-brand-primary text-brand-black
                    font-bold text-sm tracking-wide hover:bg-brand-gold transition-colors duration-300">
              <Icon icon="lucide:sparkles" class="w-5 h-5 mr-3" />
              {{ L.t('footer.customCta') }}
          </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-16 pt-8">
        <div v-for="item in commitmentIcons" :key="item.nameKey" class="text-center">
            <Icon :icon="item.iconName" class="w-12 h-12 mx-auto mb-4 text-brand-gold" />
            <h3 class="text-lg font-serif-elegant mb-3 tracking-wide">
                {{ L.t(item.nameKey) }}
            </h3>
            <p class="text-sm font-sans-luxury text-brand-white/80 leading-relaxed">
                {{ L.t(item.descKey) }}
            </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-t border-brand-white/20 pt-10">

        <div class="col-span-1">
          <RouterLink to="/" class="block mb-4">
              <img src="@/assets/images/logo-cushion-white.png" alt="Cushion Joyas & Esmeraldas" class="h-10">
          </RouterLink>
          <p class="text-sm font-sans-luxury leading-relaxed mb-6">
            {{ L.t('footer.tagline') }}
          </p>

          <h4 class="text-lg font-serif-elegant mt-6 mb-4 tracking-wide border-b border-brand-gold pb-1">{{ L.t('footer.follow') }}</h4>
          <div class="flex space-x-5 text-brand-white">
              <a v-for="social in socialMedia" :key="social.name" :href="social.link" target="_blank"
                 class="hover:text-brand-gold transition-colors duration-200">
                  <Icon :icon="social.iconName" class="w-6 h-6" />
              </a>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-serif-elegant mb-4 tracking-wide border-b border-brand-gold pb-1">{{ L.t('footer.location') }}</h4>
          <ul class="space-y-3 font-sans-luxury text-sm text-brand-white/80">
            <li class="flex items-start">
              <Icon icon="lucide:map-pin" class="w-4 h-4 mr-2 mt-1 text-brand-gold shrink-0" />
              <span>Emerald Trade Center<br>Avenida Jimenez 5-43, Local 216<br>Bogotá, Colombia</span>
            </li>
            <li class="flex items-center">
              <Icon icon="lucide:phone" class="w-4 h-4 mr-2 text-brand-gold shrink-0" />
              <a href="tel:+573136133822" class="hover:text-brand-gold transition-colors">+57 313 6133822</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-serif-elegant mb-4 tracking-wide border-b border-brand-gold pb-1">{{ L.t('footer.hours') }}</h4>
          <ul class="space-y-2 font-sans-luxury text-sm text-brand-white/80">
            <li class="flex justify-between"><span>Lunes - Viernes:</span> <span>9:00 a.m. - 6:00 p.m.</span></li>
            <li class="flex justify-between"><span>Sábado:</span> <span>9:00 a.m. - 5:00 p.m.</span></li>
            <li class="flex justify-between text-brand-white/50"><span>Domingo:</span> <span>Cerrado</span></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-serif-elegant mb-4 tracking-wide border-b border-brand-gold pb-1">{{ L.t('footer.links') }}</h4>
          <ul class="space-y-3 font-sans-luxury text-sm">
            <li v-for="item in supportItems" :key="item.path">
              <RouterLink :to="item.path" class="hover:text-brand-gold transition-colors">
                {{ L.t(item.key) }}
              </RouterLink>
            </li>
          </ul>
        </div>

      </div>

      <div class="border-t border-brand-white/20 pt-8 pb-8 text-center flex flex-col items-center justify-center">
        <p class="text-xs font-sans-luxury text-brand-white/70 mb-2">
          © {{ new Date().getFullYear() }} CUSHION Joyas & Esmeraldas. {{ L.t('footer.rights') }}
        </p>

        <a href="https://marcapro.agency" target="_blank" class="inline-flex items-center gap-1.5 text-[10px] font-sans-luxury tracking-wide text-brand-white/40 hover:text-brand-gold transition-colors duration-300">
          Desarrollado por MarcaPro
          <Icon icon="lucide:external-link" class="w-3 h-3 opacity-70" />
        </a>
      </div>

    </div>
  </footer>
</template>

<style scoped>
@reference "../assets/main.css";

.emerald-texture {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(0, 180, 130, 0.04) 0px,
      rgba(0, 180, 130, 0.04) 1px,
      transparent 1px,
      transparent 12px
    ),
    linear-gradient(
      160deg,
      #001A14 0%,
      #003D30 25%,
      #006B55 50%,
      #004030 75%,
      #001A14 100%
    );
  /* El texto dentro del footer siempre usa los tokens fijos,
     no los de la paleta global, para ser legible sobre verde. */
  color: var(--color-on-emerald);
}

/* Anula text-brand-white dentro del footer para que no herede el tema global */
.emerald-texture :deep(*) {
  --color-brand-white: var(--color-on-emerald);
}
</style>
