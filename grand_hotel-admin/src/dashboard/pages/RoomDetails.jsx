import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, Users, Bed, Ruler } from 'lucide-react'
import { useAppSelector } from '../../hooks'
import ImageSlider from '../components/ImageSlider'

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rooms } = useAppSelector((state) => state.rooms)
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundRoom = rooms.find(r => r._id === id)
    if (foundRoom) {
      setRoom(foundRoom)
    }
    setLoading(false)
  }, [id, rooms])

  // Formatage montant F CFA
  const formatAmountCFA = (amount) => {
    return `${parseFloat(amount).toLocaleString('fr-FR')} FCFA`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chambre non trouvée</h2>
        <button 
          onClick={() => navigate('/dashboard/rooms')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Retour aux chambres
        </button>
      </div>
    )
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/rooms')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-gray-600">#{room.number} • {room.type}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/dashboard/room/${room._id}/edit`)} // ✅ CORRECTION DU LIEN
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Modifier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slider d'images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <ImageSlider images={room.images} className="h-96" />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{room.description}</p>
          </div>

          {/* Équipements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Équipements & Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statut et prix */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(room.status)}`}>
                  {getStatusLabel(room.status)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{formatAmountCFA(room.price)}</div>
                <div className="text-sm text-gray-500">par nuit</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Capacité</span>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{room.capacity} personnes</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Surface</span>
                <div className="flex items-center space-x-1">
                  <Ruler className="w-4 h-4" />
                  <span>{room.size}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Type de lit</span>
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4" />
                  <span>{room.bedType}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Catégorie</span>
                <span className="capitalize">{room.category}</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Voir le calendrier</span>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Marquer comme nettoyée
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Mettre en maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails