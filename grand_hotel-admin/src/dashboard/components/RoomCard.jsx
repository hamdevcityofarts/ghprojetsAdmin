import React from 'react'
import { Users, Wifi, Car, Coffee, Tv, Waves, Edit, Trash2, Eye } from 'lucide-react'

const RoomCard = ({ room, onEdit, onDelete, onView }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'disponible':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          badge: 'Disponible'
        }
      case 'occupée':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          badge: 'Occupée'
        }
      case 'nettoyage':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          badge: 'Nettoyage'
        }
      case 'maintenance':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          badge: 'Maintenance'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          badge: 'Inconnu'
        }
    }
  }

  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'WiFi': Wifi,
      'Parking': Car,
      'Petit-déjeuner': Coffee,
      'TV écran plat': Tv,
      'Vue mer': Waves,
      'Mini-bar': Coffee,
      'Jacuzzi': Waves,
      'Climatisation': Wifi,
      'Room service': Coffee
    }
    return amenityIcons[amenity] || Users
  }

  // ✅ FORMATER LE PRIX EN XAF
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  }

  const statusConfig = getStatusConfig(room.status)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image de la chambre */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
            {statusConfig.badge}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="text-white text-lg font-semibold bg-black bg-opacity-50 px-3 py-1 rounded-lg">
            {room.name}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {/* En-tête avec prix et capacité */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-500 capitalize mt-1">{room.type}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(room.price)}
              <span className="text-sm font-normal text-gray-500 ml-1">/nuit</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Users className="w-4 h-4 mr-1" />
              {room.capacity} personne{room.capacity > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Équipements</h4>
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity, index) => {
              const AmenityIcon = getAmenityIcon(amenity)
              return (
                <div
                  key={index}
                  className="flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700"
                >
                  <AmenityIcon className="w-3 h-3 mr-2" />
                  {amenity}
                </div>
              )
            })}
            {room.amenities.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-500">
                +{room.amenities.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onView(room)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center space-x-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Voir</span>
          </button>
          <button
            onClick={() => onEdit(room)}
            className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center space-x-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
          <button
            onClick={() => onDelete(room._id || room.id)}
            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center space-x-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomCard