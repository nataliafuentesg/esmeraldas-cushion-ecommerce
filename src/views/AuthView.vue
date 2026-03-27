<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true); // Controla si mostramos Login o Registro
const errorMsg = ref('');

// Formulario reactivo
const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: ''
});

const handleSubmit = async () => {
  errorMsg.value = '';
  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password);
      
      if (authStore.isAdmin) {
        router.push('/admin'); // Si es el jefe, al panel de control
      } else {
        router.push('/perfil'); // Si es cliente, a ver sus compras
      }
      
    } else {
      await authStore.register(form.value);
      router.push('/perfil'); // Después de registrarse, va a su perfil
    }
  } catch (error) {
    errorMsg.value = isLogin.value ? 'Credenciales incorrectas' : 'Error al crear la cuenta. El correo podría ya estar registrado.';
  }
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-20 pb-20 flex items-center justify-center">
    <div class="w-full max-w-md border border-brand-white/10 p-8 md:p-12 bg-brand-black/50 backdrop-blur-sm">
      
      <h1 class="text-3xl font-serif-elegant text-brand-white mb-8 text-center uppercase tracking-widest">
        {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
      </h1>

      <p v-if="errorMsg" class="text-red-400 text-xs text-center mb-6 font-sans-luxury uppercase tracking-wider">
        {{ errorMsg }}
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <template v-if="!isLogin">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input v-model="form.firstName" type="text" placeholder="Nombre" required
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-2 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
            </div>
            <div>
              <input v-model="form.lastName" type="text" placeholder="Apellido" required
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-2 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
            </div>
          </div>
          <div>
            <input v-model="form.phone" type="tel" placeholder="Teléfono" required
                   class="w-full bg-transparent border-b border-brand-white/20 px-0 py-2 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
          </div>
        </template>

        <div>
          <input v-model="form.email" type="email" placeholder="Correo Electrónico" required
                 class="w-full bg-transparent border-b border-brand-white/20 px-0 py-2 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
        </div>
        <div>
          <input v-model="form.password" type="password" placeholder="Contraseña" required
                 class="w-full bg-transparent border-b border-brand-white/20 px-0 py-2 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
        </div>

        <button type="submit" 
                class="w-full bg-brand-white text-brand-black px-6 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-brand-gold transition-colors duration-300 mt-8">
          {{ isLogin ? 'Acceder' : 'Registrarse' }}
        </button>

      </form>

      <div class="mt-8 text-center border-t border-brand-white/10 pt-6">
        <button @click="isLogin = !isLogin" class="text-brand-white/50 hover:text-brand-gold text-xs font-sans-luxury uppercase tracking-widest transition-colors">
          {{ isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>

    </div>
  </div>
</template>