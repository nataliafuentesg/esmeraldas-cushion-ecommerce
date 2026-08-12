<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const token = route.query.token; // Captura el token de la URL

const handleReset = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = L.t("rp.mismatch");
    return;
  }

  loading.value = true;
  try {
    await authStore.resetPassword(token, password.value);
    successMsg.value = L.t("rp.updated");
    setTimeout(() => router.push('/auth'), 3000);
  } catch {
    errorMsg.value = L.t("rp.invalidLink");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-brand-black min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md border border-brand-white/10 p-10 bg-brand-black/50 backdrop-blur-sm">
      <h1 class="text-2xl font-serif-elegant text-brand-white text-center tracking-wide mb-8">
        {{ L.t('rp.title') }}
      </h1>

      <p v-if="errorMsg" class="text-red-400 text-[10px] text-center mb-6 tracking-wide">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-brand-gold text-[10px] text-center mb-6 tracking-wide">{{ successMsg }}</p>

      <form @submit.prevent="handleReset" class="space-y-6">
        <input v-model="password" type="password" :placeholder="L.t('rp.new')" required class="input-luxury">
        <input v-model="confirmPassword" type="password" :placeholder="L.t('rp.confirm')" required class="input-luxury">

        <button type="submit" :disabled="loading" class="btn-luxury">
          {{ loading ? L.t('rp.updating') : L.t('rp.change') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";
.input-luxury { @apply w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm focus:outline-none focus:border-brand-gold transition-all; }
.btn-luxury { @apply w-full bg-brand-white text-brand-black py-4 text-[10px] font-bold tracking-wide hover:bg-brand-gold hover:text-brand-white transition-all; }
</style>
