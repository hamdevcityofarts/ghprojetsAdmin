import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Euro } from 'lucide-react'

const ClientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setClient({
        id: parseInt(id),
        name: 'Pierre Martin',
        email: 'pierre.martin@email.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Avenue des Champs-Élysées, 75008 Paris',
        totalBookings: 5,
        totalSpent: 8450,
        lastVisit: '2024-01-10',
        memberSince: '2023-03-15',
        preferences: ['Chambre calme', 'Vue mer', 'Petit-déjeuner continental', 'Service de blanchisserie'],
        notes: 'Client fidèle, préfère les chambres avec vue mer. A célébré son anniversaire lors du dernier séjour.'
      })
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>
  if (!client) return <div className="text-center py-12">Client non trouvé</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard/clients')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Client #{client.id}</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Edit className="w-4 h-4" />
          <span>Modifier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Informations de Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Historique des Séjours</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Suite Présidentielle</p>
                    <p className="text-sm text-gray-500">15-18 Jan 2024 • 3 nuits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">€1,200</p>
                    <p className="text-sm text-green-600">Séjour terminé</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Statistiques */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Réservations</span>
                <span className="font-bold">{client.totalBookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total dépensé</span>
                <span className="font-bold text-blue-600">€{client.totalSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière visite</span>
                <span className="font-medium">{client.lastVisit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membre depuis</span>
                <span className="font-medium">{client.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Préférences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Préférences</h3>
            <div className="flex flex-wrap gap-2">
              {client.preferences.map((pref, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {pref}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Notes</h3>
            <p className="text-gray-700 text-sm">{client.notes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDetails