import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  User,
  Phone,
  Mail,
  Users,
  Bed,
  Loader
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import reservationService from '../../services/reservationService';
import roomService from '../../services/roomService';

const AddReservation = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [chambres, setChambres] = useState([])
  const [loadingChambres, setLoadingChambres] = useState(true)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    paymentMethod: 'card',
    status: 'pending'
  })

  // Fonction de conversion Euro → F CFA
  const convertToCFA = (amountInEuro) => {
    const exchangeRate = 655.957;
    return Math.round(amountInEuro * exchangeRate);
  };

  // Formatage montant F CFA
  const formatAmountCFA = (amountInEuro) => {
    const amountInCFA = convertToCFA(amountInEuro);
    return `${amountInCFA.toLocaleString('fr-FR')} FCFA`;
  };

  // Charger les chambres
  useEffect(() => {
    const loadChambres = async () => {
      try {
        setLoadingChambres(true)
        const response = await roomService.getAllRooms()
        if (response.data.success) {
          setChambres(response.data.chambres)
        }
      } catch (error) {
        console.error('❌ Erreur chargement chambres:', error)
        toast.error('Erreur lors du chargement des chambres')
      } finally {
        setLoadingChambres(false)
      }
    }
    
    loadChambres()
  }, [toast])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Données du formulaire:', formData);
    
    // Validation
    if (!formData.clientName || !formData.clientEmail || !formData.roomId || !formData.checkIn || !formData.checkOut) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation des dates
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    if (checkOutDate <= checkInDate) {
      toast.error('La date de départ doit être après la date d\'arrivée');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('Création de la réservation en cours...');

    try {
      const reservationData = {
        chambreId: formData.roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.adults) + parseInt(formData.children || 0),
        adults: parseInt(formData.adults),
        children: parseInt(formData.children || 0),
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod
      };

      const result = await reservationService.createReservation(reservationData);
      
      if (result.success) {
        toast.dismiss(toastId);
        toast.success('Réservation créée avec succès !');
        
        setTimeout(() => {
          navigate('/dashboard/reservations');
        }, 1500);
      } else {
        throw new Error(result.message || 'Erreur lors de la création');
      }

    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn)
      const checkOut = new Date(formData.checkOut)
      const diffTime = checkOut - checkIn
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 0
    }
    return 0
  }

  const calculateTotal = () => {
    const selectedRoom = chambres.find(chambre => chambre._id === formData.roomId)
    if (selectedRoom) {
      return selectedRoom.price * calculateNights()
    }
    return 0
  }

  if (loadingChambres) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des chambres...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/reservations')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nouvelle Réservation</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {chambres.length} chambre(s) disponible(s)
            </p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading || chambres.length === 0}
          className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Création...' : 'Créer la Réservation'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations client */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informations Client
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom et prénom du client"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          {/* Détails de séjour */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Détails du Séjour
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'arrivée *
                </label>
                <input
                  type="date"
                  required
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de départ *
                </label>
                <input
                  type="date"
                  required
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Adultes *
                </label>
                <select
                  required
                  value={formData.adults}
                  onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} adulte(s)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enfants
                </label>
                <select
                  value={formData.children}
                  onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} enfant(s)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chambre */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 flex items-center">
              <Bed className="w-5 h-5 mr-2 text-purple-600" />
              Sélection de la Chambre
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambre *
              </label>
              {chambres.length === 0 ? (
                <div className="text-center py-4 text-gray-500 border border-gray-200 rounded-lg">
                  Aucune chambre disponible
                </div>
              ) : (
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => handleInputChange('roomId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une chambre</option>
                  {chambres.map(chambre => (
                    <option key={chambre._id} value={chambre._id}>
                      {chambre.number} - {chambre.name} - {formatAmountCFA(chambre.price)}/nuit
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Demandes spéciales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Demandes Spéciales</h2>
            <textarea
              rows="4"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Demandes particulières, allergies, préférences..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Récapitulatif */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <span className="text-lg mr-2">FCFA</span>
              Récapitulatif
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nuits:</span>
                <span className="font-semibold">{calculateNights()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prix par nuit:</span>
                <span className="font-semibold">
                  {formatAmountCFA(chambres.find(c => c._id === formData.roomId)?.price || 0)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">{formatAmountCFA(calculateTotal())}</span>
              </div>
              <div className="text-xs text-gray-500 text-center border-t pt-2">
                Soit {calculateTotal()} €
              </div>
            </div>
          </div>

          {/* Paiement et statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold mb-4">Paiement & Statut</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="card">Carte bancaire</option>
                  <option value="cash">Espèces</option>
                  <option value="transfer">Virement</option>
                  <option value="check">Chèque</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button 
                type="button"
                onClick={() => navigate('/dashboard/reservations')}
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

export default AddReservation