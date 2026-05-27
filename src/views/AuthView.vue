<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue'; // 👈 Centralizamos el uso de Iconify

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// --- ESTADOS DE INTERFAZ ---
const isLogin = ref(true);
const isForgotPassword = ref(false);
const loading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errorMsg = ref('');
const successMsg = ref('');

// ✨ NOTIFICACIÓN ELEGANTE DE SESIÓN EXPIRADA
const showExpiryToast = ref(false);

// --- MODELO DEL FORMULARIO ---
const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// --- CAPTURAR EXPIRACIÓN AL MONTAR ---
onMounted(() => {
  // Si venimos expulsados por el guardián de Axios interceptor (?reason=expired)
  if (route.query.reason === 'expired') {
    showExpiryToast.value = true;
    
    // Limpiamos la URL de inmediato para estética y evitar que reaparezca si recargan
    router.replace({ query: null });

    // Desvanece el aviso automáticamente a los 5 segundos
    setTimeout(() => {
      showExpiryToast.value = false;
    }, 5000);
  }
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
  <div class="bg-brand-black min-h-screen pt-28 pb-20 flex items-center justify-center px-4 relative">
    <div class="w-full max-w-md border border-brand-white/10 p-8 md:p-12 bg-brand-black/50 backdrop-blur-sm shadow-2xl">
      
      <header class="mb-10 text-center">
        <h1 class="text-3xl font-serif-elegant text-brand-white tracking-wide">
          <span v-if="isForgotPassword">Recuperar</span>
          <span v-else>{{ isLogin ? 'Ingresar' : 'Registro' }}</span>
        </h1>
        <div class="h-[1px] w-12 bg-brand-gold mx-auto mt-4"></div>
      </header>

      <transition name="fade">
        <p v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-3 text-center mb-6 tracking-wide">
          {{ errorMsg }}
        </p>
      </transition>
      <transition name="fade">
        <p v-if="successMsg" class="bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] p-3 text-center mb-6 tracking-wide">
          {{ successMsg }}
        </p>
      </transition>

      <form @submit.prevent="handleSubmit" class="space-y-7">
        
        <template v-if="!isLogin && !isForgotPassword">
          <div class="grid grid-cols-2 gap-6">
            <input v-model="form.firstName" type="text" placeholder="Nombre" required class="input-luxury">
            <input v-model="form.lastName" type="text" placeholder="Apellido" required class="input-luxury">
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
              <Icon :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
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
              <Icon :icon="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
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

    <Transition name="toast-slide">
      <div v-if="showExpiryToast" 
           class="fixed top-24 right-4 md:right-8 z-50 flex items-center gap-4 px-6 py-4 bg-brand-black/95 border border-brand-gold/40 text-brand-gold shadow-2xl backdrop-blur-md max-w-sm">
        
        <Icon icon="lucide:shield-alert" class="w-5 h-5 shrink-0 text-brand-gold animate-pulse" />
        <div>
          <h4 class="font-serif-elegant tracking-wider text-xs mb-0.5">Sesión Finalizada</h4>
          <p class="font-sans-luxury text-[10px] text-brand-white/70 tracking-wide leading-relaxed">
            Por su seguridad, su sesión ha expirado. Por favor, ingrese nuevamente.
          </p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.input-luxury {
  @apply w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury 
         focus:outline-none focus:border-brand-gold transition-all duration-500 
         tracking-[0.1em];
}

.input-luxury::placeholder {
  @apply text-[10px] tracking-wide opacity-50;
}

.btn-luxury {
  @apply w-full bg-brand-white text-brand-black px-6 py-4 text-[10px] font-bold tracking-[0.3em] 
         hover:bg-brand-gold hover:text-brand-white transition-all duration-500 mt-6 
         disabled:opacity-20 disabled:cursor-not-allowed shadow-lg;
}

.eye-btn {
  @apply absolute right-0 text-brand-white/40 hover:text-brand-gold transition-colors p-2 flex items-center justify-center;
}

.forgot-link {
  @apply text-[9px] text-brand-white/30 hover:text-brand-gold tracking-normal transition-colors italic mt-2;
}

.text-link {
  @apply text-brand-white/40 hover:text-brand-gold text-[10px] font-sans-luxury tracking-wide transition-all duration-300;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Animación sutil de entrada lateral para el Toast */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>