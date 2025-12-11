<script setup>
import { Icon } from '@iconify/vue';

const startSearch = () => {
    alert("Iniciando Búsqueda...");
};

const goToProfile = () => {
    alert("Navegando a Mi Cuenta...");
};
</script>

<template>
    <div class="bg-brand-black/70 border-t border-brand-white/10 text-brand-white py-2">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
            
            <div class="flex items-center w-full lg:pr-10 xl:pr-20 lg:pl-10 xl:pl-20">
                
                <button @click="startSearch" 
                        class="flex items-center space-x-2 uppercase font-sans-luxury text-xs 
                                hover:text-brand-gold transition-colors tracking-wider">
                    <Icon icon="lucide:search" class="w-4 h-4" />
                    <span class="hidden sm:block">Búsqueda</span>
                </button>
                
                <button @click="goToProfile" 
                        class="flex items-center space-x-2 uppercase font-sans-luxury text-xs 
                                hover:text-brand-gold transition-colors tracking-wider ml-auto">
                    <Icon icon="lucide:user" class="w-4 h-4" />
                    <span class="hidden sm:block">Mi Cuenta</span>
                </button>
            </div>
            
        </div>
    </div>
</template>