import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Shield, User, Search, Filter, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchUsers, deleteUser } from '../../store/slices/usersSlice'
import TableCard from '../components/TableCard'

const Users = () => {
  const dispatch = useAppDispatch()
  const { users, isLoading, error } = useAppSelector((state) => state.users)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap()
        console.log('✅ Utilisateur supprimé avec succès')
      } catch (error) {
        console.error('❌ Erreur suppression:', error)
        alert(`Erreur lors de la suppression: ${error}`)
      }
    }
  }

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !roleFilter || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-600" />
      case 'receptionist':
        return <User className="w-4 h-4 text-green-600" />
      case 'housekeeper':
        return <User className="w-4 h-4 text-orange-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role) => {
    const roleLabels = {
      'admin': 'Administrateur',
      'manager': 'Manager',
      'receptionist': 'Réceptionniste',
      'housekeeper': 'Personnel Ménage',
      'supervisor': 'Superviseur',
      'technician': 'Technicien',
      'client': 'Client'
    }
    return roleLabels[role] || role
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif':
        return 'bg-green-100 text-green-800'
      case 'inactif':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_conge':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      'actif': 'Actif',
      'inactif': 'Inactif',
      'pending': 'En attente',
      'en_conge': 'En congé'
    }
    return statusLabels[status] || status
  }

  // Statistiques
  const userStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    manager: users.filter(u => u.role === 'manager').length,
    receptionist: users.filter(u => u.role === 'receptionist').length,
    client: users.filter(u => u.role === 'client').length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4" />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">
            {userStats.total} utilisateur(s) au total
          </p>
        </div>
        <Link
          to="/dashboard/add-user"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Utilisateur</span>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{userStats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{userStats.admin}</div>
          <div className="text-sm text-gray-600">Administrateurs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{userStats.manager}</div>
          <div className="text-sm text-gray-600">Managers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{userStats.receptionist}</div>
          <div className="text-sm text-gray-600">Réceptionnistes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{userStats.client}</div>
          <div className="text-sm text-gray-600">Clients</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full appearance-none bg-white"
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Réceptionniste</option>
                <option value="housekeeper">Personnel ménage</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tableau des Utilisateurs */}
      <TableCard
        title={`Utilisateurs du Système (${filteredUsers.length})`}
        headers={['Utilisateur', 'Rôle', 'Département', 'Dernière Connexion', 'Statut', 'Actions']}
        data={filteredUsers}
        renderRow={(user) => (
          <tr key={user._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.name} {user.surname}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-400">{user.phone}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {getRoleIcon(user.role)}
                <span className="ml-2 text-sm text-gray-900">{getRoleLabel(user.role)}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.department || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                {getStatusLabel(user.status)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-3">
                <Link
                  to={`/dashboard/users/${user.id}`}
                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                  title="Voir détails"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir</span>
                </Link>
                <Link
                  to={`/dashboard/users/${user.id}/edit`} 
                  className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </Link>
                <button 
                  onClick={() => handleDeleteUser(user._id, `${user.name} ${user.surname}`)}
                  className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                  title="Supprimer"
                  disabled={user.role === 'admin'}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </td>
          </tr>
        )}
        emptyMessage={
          users.length === 0 
            ? "Aucun utilisateur n'a été créé pour le moment."
            : "Aucun utilisateur ne correspond à vos critères de recherche."
        }
      />
    </div>
  )
}

export default Users