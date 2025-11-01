import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Calendar, User, Bed, Mail, Phone, Users, FileText } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import reservationService from '../../services/reservationService'
import roomService from '../../services/roomService'

const EditReservation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [reservation, setReservation] = useState(null)
  const [chambres, setChambres] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Formatage montant F CFA
  const formatAmountCFA = (amount) => {
    return `${parseFloat(amount).toLocaleString('fr-FR')} FCFA`;
  };

  // Charger la réservation et les chambres
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Charger la réservation
        const reservationResponse = await reservationService.getReservationById(id)
        if (reservationResponse.success) {
          setReservation(reservationResponse.reservation)
        } else {
          throw new Error('Réservation non trouvée')
        }

        // Charger les chambres disponibles
        const chambresResponse = await roomService.getAllRooms()
        if (chambresResponse.data.success) {
          setChambres(chambresResponse.data.chambres)
        }

      } catch (error) {
        console.error('❌ Erreur chargement données:', error)
        toast.error('Erreur lors du chargement des données')
        navigate('/dashboard/reservations')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, navigate, toast])

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!reservation) return

    try {
      setSaving(true)
      
      const response = await reservationService.updateReservation(id, {
        chambreId: reservation.chambre?._id,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        adults: reservation.adults || reservation.guests,
        children: reservation.children || 0,
        specialRequests: reservation.specialRequests,
        status: reservation.status
      })

      if (response.success) {
        toast.success('Réservation modifiée avec succès')
        setIsEditing(false)
        // Recharger les données
        const updatedResponse = await reservationService.getReservationById(id)
        if (updatedResponse.success) {
          setReservation(updatedResponse.reservation)
        }
      } else {
        throw new Error(response.message || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('❌ Erreur modification réservation:', error)
      toast.error(error.message || 'Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  // Annuler une réservation
  const handleCancelReservation = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    try {
      const response = await reservationService.cancelReservation(id)
      if (response.success) {
        toast.success('Réservation annulée avec succès')
        navigate('/dashboard/reservations')
      }
    } catch (error) {
      console.error('❌ Erreur annulation réservation:', error)
      toast.error('Erreur lors de l\'annulation')
    }
  }

  // Confirmer une réservation
  const handleConfirmReservation = async () => {
    try {
      const response = await reservationService.confirmReservation(id)
      if (response.success) {
        toast.success('Réservation confirmée avec succès')
        // Recharger les données
        const updatedResponse = await reservationService.getReservationById(id)
        if (updatedResponse.success) {
          setReservation(updatedResponse.reservation)
        }
      }
    } catch (error) {
      console.error('❌ Erreur confirmation réservation:', error)
      toast.error('Erreur lors de la confirmation')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Réservation non trouvée</h2>
          <button 
            onClick={() => navigate('/dashboard/reservations')}
            className="text-blue-600 hover:text-blue-700"
          >
            Retour aux réservations
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/reservations')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isEditing ? 'Modifier' : 'Détails de'} la Réservation #{reservation._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Créée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Modifier</span>
              </button>
              
              {/* Actions conditionnelles selon le statut */}
              {reservation.status === 'pending' && (
                <button 
                  onClick={handleConfirmReservation}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                >
                  <span>Confirmer</span>
                </button>
              )}
              
              {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                <button 
                  onClick={handleCancelReservation}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
                >
                  <span>Annuler</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
              >
                <span>Annuler</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Badge de statut */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              reservation.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
              reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              reservation.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {reservation.status === 'confirmed' ? 'Confirmée' :
               reservation.status === 'pending' ? 'En attente' :
               reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
            </span>
          </div>
          
          {/* Informations de paiement */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatAmountCFA(reservation.totalAmount)}
            </div>
            <div className="text-sm text-gray-500">
              {reservation.nights} nuit(s)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations client */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Informations Client</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="text-lg font-medium text-gray-900">
                {reservation.client?.name} {reservation.client?.surname}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <div className="text-gray-900">{reservation.client?.email}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Téléphone
                </label>
                <div className="text-gray-900">{reservation.client?.phone || 'Non renseigné'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations séjour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Dates de Séjour</span>
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'arrivée
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={reservation.checkIn?.split('T')[0]}
                    onChange={(e) => setReservation({...reservation, checkIn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de départ
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={reservation.checkOut?.split('T')[0]}
                    onChange={(e) => setReservation({...reservation, checkOut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Nombre de personnes
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Adultes</label>
                    <input
                      type="number"
                      value={reservation.adults || reservation.guests}
                      onChange={(e) => setReservation({...reservation, adults: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Enfants</label>
                    <input
                      type="number"
                      value={reservation.children || 0}
                      onChange={(e) => setReservation({...reservation, children: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-lg font-medium text-gray-900">
                  {reservation.guests} personne(s){reservation.children > 0 && ` (dont ${reservation.children} enfant(s))`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations chambre */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Bed className="w-5 h-5 text-purple-600" />
            <span>Chambre</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambre assignée
              </label>
              {isEditing ? (
                <select
                  value={reservation.chambre?._id}
                  onChange={(e) => {
                    const selectedChambre = chambres.find(c => c._id === e.target.value)
                    setReservation({
                      ...reservation, 
                      chambre: selectedChambre
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une chambre</option>
                  {chambres.map(chambre => (
                    <option key={chambre._id} value={chambre._id}>
                      {chambre.number} - {chambre.name} - {formatAmountCFA(chambre.price)}/nuit
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {reservation.chambre?.number} - {reservation.chambre?.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {reservation.chambre?.type} • {reservation.chambre?.capacity} personne(s)
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              {isEditing ? (
                <select
                  value={reservation.status}
                  onChange={(e) => setReservation({...reservation, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="cancelled">Annulée</option>
                  <option value="completed">Terminée</option>
                </select>
              ) : (
                <div className="text-lg font-medium text-gray-900 capitalize">
                  {reservation.status === 'confirmed' ? 'Confirmée' :
                   reservation.status === 'pending' ? 'En attente' :
                   reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations paiement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <span className="text-green-600 mr-2">FCFA</span>
            <span>Paiement</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant total
              </label>
              <div className="text-2xl font-bold text-gray-900">
                {formatAmountCFA(reservation.totalAmount)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut du paiement
              </label>
              <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                reservation.paiement?.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' :
                reservation.paiement?.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {reservation.paiement?.status === 'paid' ? 'Payé' :
                 reservation.paiement?.status === 'pending' ? 'En attente' : 'Non payé'}
              </div>
            </div>
            
            {reservation.paiement?.transactionId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID
                </label>
                <div className="text-sm font-mono text-gray-600 bg-gray-50 p-2 rounded border">
                  {reservation.paiement.transactionId}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demandes spéciales */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-orange-600" />
            <span>Demandes Spéciales</span>
          </h2>
          {isEditing ? (
            <textarea
              value={reservation.specialRequests || ''}
              onChange={(e) => setReservation({...reservation, specialRequests: e.target.value})}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes ou demandes spéciales du client..."
            />
          ) : (
            <div className="text-gray-900 bg-gray-50 p-4 rounded-lg border">
              {reservation.specialRequests || 'Aucune demande spéciale'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditReservation