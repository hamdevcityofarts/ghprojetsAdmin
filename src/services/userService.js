import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_API_URL + '/utilisateurs';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Debug complet des requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 [USER SERVICE] Requête envoyée:', {
      url: config.url,
      method: config.method,
      token: token ? 'PRÉSENT' : 'MANQUANT'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [USER SERVICE] Headers:', config.headers);
    }
    return config;
  },
  (error) => {
    console.error('❌ [USER SERVICE] Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Debug complet des réponses
api.interceptors.response.use(
  (response) => {
    console.log('✅ [USER SERVICE] Réponse reçue:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('💥 [USER SERVICE] Erreur détaillée:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

const userService = {
  async getAllUsers() {
    try {
      console.log('🔄 [USER SERVICE] Tentative de récupération des utilisateurs...');
      const response = await api.get('/');
      console.log('✅ [USER SERVICE] Utilisateurs récupérés:', response.data.length);
      return response;
    } catch (error) {
      console.error('💥 [USER SERVICE] Erreur complète getAllUsers:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération utilisateur:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post('/', userData);
      return response;
    } catch (error) {
      console.error('❌ Erreur création utilisateur:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/${id}`, userData);
      return response;
    } catch (error) {
      console.error('❌ Erreur mise à jour utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Erreur suppression utilisateur:', error);
      throw error;
    }
  },
};

export default userService;