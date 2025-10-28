import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Intercepteur pour debugger les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
  return config;
});

// Intercepteur pour debugger les réponses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} - Succès:`, response.data);
    return response;
  },
  (error) => {
    console.log(`❌ ${error.config?.url} - Erreur:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const reservationService = {
  // ✅ OBTENIR LES RÉSERVATIONS AVEC PAGINATION
  async getReservations(params = {}) {
    try {
      const { page = 1, limit = 10, status, search } = params;
      
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Ajouter les filtres optionnels
      if (status && status !== 'all') {
        queryParams.append('status', status);
      }
      
      if (search) {
        queryParams.append('search', search);
      }

      console.log(`📋 Chargement page ${page}, limite ${limit}, statut: ${status || 'all'}`);
      
      const response = await api.get(`/reservations?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération réservations:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ OBTENIR TOUTES LES RÉSERVATIONS (sans pagination - pour compatibilité)
  async getAllReservations() {
    try {
      const response = await api.get('/reservations/all');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération toutes les réservations:', error.response?.data || error.message);
      throw error;
    }
  },

  // Créer une réservation
  async createReservation(reservationData) {
    try {
      console.log('📤 Données envoyées au backend:', reservationData);
      
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur création réservation:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtenir une réservation par ID
  async getReservationById(id) {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération réservation:', error.response?.data || error.message);
      throw error;
    }
  },

  // Modifier une réservation
  async updateReservation(id, reservationData) {
    try {
      const response = await api.put(`/reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur modification réservation:', error.response?.data || error.message);
      throw error;
    }
  },

  // Annuler une réservation - COMPATIBLE AVEC LES DEUX ROUTES
  async cancelReservation(id) {
    try {
      // Essayer d'abord la route /cancel (anglais)
      const response = await api.put(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      // Si échec, essayer la route /annuler (français)
      console.log('🔄 Tentative avec route /annuler...');
      const response = await api.put(`/reservations/${id}/annuler`);
      return response.data;
    }
  },

  // Confirmer une réservation (admin)
  async confirmReservation(id) {
    try {
      const response = await api.put(`/reservations/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur confirmation réservation:', error.response?.data || error.message);
      throw error;
    }
  },

  // Simuler un paiement
  async mockPayment(reservationId) {
    try {
      const response = await api.post('/payments/mock', { reservationId });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur paiement:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ FORMATER LE MONTANT EN XAF
  formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  },

  // ✅ AFFICHER LE SYMBOLE XAF
  getCurrencySymbol() {
    return 'FCFA';
  },

  // ✅ STATISTIQUES DES RÉSERVATIONS
  async getReservationStats() {
    try {
      const response = await api.get('/reservations/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ RECHERCHE AVANCÉE AVEC PAGINATION
  async searchReservations(searchParams) {
    try {
      const { query, status, dateFrom, dateTo, page = 1, limit = 10 } = searchParams;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (query) queryParams.append('search', query);
      if (status && status !== 'all') queryParams.append('status', status);
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      console.log(`🔍 Recherche réservations:`, { query, status, dateFrom, dateTo, page, limit });
      
      const response = await api.get(`/reservations/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur recherche réservations:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default reservationService;