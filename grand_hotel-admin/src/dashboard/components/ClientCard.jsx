import React from 'react'
import { Mail, Phone, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'

const ClientCard = ({ client, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
          <p className="text-sm text-gray-500">Client #{client.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-3 text-gray-400" />
          <span>{client.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-3 text-gray-400" />
          <span>{client.phone}</span>
        </div>

        {client.address && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-gray-400" />
            <span className="flex-1">{client.address}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Dernière visite: {client.lastVisit}
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {client.totalBookings} réservations
          </span>
        </div>
      </div>

      {client.preferences && client.preferences.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Préférences</h4>
          <div className="flex flex-wrap gap-1">
            {client.preferences.map((pref, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientCard