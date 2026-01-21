import { defineStore } from 'pinia';
import api from '@/api/axios';
import { v4 as uuidv4 } from 'uuid'; // Esto es lo que causaba el error

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0,
    sessionId: localStorage.getItem('cart_session') || null
  }),

  actions: {
    async initSession() {
      // Si el usuario entra por primera vez, le asignamos su "ID de maleta"
      if (!this.sessionId) {
        this.sessionId = uuidv4();
        localStorage.setItem('cart_session', this.sessionId);
      }
      await this.loadCart();
    },

    async loadCart() {
      if (!this.sessionId) return;
      try {
        const res = await api.get(`/cart/${this.sessionId}`);
        this.items = res.data.items || [];
        this.total = res.data.total || 0;
      } catch (e) {
        console.error("Error cargando carrito desde el back");
      }
    },

    async addItem(product, quantity) {
      if (!this.sessionId) await this.initSession();
      
      try {
        const res = await api.post(`/cart/${this.sessionId}/add`, {
          productId: product.id,
          quantity: quantity
        });
        
        // El backend nos devuelve el carrito actualizado con los precios y totales
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (e) {
        console.error("Error al persistir el item en el back");
      }
    }
  }
});