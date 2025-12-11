// src/stores/cart.js
import { defineStore } from 'pinia'

// Definición del store 'cart'
export const useCartStore = defineStore('cart', {
  state: () => ({
    // Array para almacenar los productos en el carrito
    items: [], 
  }),
  
  getters: {
    // Getter: Devuelve la cantidad total de productos (sumando las cantidades)
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    // Getter: Devuelve el valor total de la compra
    cartTotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2),
  },
  
  actions: {
    // Acción: Añadir un producto al carrito
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        // Si ya existe, solo aumenta la cantidad
        existingItem.quantity++;
      } else {
        // Si es nuevo, añade el producto con cantidad 1
        this.items.push({ ...product, quantity: 1 });
      }
    },
    // Nota: Aquí se añadirían otras acciones (removeItem, updateQuantity, etc.)
  },
})