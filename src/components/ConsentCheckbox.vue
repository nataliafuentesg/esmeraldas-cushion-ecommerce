<script setup>
import { RouterLink } from 'vue-router';
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();

defineProps({ modelValue: { type: Boolean, default: false } });
defineEmits(['update:modelValue']);
</script>

<template>
  <label class="flex items-start gap-2.5 cursor-pointer text-left">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      required
      class="mt-0.5 w-4 h-4 accent-brand-gold cursor-pointer shrink-0"
    >
    <span class="text-brand-white/50 text-[11px] font-sans-luxury leading-relaxed">
      {{ L.t('consent.text') }}
      <RouterLink to="/privacidad" target="_blank"
        class="text-brand-gold hover:opacity-80 underline underline-offset-2">
        {{ L.t('consent.link') }}
      </RouterLink>.
    </span>
  </label>
</template>
