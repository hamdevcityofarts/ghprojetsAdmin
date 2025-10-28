import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react'

const AddUser = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    hireDate: '',
    password: '',
    status: 'actif',
    permissions: []
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // En production, envoyer les données à l'API
      console.log('Données utilisateur:', formData)
      
      // Redirection après succès
      navigate('/dashboard/users?message=user_created')
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password }))
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
            <h1 className="text-3xl font-bold text-gray-900">Ajouter un Utilisateur</h1>
            <p className="text-gray-600">Créez un nouveau compte utilisateur</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Création...' : 'Créer l\'Utilisateur'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="utilisateur@hotel.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-green-600" />
              Informations Professionnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Rôle *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date d'embauche
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleInputChange('hireDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en_conge">En congé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              Sécurité & Accès
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Mot de passe sécurisé"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    Générer
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Le mot de passe doit contenir au moins 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux.
                </p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Permissions</h2>
            <p className="text-gray-600 mb-4">Sélectionnez les permissions accordées à cet utilisateur</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPermissions.map(permission => (
                <label 
                  key={permission.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.permissions.includes(permission.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Aperçu utilisateur */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Aperçu</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom complet:</span>
                <span className="font-semibold">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold truncate">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rôle:</span>
                <span className="font-semibold">
                  {roles.find(r => r.value === formData.role)?.label || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Département:</span>
                <span className="font-semibold">
                  {departments.find(d => d.value === formData.department)?.label || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className={`font-semibold ${
                  formData.status === 'actif' ? 'text-green-600' : 
                  formData.status === 'inactif' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {formData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions sélectionnées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Permissions Sélectionnées</h3>
            <div className="space-y-2">
              {formData.permissions.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune permission sélectionnée</p>
              ) : (
                formData.permissions.map(permissionId => {
                  const permission = allPermissions.find(p => p.id === permissionId)
                  return (
                    <div key={permissionId} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{permission?.label}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button 
                type="button"
                onClick={() => navigate('/dashboard/users')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button"
                onClick={() => setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  department: '',
                  role: '',
                  hireDate: '',
                  password: '',
                  status: 'actif',
                  permissions: []
                })}
                className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddUser