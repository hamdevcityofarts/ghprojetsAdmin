import axios from 'axios';

const API_URL = process.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class PaymentService {
  // 🔹 Obtenir tous les paiements (Admin)
  async getPayments() {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des paiements');
    }
  }

  // 🔹 Obtenir les statistiques
  async getPaymentStats() {
    try {
      const response = await api.get('/payments/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  }

  // 🔹 Obtenir un paiement par ID
  async getPaymentById(id) {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Paiement non trouvé');
    }
  }

  // 🔹 Traiter un paiement Cybersource
  async processPayment(paymentData) {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du traitement du paiement');
    }
  }

  // 🔹 Simulation de paiement (développement)
  async mockPayment(reservationId, amount = null) {
    try {
      const response = await api.post('/payments/mock', {
        reservationId,
        amount
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la simulation');
    }
  }

  // 🔹 Remboursement
  async refundPayment(paymentId, amount = null, reason = '') {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, {
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du remboursement');
    }
  }

  // 🔹 Télécharger reçu PDF
  async downloadReceipt(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}/receipt`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement');
    }
  }

  // 🔹 Envoyer un reçu par email
  async sendReceipt(paymentId) {
    try {
      const response = await api.post(`/payments/${paymentId}/send-receipt`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du reçu');
    }
  }

  // 🔹 Vérifier le statut d'un paiement Cybersource
  async checkPaymentStatus(transactionId) {
    try {
      const response = await api.get(`/payments/check-status/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut');
    }
  }

  // 🔹 Obtenir l'historique des paiements pour une réservation
  async getPaymentsByReservation(reservationId) {
    try {
      const response = await api.get(`/payments/reservation/${reservationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'historique');
    }
  }

  // 🔹 Exporter les paiements (CSV)
  async exportPayments(filters = {}) {
    try {
      const response = await api.post('/payments/export', filters, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'export');
    }
  }

  // ✅ FORMATER LE MONTANT EN XAF
  formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  }

  // ✅ AFFICHER LE SYMBOLE XAF
  getCurrencySymbol() {
    return 'FCFA';
  }
}

export default new PaymentService();