import { defineStore } from 'pinia';
import api from '@/api/axios';
import { v4 as uuidv4 } from 'uuid';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0,
    isOffCanvasOpen: false,
    sessionId: localStorage.getItem('cart_session') || null,
    // Nombres de piezas removidas por falta de stock (para mostrar aviso en la UI)
    removedDueToStock: [],
  }),

  actions: {
    async initSession() {
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
        console.error('Error cargando carrito');
      }
    },

    /**
     * Recarga el carrito y elimina automÃ¡ticamente las piezas que ya no
     * tienen stock disponible. Los nombres de las piezas eliminadas quedan
     * en `removedDueToStock` para que la UI pueda mostrar un aviso.
     */
    async syncWithStock() {
      if (!this.sessionId) return;
      await this.loadCart();

      const outOfStock = this.items.filter(
        (item) => item.stock !== undefined && item.stock === 0
      );

      for (const item of outOfStock) {
        try {
          await api.post(`/cart/${this.sessionId}/add`, {
            productId: item.productId,
            quantity: -item.quantity,
          });
          this.removedDueToStock.push(item.productName || 'Pieza');
        } catch (e) {
          console.error('Error removiendo item sin stock:', item.productName);
        }
      }

      if (outOfStock.length > 0) {
        await this.loadCart();
      }
    },

    clearRemovedDueToStock() {
      this.removedDueToStock = [];
    },

    async addItem(product, quantity, selectedSize = null) {
      if (!this.sessionId) await this.initSession();
      try {
        const res = await api.post(`/cart/${this.sessionId}/add`, {
          productId: product.id,
          quantity: quantity,
          selectedSize: selectedSize,
        });
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (e) {
        console.error('Error al aÃ±adir producto');
      }
    },

    async updateQuantity(productId, delta) {
      const item = this.items.find((i) => i.productId === productId);
      if (!item) return;

      const newQty = item.quantity + delta;
      if (newQty < 1) return;
      if (delta > 0 && item.stock !== undefined && newQty > item.stock) {
        alert('Lo sentimos, no hay mÃ¡s existencias disponibles.');
        return;
      }

      try {
        const res = await api.post(`/cart/${this.sessionId}/add`, {
          productId: productId,
          quantity: delta,
        });
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (e) {
        console.error('Error al actualizar: Posible falta de stock en servidor');
      }
    },

    async removeItem(productId) {
      const item = this.items.find((i) => i.productId === productId);
      if (!item) return;
      try {
        await api.post(`/cart/${this.sessionId}/add`, {
          productId: productId,
          quantity: -item.quantity,
        });
        await this.loadCart();
      } catch (e) {
        console.error('Error al eliminar item');
      }
    },

    async clearCart() {
      try {
        await api.delete(`/cart/${this.sessionId}`);
        this.items = [];
        this.total = 0;
      } catch (e) {
        console.error('Error al vaciar carrito');
      }
    },
  },
});
