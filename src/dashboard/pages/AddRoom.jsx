import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  Home,
  Users,
  Ruler,
  Bed
} from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useAppDispatch } from '../../hooks'
import { createRoom } from '../../store/slices/roomsSlice'
import roomService from '../../services/roomService'
import cloudinaryService from '../../services/cloudinaryService' // ✅ NOUVEAU IMPORT

// CONSTANTES (inchangées)
const roomTypes = [
  { value: 'standard', label: 'Chambre Standard' },
  { value: 'superior', label: 'Chambre Supérieure' },
  { value: 'deluxe', label: 'Chambre Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'family', label: 'Chambre Familiale' },
  { value: 'executive', label: 'Suite Exécutive' },
  { value: 'presidential', label: 'Suite Présidentielle' }
]

const roomCategories = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'triple', label: 'Triple' },
  { value: 'quad', label: 'Quadruple' },
  { value: 'family', label: 'Familiale' }
]

const bedTypes = [
  { value: 'single_bed', label: '1 lit simple' },
  { value: 'double_bed', label: '1 lit double' },
  { value: 'twin_beds', label: '2 lits simples' },
  { value: 'double_twin', label: '1 lit double + 1 lit simple' },
  { value: 'king_bed', label: '1 lit king size' },
  { value: 'queen_bed', label: '1 lit queen size' },
  { value: 'sofa_bed', label: 'Canapé-lit' },
  { value: 'bunk_bed', label: 'Lits superposés' }
]

const allAmenities = [
  { id: 'wifi', label: 'WiFi haute vitesse', icon: '📶' },
  { id: 'tv', label: 'TV écran plat', icon: '📺' },
  { id: 'ac', label: 'Climatisation', icon: '❄️' },
  { id: 'heating', label: 'Chauffage', icon: '🔥' },
  { id: 'minibar', label: 'Mini-bar', icon: '🍷' },
  { id: 'safe', label: 'Coffre-fort', icon: '🔒' },
  { id: 'balcony', label: 'Balcon', icon: '🌅' },
  { id: 'view', label: 'Vue mer/montagne', icon: '🏞️' },
  { id: 'room_service', label: 'Room service', icon: '🍽️' },
  { id: 'jacuzzi', label: 'Jacuzzi', icon: '🛁' },
  { id: 'shower', label: 'Douche italienne', icon: '🚿' },
  { id: 'bathrobe', label: 'Peignoirs', icon: '👘' },
  { id: 'slippers', label: 'Chaussons', icon: '🩴' },
  { id: 'desk', label: 'Bureau', icon: '💻' },
  { id: 'sofa', label: 'Canapé', icon: '🛋️' },
  { id: 'kitchenette', label: 'Kitchenette', icon: '🍳' },
  { id: 'tea_coffee', label: 'Thé/Café', icon: '☕' },
  { id: 'iron', label: 'Fer à repasser', icon: '🧺' },
  { id: 'hair_dryer', label: 'Sèche-cheveux', icon: '💇' },
  { id: 'accessible', label: 'Accès handicapé', icon: '♿' }
]

