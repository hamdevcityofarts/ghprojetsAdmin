import axios from 'axios';

// URL de base pour l'API
const API_URL = process.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Intercepteur de requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  async login(email, password) {
    try {
      console.log('📤 Envoi login vers /auth/login');
      const response = await api.post('/auth/login', { email, password });
      
      console.log('✅ Réponse reçue:', response.data);
      
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('💥 Erreur authService:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  },

  async getMe() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('💥 Erreur getMe:', error.response?.data);
      throw error;
    }
  },
};

export default authService;