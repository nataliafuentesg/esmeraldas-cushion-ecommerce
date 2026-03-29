import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null, 
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    async login(email, password) {
      try {
        const sessionId = localStorage.getItem('cart_session');
        const response = await api.post(`/clients/login?sessionId=${sessionId || ''}`, {
          email,
          password
        });
        const userData = response.data;
        this.user = userData;
        this.token = userData.token; 
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token); 
        return userData;
      } catch (error) {
        throw error;
      }
    },

    async register(formData) {
      try {
        const response = await api.post('/clients/register', formData);
        const userData = response.data;
        this.user = userData;
        this.token = userData.token;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        return userData;
      } catch (error) {
        throw error;
      }
    },

    // --- NUEVO: Solicitar recuperación ---
    async forgotPassword(email) {
      try {
        // Llama al endpoint que genera el token en el backend
        await api.post('/clients/forgot-password', { email });
      } catch (error) {
        throw error;
      }
    },

    // --- NUEVO: Ejecutar el cambio de contraseña ---
    async resetPassword(token, newPassword) {
      try {
        // Envía el token de la URL y la nueva clave al backend
        await api.post('/clients/reset-password', { 
          token, 
          password: newPassword 
        });
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});