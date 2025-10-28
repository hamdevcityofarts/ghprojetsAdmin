import React from 'react'
import { Calendar, User, Bed, CheckCircle, XCircle, Clock, Edit } from 'lucide-react'

const ReservationCard = ({ reservation, onConfirm, onCancel, onEdit }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500',
          label: 'Confirmée'
        }
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          iconColor: 'text-yellow-500',
          label: 'En attente'
        }
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-500',
          label: 'Annulée'
        }
      case 'completed':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: CheckCircle,
          iconColor: 'text-gray-500',
          label: 'Terminée'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-500',
          label: status
        }
    }
  }

  // ✅ FORMATER LE MONTANT EN XAF
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const statusConfig = getStatusConfig(reservation.status)
  const StatusIcon = statusConfig.icon

  // Obtenir le nom du client
  const getClientName = () => {
    if (reservation.client && reservation.client.name && reservation.client.surname) {
      return `${reservation.client.surname} ${reservation.client.name}`
    } else if (reservation.clientInfo) {
      return `${reservation.clientInfo.surname} ${reservation.clientInfo.name}`
    }
    return 'Client inconnu'
  }

  // Obtenir le nom de la chambre
  const getRoomName = () => {
    if (reservation.chambre && reservation.chambre.name) {
      return reservation.chambre.name
    }
    return 'Chambre inconnue'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Réservation #{reservation._id?.slice(-6) || reservation.id}
            </h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
              <StatusIcon className={`w-4 h-4 mr-1 ${statusConfig.iconColor}`} />
              {statusConfig.label}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium">{getClientName()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Bed className="w-4 h-4 mr-2" />
            <span>{getRoomName()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Check-in</p>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(reservation.checkIn)}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Check-out</p>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(reservation.checkOut)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-lg font-bold text-gray-900">
          {formatAmount(reservation.totalAmount)}
        </div>
        
        <div className="flex space-x-2">
          {reservation.status === 'pending' && (
            <>
              <button
                onClick={() => onConfirm(reservation._id || reservation.id)}
                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmer</span>
              </button>
              <button
                onClick={() => onCancel(reservation._id || reservation.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Annuler</span>
              </button>
            </>
          )}
          <button
            onClick={() => onEdit(reservation)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
        </div>
      </div>

      {reservation.specialRequests && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-1">Demandes spéciales</p>
          <p className="text-sm text-blue-700">{reservation.specialRequests}</p>
        </div>
      )}
    </div>
  )
}

export default ReservationCard