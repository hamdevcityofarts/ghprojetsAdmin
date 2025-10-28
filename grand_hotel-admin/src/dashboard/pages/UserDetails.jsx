import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Mail, Phone, Shield, User, Calendar } from 'lucide-react'

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setUser({
        id: parseInt(id),
        name: 'Admin Principal',
        email: 'admin@grandhotel.com',
        phone: '+33 1 23 45 67 89',
        role: 'Administrateur',
        department: 'Direction',
        lastLogin: '2024-01-15 14:30',
        memberSince: '2023-01-10',
        status: 'actif',
        permissions: ['gestion_utilisateurs', 'gestion_chambres', 'gestion_reservations', 'acces_finances']
      })
      setLoading(false)
    }, 1000)
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    navigate('/dashboard/users')
  }

  if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>
  if (!user) return <div className="text-center py-12">Utilisateur non trouvé</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard/users')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">Utilisateur #{user.id}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                <input
                  type="text"
                  value={user.department}
                  onChange={(e) => setUser({...user, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Permissions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 'gestion_utilisateurs', label: 'Gestion utilisateurs' },
                { id: 'gestion_chambres', label: 'Gestion chambres' },
                { id: 'gestion_reservations', label: 'Gestion réservations' },
                { id: 'acces_finances', label: 'Accès finances' },
                { id: 'gestion_clients', label: 'Gestion clients' },
                { id: 'parametres_systeme', label: 'Paramètres système' }
              ].map(permission => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={user.permissions.includes(permission.id)}
                    onChange={(e) => {
                      const updatedPermissions = e.target.checked
                        ? [...user.permissions, permission.id]
                        : user.permissions.filter(p => p !== permission.id)
                      setUser({...user, permissions: updatedPermissions})
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Rôle et statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Rôle et Statut</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={user.role}
                  onChange={(e) => setUser({...user, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Administrateur">Administrateur</option>
                  <option value="Gérant">Gérant</option>
                  <option value="Réceptionniste">Réceptionniste</option>
                  <option value="Service de ménage">Service de ménage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={user.status}
                  onChange={(e) => setUser({...user, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informations de connexion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Informations de Connexion</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière connexion</span>
                <span>{user.lastLogin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Membre depuis</span>
                <span>{user.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Actions de sécurité */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Sécurité</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Réinitialiser le mot de passe
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200">
                Forcer la déconnexion
              </button>
              <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200">
                Désactiver le compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails