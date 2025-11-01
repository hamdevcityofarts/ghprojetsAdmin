import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Mail, Phone, Shield, User, Calendar, RefreshCw, LogOut, Lock } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import userService from '../../services/userService'

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Charger les données de l'utilisateur
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)
        console.log('🔄 Chargement des détails utilisateur ID:', id)
        
        const response = await userService.getUserById(id)
        
        if (response.data) {
          setUser(response.data)
          console.log('✅ Utilisateur chargé:', response.data)
        } else {
          throw new Error('Utilisateur non trouvé')
        }
      } catch (error) {
        console.error('❌ Erreur chargement utilisateur:', error)
        toast.error('Erreur lors du chargement des données utilisateur')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id, toast])

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      console.log('💾 Sauvegarde des modifications utilisateur:', user)

      const response = await userService.updateUser(id, {
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        status: user.status,
        permissions: user.permissions
      })

      if (response.data) {
        toast.success('Utilisateur modifié avec succès')
        setIsEditing(false)
        console.log('✅ Utilisateur sauvegardé:', response.data)
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde utilisateur:', error)
      toast.error('Erreur lors de la sauvegarde des modifications')
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) {
      return
    }

    try {
      // Générer un mot de passe temporaire
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
      
      const response = await userService.updateUser(id, {
        password: tempPassword
      })

      if (response.data) {
        toast.success(`Mot de passe réinitialisé. Nouveau mot de passe: ${tempPassword}`)
        console.log('🔐 Mot de passe réinitialisé pour:', user.email)
      }
    } catch (error) {
      console.error('❌ Erreur réinitialisation mot de passe:', error)
      toast.error('Erreur lors de la réinitialisation du mot de passe')
    }
  }

  const handleForceLogout = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir forcer la déconnexion de cet utilisateur ?')) {
      return
    }

    try {
      // Implémentez cette fonctionnalité selon votre backend
      toast.info('Fonctionnalité de déconnexion forcée à implémenter')
      console.log('🚪 Déconnexion forcée pour:', user.email)
    } catch (error) {
      console.error('❌ Erreur déconnexion forcée:', error)
      toast.error('Erreur lors de la déconnexion forcée')
    }
  }

  const handleToggleStatus = async () => {
    const newStatus = user.status === 'actif' ? 'inactif' : 'actif'
    const action = newStatus === 'actif' ? 'activer' : 'désactiver'
    
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} le compte de ${user.name} ?`)) {
      return
    }

    try {
      const response = await userService.updateUser(id, {
        status: newStatus
      })

      if (response.data) {
        setUser(prev => ({ ...prev, status: newStatus }))
        toast.success(`Compte ${action} avec succès`)
        console.log(`🔄 Statut changé à ${newStatus} pour:`, user.email)
      }
    } catch (error) {
      console.error('❌ Erreur changement statut:', error)
      toast.error('Erreur lors du changement de statut')
    }
  }

  const handlePermissionToggle = (permissionId) => {
    if (!isEditing) return

    const updatedPermissions = user.permissions.includes(permissionId)
      ? user.permissions.filter(p => p !== permissionId)
      : [...user.permissions, permissionId]
    
    setUser(prev => ({ ...prev, permissions: updatedPermissions }))
  }

  const allPermissions = [
    { id: 'gestion_utilisateurs', label: 'Gestion utilisateurs' },
    { id: 'gestion_chambres', label: 'Gestion chambres' },
    { id: 'gestion_reservations', label: 'Gestion réservations' },
    { id: 'gestion_clients', label: 'Gestion clients' },
    { id: 'acces_finances', label: 'Accès finances' },
    { id: 'rapports', label: 'Génération rapports' },
    { id: 'parametres_systeme', label: 'Paramètres système' },
    { id: 'gestion_menage', label: 'Gestion ménage' },
    { id: 'gestion_restaurant', label: 'Gestion restaurant' }
  ]

  const departments = [
    { value: 'direction', label: 'Direction' },
    { value: 'reception', label: 'Réception' },
    { value: 'housekeeping', label: 'Service de ménage' },
    { value: 'restaurant', label: 'Restauration' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Autre' }
  ]

  const roles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'manager', label: 'Gérant' },
    { value: 'receptionist', label: 'Réceptionniste' },
    { value: 'housekeeper', label: 'Agent de ménage' },
    { value: 'supervisor', label: 'Superviseur' },
    { value: 'technician', label: 'Technicien' }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données utilisateur...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
        <button 
          onClick={() => navigate('/dashboard/users')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Retour aux utilisateurs
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name} {user.surname}</h1>
            <p className="text-gray-600">
              {user.role} • {user.department}
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                user.status === 'actif' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {user.status === 'actif' ? 'Actif' : 'Inactif'}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Modifier</span>
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 disabled:opacity-50 transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={user.name || ''}
                  onChange={(e) => isEditing && setUser({...user, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={user.surname || ''}
                  onChange={(e) => isEditing && setUser({...user, surname: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => isEditing && setUser({...user, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => isEditing && setUser({...user, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Permissions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allPermissions.map(permission => (
                <label 
                  key={permission.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    user.permissions?.includes(permission.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  } ${isEditing ? 'hover:bg-gray-100' : 'cursor-default'}`}
                >
                  <input
                    type="checkbox"
                    checked={user.permissions?.includes(permission.id) || false}
                    onChange={() => handlePermissionToggle(permission.id)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-sm font-medium">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Rôle et statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-green-600" />
              Rôle et Statut
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                <select
                  value={user.department || ''}
                  onChange={(e) => isEditing && setUser({...user, department: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Sélectionnez un département</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={user.role || ''}
                  onChange={(e) => isEditing && setUser({...user, role: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={user.status || 'actif'}
                  onChange={(e) => isEditing && setUser({...user, status: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en_conge">En congé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informations de connexion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-600" />
              Informations de Connexion
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière connexion</span>
                <span className="font-medium">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Membre depuis</span>
                <span className="font-medium">
                  {user.memberSince ? new Date(user.memberSince).toLocaleDateString('fr-FR') : 'Non défini'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date de création</span>
                <span className="font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non défini'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions de sécurité */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-red-600" />
              Sécurité
            </h3>
            <div className="space-y-2">
              <button 
                onClick={handleResetPassword}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Réinitialiser le mot de passe</span>
              </button>
              <button 
                onClick={handleForceLogout}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Forcer la déconnexion</span>
              </button>
              <button 
                onClick={handleToggleStatus}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  user.status === 'actif' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <span>{user.status === 'actif' ? 'Désactiver le compte' : 'Activer le compte'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails