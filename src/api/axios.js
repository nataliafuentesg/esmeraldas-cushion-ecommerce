// src/api/axios.js

import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: 'https://api.cushionjewelry.com/api',
});

// Bandera para evitar múltiples redirects cuando expiran varias
// peticiones simultáneas con el mismo token expirado.
let isRedirecting = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      !isRedirecting &&
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      isRedirecting = true;

      console.warn('[Auth] Token expirado o inválido — cerrando sesión...');

      const authStore = useAuthStore();
      authStore.logout();

      router.push('/auth?reason=expired').finally(() => {
        // Permitir otro redirect después de 3 s (por si el usuario
        // inicia sesión de nuevo y vuelve a expirar).
        setTimeout(() => { isRedirecting = false; }, 3000);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
