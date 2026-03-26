// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://157.180.125.245:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;