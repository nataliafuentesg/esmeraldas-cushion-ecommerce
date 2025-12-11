<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { products } from '@/data/products'; 
import { useRouter } from 'vue-router'; 
import { useCartStore } from '@/stores/cart';
import ProductGallery from '@/components/ProductGallery.vue';
import RelatedProducts from '@/components/RelatedProducts.vue'; 
import ProductReviews from '@/components/ProductReviews.vue'; // ¡Importar nuevo componente!
import { Icon } from '@iconify/vue'; 

const props = defineProps({
  slug: {
    type: String,
    required: true,
  }
});

const cartStore = useCartStore();
const router = useRouter();
const product = ref(null);
const selectedQuantity = ref(1);
const relatedProducts = ref([]);
const whatsappLink = ref(''); // Para el link de WhatsApp

onMounted(() => {
  const foundProduct = products.find(p => p.slug === props.slug);
  
  if (!foundProduct) {
    router.push('/esmeraldas'); 
    return;
  }

  product.value = foundProduct;
  
  // Lógica para generar el mensaje de WhatsApp
  const whatsappMessage = `Hola, estoy interesado(a) en el producto *${product.value.name}* (Ref: ${product.value.id}) y me gustaría recibir asesoría para su compra.`;
  whatsappLink.value = `https://wa.me/573001234567?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Datos de galería simulados
  product.value.gallery = [
    { id: 1, src: foundProduct.mainImage, alt: 'Vista Frontal Principal' },
    { id: 2, src: foundProduct.hoverImage, alt: 'Vista de Perfil' },
    { id: 3, src: 'placeholder-detail-3.jpg', alt: 'Detalle de la Talla' }, 
    { id: 4, src: 'placeholder-detail-4.jpg', alt: 'Joyas en la mano' }, 
  ];
  
  // Lógica para filtrar productos relacionados
  relatedProducts.value = products
    .filter(p => 
      p.category === product.value.category && p.id !== product.value.id
    )
    .slice(0, 4); 
});

const addToCart = () => {
  if (product.value) {
    cartStore.addItem(product.value, selectedQuantity.value);
    alert(`Añadido ${selectedQuantity.value} ${product.value.name} al carrito!`);
  }
};

// Funciones para el control de cantidad (estilizado)
const increaseQuantity = () => {
  selectedQuantity.value++;
};

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
};
</script>

<template>
  <div v-if="product" class="bg-brand-black min-h-screen py-16 lg:py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <nav class="text-sm font-sans-luxury text-brand-white/70 mb-8">
        <RouterLink to="/" class="hover:text-brand-gold">Home</RouterLink>
        /
        <RouterLink to="/esmeraldas" class="hover:text-brand-gold">Colección</RouterLink>
        /
        <span class="text-brand-white">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        <div class="lg:sticky lg:top-8 self-start"> 
          <ProductGallery :images="product.gallery" :product-name="product.name" />
        </div>

        <div class="lg:pl-8">
          
          <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-2 uppercase tracking-wide">
            {{ product.name }}
          </h1>
          <p class="text-3xl font-serif-elegant text-brand-gold mb-8">
            $ {{ product.price.toLocaleString() }}
          </p>

          <p class="text-lg font-sans-luxury text-brand-white/80 mb-8 leading-relaxed border-b border-brand-white/20 pb-8">
            {{ product.description }} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. En Cushion, solo utilizamos esmeraldas colombianas de la más alta calidad.
          </p>

          <div class="border-b border-brand-white/20 py-6 mb-8">
            
            <div v-if="product.category === 'Anillos'" class="mb-6">
                <label for="talla" class="block text-sm font-sans-luxury text-brand-white/70 mb-2">Selecciona la Talla:</label>
                <select id="talla" class="w-full p-3 bg-brand-black border border-brand-white/30 text-brand-white/90 focus:border-brand-gold transition-colors appearance-none">
                    <option>Talla 6 (52 mm)</option>
                    <option>Talla 7 (54.5 mm)</option>
                    <option>Talla 8 (57 mm)</option>
                </select>
                <a href="#" class="mt-2 block text-sm font-sans-luxury text-brand-primary hover:text-brand-gold transition-colors">Guía de Tallas</a>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              
              <div class="flex items-center border border-brand-white/30 text-brand-white">
                  <button 
                      @click="decreaseQuantity"
                      class="h-12 w-12 flex justify-center items-center text-xl font-sans-luxury hover:bg-brand-white/10 transition-colors"
                  >
                      -
                  </button>
                  <input 
                      type="text" 
                      v-model.number="selectedQuantity" 
                      readonly
                      class="h-12 w-16 text-center bg-brand-black text-brand-white/90 focus:outline-none font-sans-luxury"
                  />
                  <button 
                      @click="increaseQuantity"
                      class="h-12 w-12 flex justify-center items-center text-xl font-sans-luxury hover:bg-brand-white/10 transition-colors"
                  >
                      +
                  </button>
              </div>

              <button 
                @click="addToCart"
                class="flex-1 px-6 py-3 bg-brand-primary text-brand-black uppercase font-bold text-sm tracking-widest hover:bg-brand-gold transition-colors duration-300 h-12"
              >
                Añadir al Carrito
              </button>
            </div>
            
            <a :href="whatsappLink" target="_blank"
               class="mt-4 flex items-center justify-center w-full px-6 py-3 border border-brand-primary 
                      text-brand-primary uppercase font-bold text-sm tracking-widest 
                      hover:bg-brand-primary/10 transition-colors duration-300 h-12">
                <Icon icon="lucide:whatsapp" class="w-5 h-5 mr-3" /> 
                Comprar con Asesoría
            </a>
            
          </div>
          
          <div class="text-sm font-sans-luxury">
            <h3 class="text-xl font-serif-elegant text-brand-white mb-4 uppercase tracking-wider">
                Ficha Técnica
            </h3>
            <ul class="space-y-3 text-brand-white/70">
                <li class="flex justify-between border-b border-brand-white/10 pb-1">
                    <strong class="text-brand-white/90">Origen:</strong> 
                    <span>Colombia (Muzo)</span>
                </li>
                <li class="flex justify-between border-b border-brand-white/10 pb-1">
                    <strong class="text-brand-white/90">Peso en Quilates:</strong> 
                    <span>{{ product.carats || '2.5 ct' }}</span>
                </li>
                <li class="flex justify-between border-b border-brand-white/10 pb-1">
                    <strong class="text-brand-white/90">Talla de la Gema:</strong> 
                    <span>Esmeralda Corte Cushion</span>
                </li>
                <li class="flex justify-between border-b border-brand-white/10 pb-1">
                    <strong class="text-brand-white/90">Certificación:</strong> 
                    <span>GIA / Gemología Cushion</span>
                </li>
                <li class="flex justify-between border-b border-brand-white/10 pb-1">
                    <strong class="text-brand-white/90">Metal:</strong> 
                    <span>Oro Rosado 18K</span>
                </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="mt-24 lg:mt-32 border-t border-brand-white/10 pt-16">
          <ProductReviews />
      </div>

      <div class="mt-24 lg:mt-32 border-t border-brand-white/10 pt-16">
          <RelatedProducts :related-products="relatedProducts" />
      </div>

    </div>
  </div>
  
  <div v-else class="text-center py-40 bg-brand-black">
      <h1 class="text-3xl text-brand-white font-serif-elegant">El producto no ha sido encontrado.</h1>
  </div>
</template>