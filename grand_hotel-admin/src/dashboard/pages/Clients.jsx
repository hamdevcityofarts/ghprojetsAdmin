import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchClients, deleteClient } from '../../store/slices/clientsSlice';
import TableCard from '../components/TableCard';

const Clients = () => {
  const dispatch = useAppDispatch()
  const { clients, isLoading, error } = useAppSelector((state) => state.clients)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  const handleDeleteClient = async (clientId, clientName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${clientName}" ?`)) {
      try {
        await dispatch(deleteClient(clientId)).unwrap()
        console.log('✅ Client supprimé avec succès')
      } catch (error) {
        console.error('❌ Erreur suppression:', error)
        alert(`Erreur lors de la suppression: ${error}`)
      }
    }
  }

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculer les statistiques
  const clientStats = {
    total: clients.length,
    actif: clients.filter(c => c.status === 'actif').length,
    inactif: clients.filter(c => c.status === 'inactif').length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 opacity-50 cursor-not-allowed">
            <UserPlus className="w-4 h-4" />
            <span>Nouveau Client</span>
          </button>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des clients...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600 mt-1">
            {clientStats.total} client(s) au total
          </p>
        </div>
        <Link
          to="/dashboard/add-client"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nouveau Client</span>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{clientStats.total}</div>
          <div className="text-sm text-gray-600">Total Clients</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{clientStats.actif}</div>
          <div className="text-sm text-gray-600">Clients Actifs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{clientStats.inactif}</div>
          <div className="text-sm text-gray-600">Clients Inactifs</div>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tableau des Clients */}
      <TableCard
        title={`Base de Données Clients (${filteredClients.length})`}
        headers={['Client', 'Contact', 'Dernière Connexion', 'Statut', 'Actions']}
        data={filteredClients}
        renderRow={(client) => (
          <tr key={client._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {client.name} {client.surname}
                </div>
                <div className="text-xs text-gray-500">
                  Membre depuis {new Date(client.memberSince).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="w-4 h-4 mr-2" />
                  {client.phone || 'Non renseigné'}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                client.status === 'actif' 
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'inactif'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status === 'actif' ? 'Actif' : 
                 client.status === 'inactif' ? 'Inactif' : client.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-3">
                <Link
                  to={`/dashboard/client/${client._id}`}
                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                  title="Voir profil"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir</span>
                </Link>
                <Link
                  to={`/dashboard/client/${client._id}/edit`}
                  className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </Link>
                <button 
                  onClick={() => handleDeleteClient(client._id, `${client.name} ${client.surname}`)}
                  className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </td>
          </tr>
        )}
        emptyMessage={
          clients.length === 0 
            ? "Aucun client n'a été créé pour le moment."
            : "Aucun client ne correspond à vos critères de recherche."
        }
      />
    </div>
  )
}

export default Clients