const AddRoom = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    type: '',
    category: '',
    capacity: 1,
    price: '',
    size: '',
    bedType: '',
    status: 'disponible',
    description: '',
    amenities: [],
    images: []
  })

  // ✅ FONCTION DE COMPRESSION D'IMAGES
  const optimizeImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // ⭐ RÉDUIRE LA TAILLE (max 1200px de large)
          const maxWidth = 1200;
          const scale = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // ⭐ COMPRESSION à 75% de qualité
          canvas.toBlob((blob) => {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            console.log(`📊 Compression: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(blob.size / 1024 / 1024).toFixed(2)}MB (${Math.round((1 - blob.size / file.size) * 100)}% réduit)`);
            
            resolve(optimizedFile);
          }, 'image/jpeg', 0.75); // 75% qualité
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const validateForm = () => {
    const requiredFields = ['name', 'number', 'type', 'category', 'capacity', 'price', 'bedType']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return false
    }

    const priceValue = parseFloat(formData.price)
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Le prix doit être un nombre supérieur à 0')
      return false
    }

    const capacityValue = parseInt(formData.capacity)
    if (isNaN(capacityValue) || capacityValue < 1 || capacityValue > 10) {
      toast.error('La capacité doit être entre 1 et 10 personnes')
      return false
    }

    return true
  }

  // ✅ NOUVELLE FONCTION : Upload direct Cloudinary
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setUploading(true);
    const toastId = toast.loading('Création de la chambre en cours...');

    try {
      // ✅ ÉTAPE 1: UPLOAD DES IMAGES DIRECTEMENT VERS CLOUDINARY
      let uploadedImages = [];
      const imagesToUpload = formData.images.filter(img => img.file);
      
      if (imagesToUpload.length > 0) {
        toast.loading(`Upload de ${imagesToUpload.length} image(s) vers Cloudinary...`);
        
        // Upload vers Cloudinary
        const uploadResults = await cloudinaryService.uploadMultipleImages(
          imagesToUpload.map(img => img.file)
        );
        
        // Transformer les résultats en format d'images
        uploadedImages = uploadResults.map((result, index) => ({
          url: result.url,
          cloudinaryId: result.cloudinaryId,
          alt: `${formData.name || 'Chambre'} - Image ${index + 1}`,
          isPrimary: index === 0,
          order: index
        }));
        
        console.log('✅ Images uploadées sur Cloudinary:', uploadedImages);
        toast.success(`${uploadedImages.length} image(s) uploadée(s) avec succès`);
      }

      // ✅ ÉTAPE 2: PRÉPARER LES DONNÉES SANS FILES
      const roomData = {
        number: formData.number,
        name: formData.name,
        type: formData.type,
        category: formData.category,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        size: formData.size,
        bedType: formData.bedType,
        status: formData.status,
        description: formData.description,
        amenities: formData.amenities,
        images: uploadedImages, // ✅ URLs Cloudinary directement
        applyDiscount: false,
        discountPercentage: 0,
        originalPrice: parseFloat(formData.price)
      };

      console.log('📤 Envoi données chambre au backend:', roomData);

      // ✅ ÉTAPE 3: ENVOYER AU BACKEND (SANS IMAGES)
      const result = await roomService.createRoom(roomData);
      
      toast.dismiss(toastId);
      toast.success(`Chambre "${formData.name}" créée avec succès !`);
      
      console.log('✅ Réponse backend:', result.data);

      // Nettoyer les URLs blob temporaires
      formData.images.forEach(img => {
        if (img.url?.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });

      // Redirection
      setTimeout(() => {
        navigate('/dashboard/rooms');
      }, 1500);

    } catch (error) {
      toast.dismiss(toastId);
      
      console.error('💥 Erreur détaillée:', error);
      
      if (error.message.includes('Échec upload image')) {
        toast.error('Erreur lors de l\'upload des images vers Cloudinary');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Erreur inconnue';
        toast.error(`Erreur lors de la création: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  // Autres fonctions (inchangées)
  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  // ✅ FONCTION UPLOAD AVEC COMPRESSION
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB max avant compression
      
      if (!isValidType) {
        toast.error('Seuls les fichiers JPG, JPEG, PNG et WebP sont autorisés')
        return false
      }
      
      if (!isValidSize) {
        toast.error('La taille du fichier ne doit pas dépasser 10MB')
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    setCompressing(true)
    const compressToastId = toast.loading(`Compression de ${validFiles.length} image(s)...`)

    try {
      // ⭐ COMPRESSER TOUTES LES IMAGES
      const optimizedFiles = await Promise.all(
        validFiles.map(file => optimizeImage(file))
      )

      const newImages = optimizedFiles.map((file, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        alt: `${formData.name || 'Chambre'} - Image ${formData.images.length + index + 1}`,
        file: file,
        isPrimary: formData.images.length === 0 && index === 0,
        order: formData.images.length + index,
        compressed: true // Marquer comme compressé
      }))
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))

      toast.dismiss(compressToastId)
      
      // Calculer la réduction totale
      const totalOriginalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
      const totalCompressedSize = optimizedFiles.reduce((sum, file) => sum + file.size, 0)
      const reductionPercent = Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)
      
      toast.success(`${validFiles.length} image(s) compressée(s) - ${reductionPercent}% économisé`)

      if (validFiles.length < files.length) {
        toast.warning(`${files.length - validFiles.length} fichier(s) invalide(s) ignoré(s)`)
      }
    } catch (error) {
      toast.dismiss(compressToastId)
      console.error('❌ Erreur compression:', error)
      toast.error('Erreur lors de la compression des images')
    } finally {
      setCompressing(false)
    }
  }

  const removeImage = (imageId) => {
    setFormData(prev => {
      const imageToRemove = prev.images.find(img => img.id === imageId)
      if (imageToRemove?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      
      const newImages = prev.images.filter(img => img.id !== imageId)
      
      if (imageToRemove?.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true
      }
      
      return {
        ...prev,
        images: newImages
      }
    })
    toast.success('Image supprimée')
  }

  const setPrimaryImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    }))
    toast.success('Image principale définie')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumberChange = (field, value) => {
    // Validation pour le prix - accepter uniquement des nombres positifs
    if (field === 'price') {
      const numericValue = value === '' ? '' : parseFloat(value)
      if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }))
      }
    } else {
      const numericValue = value === '' ? '' : parseFloat(value)
      if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }))
      }
    }
  }

  const handleResetForm = () => {
    formData.images.forEach(img => {
      if (img.url?.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
    })

    setFormData({
      name: '',
      number: '',
      type: '',
      category: '',
      capacity: 1,
      price: '',
      size: '',
      bedType: '',
      status: 'disponible',
      description: '',
      amenities: [],
      images: []
    })
    toast.success('Formulaire réinitialisé')
  }

  const handleCancel = () => {
    formData.images.forEach(img => {
      if (img.url?.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
    })

    if (formData.name || formData.number || formData.images.length > 0) {
      if (window.confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
        navigate('/dashboard/rooms')
      }
    } else {
      navigate('/dashboard/rooms')
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ajouter une Chambre</h1>
            <p className="text-gray-600">Créez une nouvelle chambre dans le système</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading || uploading || compressing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>
            {compressing ? 'Compression...' : uploading ? 'Upload Cloudinary...' : loading ? 'Création...' : 'Créer la Chambre'}
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              Informations de Base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la chambre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Suite Présidentielle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de chambre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 301, A101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de chambre *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un type</option>
                  {roomTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {roomCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Capacité (personnes) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.capacity}
                  onChange={(e) => handleNumberChange('capacity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Surface (m²)
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 25 m²"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez la chambre, ses caractéristiques spéciales, la vue, etc."
            />
          </div>

          {/* Équipements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Équipements & Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allAmenities.map(amenity => (
                <label 
                  key={amenity.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.amenities.includes(amenity.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{amenity.icon} {amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              Images de la Chambre 
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({formData.images.length} image(s))
              </span>
            </h2>
            
            {/* Zone d'upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Glissez-déposez vos images ici ou</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={compressing}
              />
              <label 
                htmlFor="image-upload"
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 inline-block ${compressing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {compressing ? 'Compression en cours...' : 'Parcourir les fichiers'}
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG, WebP jusqu'à 10MB - Compression automatique</p>
              <p className="text-xs text-gray-400 mt-1">
                {formData.images.length === 0 && "Aucune image ? Des images par défaut seront générées automatiquement."}
              </p>
            </div>

            {/* Aperçu des images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                        Principale
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(image.id)}
                          className="bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Définir comme image principale"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer l'image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                      {index + 1}
                    </div>
                    {image.file && (
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                        ✅ Optimisée
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prix et statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <span className="text-green-600 mr-2">FCFA</span>
              Tarification
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix par nuit (FCFA) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={formData.price}
                  onChange={(e) => handleNumberChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le prix saisi sera appliqué exactement sans aucune réduction
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="disponible">Disponible</option>
                  <option value="occupée">Occupée</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="nettoyage">Nettoyage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuration des lits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Bed className="w-4 h-4 mr-2 text-purple-600" />
              Configuration des Lits
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de lit *
              </label>
              <select
                required
                value={formData.bedType}
                onChange={(e) => handleInputChange('bedType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un type de lit</option>
                {bedTypes.map(bed => (
                  <option key={bed.value} value={bed.value}>
                    {bed.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aperçu rapide */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-semibold mb-3 text-blue-900">Aperçu Rapide</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Images:</span>
                <span className="font-semibold">{formData.images.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Équipements:</span>
                <span className="font-semibold">{formData.amenities.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Prix:</span>
                <span className="font-semibold">
                  {formData.price ? `${parseFloat(formData.price).toLocaleString('fr-FR')} FCFA` : 'Non défini'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Statut:</span>
                <span className="font-semibold capitalize">{formData.status}</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button 
                type="button"
                onClick={handleCancel}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button"
                onClick={handleResetForm}
                className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddRoom