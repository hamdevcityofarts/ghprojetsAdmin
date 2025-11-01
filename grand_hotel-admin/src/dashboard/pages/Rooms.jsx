import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchRooms, deleteRoom } from '../../store/slices/roomsSlice'
import ImageSlider from '../components/ImageSlider'

const Rooms = () => {
  const dispatch = useAppDispatch()
  const { rooms, isLoading, error } = useAppSelector((state) => state.rooms)

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  // Formatage montant F CFA
  const formatAmountCFA = (amount) => {
    return `${parseFloat(amount).toLocaleString('fr-FR')} FCFA`;
  };

  const handleDeleteRoom = async (roomId, roomName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la chambre "${roomName}" ?`)) {
      try {
        await dispatch(deleteRoom(roomId)).unwrap()
        console.log('✅ Chambre supprimée avec succès')
      } catch (error) {
        console.error('❌ Erreur suppression:', error)
        alert(`Erreur lors de la suppression: ${error}`)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800'
      case 'occupée': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'nettoyage': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      'disponible': 'Disponible',
      'occupée': 'Occupée',
      'maintenance': 'Maintenance',
      'nettoyage': 'Nettoyage'
    }
    return statusLabels[status] || status
  }

  const getTypeLabel = (type) => {
    const typeLabels = {
      'standard': 'Standard',
      'superior': 'Supérieure',
      'deluxe': 'Deluxe',
      'suite': 'Suite',
      'family': 'Familiale',
      'executive': 'Exécutive',
      'presidential': 'Présidentielle'
    }
    return typeLabels[type] || type
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Chambres</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4" />
            <span>Ajouter une Chambre</span>
          </button>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des chambres...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Chambres</h1>
        <Link
          to="/dashboard/add-room"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Chambre</span>
        </Link>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Slider d'images */}
            <div className="h-48">
              <ImageSlider 
                images={room.images} 
                className="h-full"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500">#{room.number}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)} mt-1`}>
                    {getStatusLabel(room.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span>Capacité: {room.capacity} personnes</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{getTypeLabel(room.type)}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-blue-600">{formatAmountCFA(room.price)}</div>
                <div className="text-sm text-gray-500">par nuit</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities?.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {amenity}
                  </span>
                ))}
                {room.amenities?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{room.amenities.length - 3}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/dashboard/room/${room._id}`}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir</span>
                </Link>
                <Link
                  to={`/dashboard/room/${room._id}/edit`} // ✅ CORRECTION DU LIEN
                  className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </Link>
                <button 
                  onClick={() => handleDeleteRoom(room._id, room.name)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Aucune chambre trouvée</div>
          <Link
            to="/dashboard/add-room"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer la première chambre
          </Link>
        </div>
      )}
    </div>
  )
}

export default Rooms