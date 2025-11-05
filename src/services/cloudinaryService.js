// src/services/cloudinaryService.js
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // ⬅️ CORRIGÉ
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

class CloudinaryService {
  // ✅ UPLOAD DIRECT VERS CLOUDINARY
  async uploadImage(file) {
    try {
      console.log('☁️ Début upload direct Cloudinary...', file.name);
      console.log('🔧 Configuration:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET ? '✅ Configurée' : '❌ Manquante'
      });

      // ✅ VALIDATION DES VARIABLES (API_KEY plus nécessaire)
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Configuration Cloudinary incomplète. Vérifiez les variables d\'environnement.');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'grand-hotel/rooms');
      // ⚠️ NE PAS ajouter api_key ou timestamp pour unsigned!
      
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload: ${percent}%`);
        }
      });

      console.log('✅ Upload Cloudinary réussi:', response.data);
      return {
        url: response.data.secure_url,
        cloudinaryId: response.data.public_id,
        width: response.data.width,
        height: response.data.height,
        format: response.data.format
      };
    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error);
      throw new Error(`Échec upload image: ${error.message}`);
    }
  }

  // ✅ UPLOAD MULTIPLE (reste identique)
  async uploadMultipleImages(files) {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  // ✅ OPTIMISATION IMAGE (reste identique)
  async optimizeAndUploadImage(file) {
    const optimizedFile = await this.optimizeImage(file);
    return this.uploadImage(optimizedFile);
  }

  optimizeImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxWidth = 1200;
          const scale = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          }, 'image/jpeg', 0.75);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}

export default new CloudinaryService();