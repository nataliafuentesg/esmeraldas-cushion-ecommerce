import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('cushion_user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/clients/login', { email, password });
        this.user = response.data;
        localStorage.setItem('cushion_user', JSON.stringify(this.user));
        return true;
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    async register(userData) {
      try {
        const response = await api.post('/clients/register', userData);
        this.user = response.data;
        localStorage.setItem('cushion_user', JSON.stringify(this.user));
        return true;
      } catch (error) {
        console.error("Error en registro:", error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('cushion_user');
    }
  }
});