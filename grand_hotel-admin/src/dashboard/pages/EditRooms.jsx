import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchRooms, updateRoom } from '../../store/slices/roomsSlice'
import roomService from '../../services/roomService'

// CONSTANTES (identiques à AddRoom)
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

const EditRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { rooms } = useAppSelector((state) => state.rooms)
  const [loading, setLoading] = useState(false)
  const [room, setRoom] = useState(null)
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
    images: [],
    existingImages: []
  })

  // Charger la chambre à modifier
  useEffect(() => {
    const loadRoom = () => {
      const foundRoom = rooms.find(r => r._id === id)
      if (foundRoom) {
        setRoom(foundRoom)
        setFormData({
          name: foundRoom.name || '',
          number: foundRoom.number || '',
          type: foundRoom.type || '',
          category: foundRoom.category || '',
          capacity: foundRoom.capacity || 1,
          price: foundRoom.price?.toString() || '',
          size: foundRoom.size || '',
          bedType: foundRoom.bedType || '',
          status: foundRoom.status || 'disponible',
          description: foundRoom.description || '',
          amenities: foundRoom.amenities || [],
          images: [],
          existingImages: foundRoom.images || []
        })
        
        console.log('💰 Prix chargé pour modification:', foundRoom.price, 'FCFA')
      }
    }

    // Si les rooms ne sont pas chargées, les charger d'abord
    if (rooms.length === 0) {
      dispatch(fetchRooms()).then(() => {
        loadRoom()
      })
    } else {
      loadRoom()
    }
  }, [id, rooms, dispatch])

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

  // Fonction de mise à jour de la chambre
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    const toastId = toast.loading('Modification de la chambre en cours...')

    try {
      const submitFormData = new FormData()
      
      // Ajouter les champs texte
      submitFormData.append('name', formData.name)
      submitFormData.append('number', formData.number)
      submitFormData.append('type', formData.type)
      submitFormData.append('category', formData.category)
      submitFormData.append('capacity', formData.capacity.toString())
      submitFormData.append('price', formData.price.toString())
      submitFormData.append('size', formData.size)
      submitFormData.append('bedType', formData.bedType)
      submitFormData.append('status', formData.status)
      submitFormData.append('description', formData.description)
      
      // ✅ DÉSACTIVER EXPLICITEMENT LES RÉDUCTIONS
      submitFormData.append('applyDiscount', 'false')
      submitFormData.append('discountPercentage', '0')
      submitFormData.append('originalPrice', formData.price.toString())
      submitFormData.append('forceExactPrice', 'true')
      
      // Ajouter les équipements
      formData.amenities.forEach(amenity => {
        submitFormData.append('amenities', amenity)
      })

      // Ajouter les images existantes
      formData.existingImages.forEach((image, index) => {
        submitFormData.append('existingImages', image)
      })

      // Ajouter les nouvelles images
      formData.images.forEach((image, index) => {
        if (image.file) {
          submitFormData.append('images', image.file)
        }
      })

      console.log('📤 Modification de la chambre:', formData.name)
      console.log('💰 Prix envoyé:', formData.price, 'FCFA (sans réduction)')
      console.log('📁 Images existantes:', formData.existingImages.length)
      console.log('📁 Nouvelles images:', formData.images.length)

      // Appel au service de mise à jour
      const result = await dispatch(updateRoom({ id, roomData: submitFormData })).unwrap()
      
      toast.dismiss(toastId)
      toast.success(`Chambre "${formData.name}" modifiée avec succès !`)
      
      console.log('✅ Réponse backend - Chambre modifiée:', result)

      // Vérifier le prix final
      if (result.chambre) {
        const finalPrice = result.chambre.price
        const enteredPrice = parseFloat(formData.price)
        
        if (finalPrice !== enteredPrice) {
          console.warn(`⚠️ Attention: Prix final (${finalPrice}) différent du prix entré (${enteredPrice})`)
          toast.warning('Le prix a été modifié par le système. Vérifiez la configuration des réductions.')
        } else {
          console.log('✅ Prix conservé correctement:', finalPrice, 'FCFA')
        }
      }

      // Nettoyer les URLs blob temporaires
      formData.images.forEach(img => {
        if (img.url?.startsWith('blob:')) {
          URL.revokeObjectURL(img.url)
        }
      })

      // Redirection après succès
      setTimeout(() => {
        navigate('/dashboard/rooms')
      }, 1500)

    } catch (error) {
      toast.dismiss(toastId)
      
      console.error('💥 Erreur modification chambre:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      })
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur inconnue'
      
      if (errorMessage.includes('numéro existe déjà')) {
        toast.error(`Le numéro de chambre "${formData.number}" existe déjà`)
      } else if (errorMessage.includes('Non autorisé') || errorMessage.includes('401')) {
        toast.error('Session expirée, veuillez vous reconnecter')
        setTimeout(() => navigate('/login'), 2000)
      } else if (errorMessage.includes('403')) {
        toast.error('Accès refusé - Droits administrateur requis')
      } else if (errorMessage.includes('400')) {
        toast.error('Données invalides, vérifiez les champs')
      } else {
        toast.error(`Erreur lors de la modification: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Gestion des équipements
  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  // Gestion des nouvelles images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024
      
      if (!isValidType) {
        toast.error('Seuls les fichiers JPG, JPEG et PNG sont autorisés')
        return false
      }
      
      if (!isValidSize) {
        toast.error('La taille du fichier ne doit pas dépasser 10MB')
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    const newImages = validFiles.map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      alt: `${formData.name || 'Chambre'} - Nouvelle image ${formData.images.length + index + 1}`,
      file: file,
      isPrimary: formData.images.length === 0 && formData.existingImages.length === 0 && index === 0,
      order: formData.images.length + index,
      isNew: true
    }))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))

    toast.success(`${validFiles.length} nouvelle(s) image(s) ajoutée(s)`)

    if (validFiles.length < files.length) {
      toast.warning(`${files.length - validFiles.length} fichier(s) invalide(s) ignoré(s)`)
    }
  }

  // Supprimer une image existante
  const removeExistingImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== imageUrl)
    }))
    toast.success('Image existante supprimée')
  }

  // Supprimer une nouvelle image
  const removeNewImage = (imageId) => {
    setFormData(prev => {
      const imageToRemove = prev.images.find(img => img.id === imageId)
      if (imageToRemove?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      
      const newImages = prev.images.filter(img => img.id !== imageId)
      
      return {
        ...prev,
        images: newImages
      }
    })
    toast.success('Nouvelle image supprimée')
  }

  // Définir l'image principale
  const setPrimaryImage = (imageType, imageId) => {
    if (imageType === 'existing') {
      // Pour les images existantes, on ne peut que marquer laquelle est principale
      // La logique réelle dépendra de votre backend
      toast.info('Image principale définie parmi les images existantes')
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.map(img => ({
          ...img,
          isPrimary: img.id === imageId
        }))
      }))
      toast.success('Nouvelle image principale définie')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumberChange = (field, value) => {
    const numericValue = value === '' ? '' : parseFloat(value)
    if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleCancel = () => {
    // Nettoyer les URLs blob temporaires
    formData.images.forEach(img => {
      if (img.url?.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
    })

    if (window.confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
      navigate('/dashboard/rooms')
    }
  }

  if (!room) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la chambre...</p>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Modifier la Chambre</h1>
            <p className="text-gray-600">Modifiez les informations de {room.name}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Modification...' : 'Modifier la Chambre'}</span>
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
            <h2 className="text-xl font-semibold mb-4">
              Images de la Chambre
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({formData.existingImages.length + formData.images.length} image(s))
              </span>
            </h2>
            
            {/* Images existantes */}
            {formData.existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Images existantes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${formData.name} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image)}
                          className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer l'image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                        Existante {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zone d'upload pour nouvelles images */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Ajouter de nouvelles images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 inline-block"
              >
                Parcourir les fichiers
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG jusqu'à 10MB</p>
            </div>

            {/* Aperçu des nouvelles images */}
            {formData.images.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Nouvelles images</h3>
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
                            onClick={() => setPrimaryImage('new', image.id)}
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
                          onClick={() => removeNewImage(image.id)}
                          className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer l'image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                        Nouvelle {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
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
                <span>Images existantes:</span>
                <span className="font-semibold">{formData.existingImages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Nouvelles images:</span>
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
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditRoom