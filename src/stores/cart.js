// src/stores/cart.js

import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOffCanvasOpen: false, // ¡Asegúrate de que este estado existe!
  }),
  getters: {
    cartTotal: (state) => state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    cartCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
  },
  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
      this.isOffCanvasOpen = true; 
    },
    removeItem(productId) {
      this.items = this.items.filter(item => item.product.id !== productId);
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeItem(productId);
        }
      }
    },
    
    // 📢 CLAVE: ASEGÚRATE DE QUE ESTA ACCIÓN ESTÉ PRESENTE
    toggleOffCanvas() { 
      this.isOffCanvasOpen = !this.isOffCanvasOpen;
    }
  },
});