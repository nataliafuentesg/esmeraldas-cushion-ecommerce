<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// --- ESTADOS DE INTERFAZ ---
const isLogin = ref(true);
const isForgotPassword = ref(false);
const loading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errorMsg = ref('');
const successMsg = ref('');

// --- MODELO DEL FORMULARIO ---
const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// --- VALIDACIONES ---
const passwordsMatch = computed(() => {
  if (isLogin.value || isForgotPassword.value) return true;
  if (!form.value.confirmPassword) return true;
  return form.value.password === form.value.confirmPassword;
});

const isFormValid = computed(() => {
  if (isForgotPassword.value) return !!form.value.email;
  if (isLogin.value) return form.value.email && form.value.password;
  return (
    form.value.firstName && form.value.lastName &&
    form.value.phone && form.value.email &&
    form.value.password && passwordsMatch.value
  );
});

// --- ACCIONES ---
const setMode = (mode) => {
  errorMsg.value = '';
  successMsg.value = '';
  if (mode === 'forgot') {
    isForgotPassword.value = true;
    isLogin.value = false;
  } else if (mode === 'login') {
    isLogin.value = true;
    isForgotPassword.value = false;
  } else {
    isLogin.value = false;
    isForgotPassword.value = false;
  }
};

const handleSubmit = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  loading.value = true;

  // NORMALIZACIÓN: El email siempre a minúsculas, la contraseña se queda tal cual
  const cleanEmail = form.value.email.trim().toLowerCase();

  try {
    if (isForgotPassword.value) {
      await authStore.forgotPassword(cleanEmail);
      successMsg.value = 'Enlace de recuperación enviado. Revisa tu bandeja de entrada.';
    } 
    else if (isLogin.value) {
      await authStore.login(cleanEmail, form.value.password);
      router.push(authStore.isAdmin ? '/admin' : '/perfil');
    } 
    else {
      // Registro con email normalizado
      const registrationData = { ...form.value, email: cleanEmail };
      await authStore.register(registrationData);
      router.push('/perfil');
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Error en la autenticación. Revisa tus datos.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-28 pb-20 flex items-center justify-center px-4">
    <div class="w-full max-w-md border border-brand-white/10 p-8 md:p-12 bg-brand-black/50 backdrop-blur-sm shadow-2xl">
      
      <header class="mb-10 text-center">
        <h1 class="text-3xl font-serif-elegant text-brand-white uppercase tracking-[0.2em]">
          <span v-if="isForgotPassword">Recuperar</span>
          <span v-else>{{ isLogin ? 'Ingresar' : 'Registro' }}</span>
        </h1>
        <div class="h-[1px] w-12 bg-brand-gold mx-auto mt-4"></div>
      </header>

      <transition name="fade">
        <p v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-3 text-center mb-6 uppercase tracking-widest">
          {{ errorMsg }}
        </p>
      </transition>
      <transition name="fade">
        <p v-if="successMsg" class="bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] p-3 text-center mb-6 uppercase tracking-widest">
          {{ successMsg }}
        </p>
      </transition>

      <form @submit.prevent="handleSubmit" class="space-y-7">
        
        <template v-if="!isLogin && !isForgotPassword">
          <div class="grid grid-cols-2 gap-6">
            <input v-model="form.firstName" type="text" placeholder="Nombre" required class="input-luxury uppercase">
            <input v-model="form.lastName" type="text" placeholder="Apellido" required class="input-luxury uppercase">
          </div>
          <input v-model="form.phone" type="tel" placeholder="WhatsApp" required class="input-luxury">
        </template>

        <input v-model="form.email" type="email" placeholder="Email" required class="input-luxury lowercase">

        <div v-if="!isForgotPassword" class="space-y-2">
          <div class="relative flex items-center">
            <input :type="showPassword ? 'text' : 'password'" 
                   v-model="form.password" 
                   placeholder="Contraseña" required 
                   class="input-luxury pr-12">
            <button type="button" @click="showPassword = !showPassword" class="eye-btn">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>

          <div v-if="isLogin" class="flex justify-end">
            <button type="button" @click="setMode('forgot')" class="forgot-link">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <div v-if="!isLogin && !isForgotPassword" class="space-y-2">
          <div class="relative flex items-center">
            <input :type="showConfirmPassword ? 'text' : 'password'" 
                   v-model="form.confirmPassword" 
                   placeholder="Confirmar Contraseña" required 
                   :class="{'border-red-500/70': !passwordsMatch && form.confirmPassword}"
                   class="input-luxury pr-12">
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="eye-btn">
               <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading || !isFormValid" class="btn-luxury">
          <span v-if="loading" class="animate-pulse">Procesando...</span>
          <span v-else>
            {{ isForgotPassword ? 'Enviar Enlace' : (isLogin ? 'Entrar' : 'Crear Cuenta') }}
          </span>
        </button>

      </form>

      <footer class="mt-10 text-center border-t border-brand-white/10 pt-8">
        <button @click="setMode(isForgotPassword || !isLogin ? 'login' : 'register')" class="text-link">
          {{ isForgotPassword || !isLogin ? 'Volver al Inicio de Sesión' : '¿Deseas una cuenta? Únete a Cushion' }}
        </button>
      </footer>

    </div>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

/* Unificamos el ancho aquí */
.input-luxury {
  @apply w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury 
         focus:outline-none focus:border-brand-gold transition-all duration-500 
         tracking-[0.1em];
}

/* El placeholder sí lo mantenemos en mayúsculas para estética */
.input-luxury::placeholder {
  @apply uppercase text-[10px] tracking-[0.2em] opacity-50;
}

.btn-luxury {
  @apply w-full bg-brand-white text-brand-black px-6 py-4 uppercase text-[10px] font-bold tracking-[0.3em] 
         hover:bg-brand-gold hover:text-brand-white transition-all duration-500 mt-6 
         disabled:opacity-20 disabled:cursor-not-allowed shadow-lg;
}

.eye-btn {
  @apply absolute right-0 text-brand-white/40 hover:text-brand-gold transition-colors p-2;
}

.forgot-link {
  @apply text-[9px] text-brand-white/30 hover:text-brand-gold uppercase tracking-[0.15em] transition-colors italic mt-2;
}

.text-link {
  @apply text-brand-white/40 hover:text-brand-gold text-[10px] font-sans-luxury uppercase tracking-[0.2em] transition-all duration-300;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>