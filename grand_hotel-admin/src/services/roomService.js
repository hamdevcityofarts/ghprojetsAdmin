import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Intercepteur pour l'authentification
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

const roomService = {
  // ✅ CRÉATION AVEC FORM DATA
  async createRoom(formData) {
    try {
      console.log('📤 Envoi FormData au backend...');
      const response = await api.post('/chambres', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Réponse création chambre:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur création chambre:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllRooms() {
    try {
      const response = await api.get('/chambres');
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getRoomById(id) {
    try {
      const response = await api.get(`/chambres/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async updateRoom(id, roomData) {
    try {
      const response = await api.put(`/chambres/${id}`, roomData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async deleteRoom(id) {
    try {
      const response = await api.delete(`/chambres/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload séparé (pour autres usages)
  async uploadRoomImage(formData) {
    try {
      const response = await api.post('/chambres/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async uploadMultipleRoomImages(formData) {
    try {
      const response = await api.post('/chambres/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteRoomImage(filename) {
    try {
      const response = await api.delete(`/chambres/images/${filename}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Images par défaut
  generateDefaultImages(roomType, roomName) {
    const imageCollections = {
      standard: ['1566664482983-ccf19b83f6c0', '1586023493607-b0a0e59cb41e'],
      superior: ['1564078516393-c71ca5295b6c', '1586105251260-482500eaae4e'],
      deluxe: ['1590490396147-69e04c41c09d', '1568495248632-6f6c5a3b9d60'],
      family: ['1578683010233-3961fc51e0a6', '1590490363607-169912429829'],
      suite: ['1595576508833-50ded48d3426', '1568495248636-6c5a3b9d6b0c'],
      executive: ['1595576508833-50ded48d3426', '1568495248636-6c5a3b9d6b0c'],
      presidential: ['1595576508834-50ded48d3427', '1568495248637-6c5a3b9d6b0d']
    };

    const baseUrl = 'https://images.unsplash.com/photo-';
    const collection = imageCollections[roomType] || imageCollections.standard;
    
    return collection.map((photoId, index) => ({
      url: `${baseUrl}${photoId}?w=800&h=600&fit=crop&auto=format`,
      alt: `${roomName} - Image ${index + 1}`,
      isPrimary: index === 0,
      order: index
    }));
  },

  // ✅ FORMATER LE PRIX EN XAF
  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  },

  // ✅ AFFICHER LE SYMBOLE XAF
  getCurrencySymbol() {
    return 'FCFA';
  }
};

export default roomService;