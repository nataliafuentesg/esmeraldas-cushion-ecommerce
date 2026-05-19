// src/api/axios.js

import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth'; 

const api = axios.create({
  baseURL: 'https://api.cushionjewelry.com/api', 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Detectado token expirado o inválido. Limpiando sesión...");
      
      const authStore = useAuthStore();
      authStore.logout();
      
      router.push('/auth?reason=expired');
    }
    
    return Promise.reject(error);
  }
);

export default api;