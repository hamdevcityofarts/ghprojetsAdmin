import React, { useState } from 'react'
import { Bell, Search, User, LogOut, Settings } from 'lucide-react'

const Header = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  // Fonction pour obtenir les initiales de l'utilisateur
  const getInitials = (name) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Fonction pour obtenir une couleur basée sur le nom
  const getAvatarColor = (name) => {
    if (!name) return 'from-blue-500 to-blue-700'
    
    const colors = [
      'from-blue-500 to-blue-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-orange-500 to-orange-700',
      'from-pink-500 to-pink-700',
      'from-teal-500 to-teal-700',
    ]
    
    const index = name.length % colors.length
    return colors[index]
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-8 h-8 ${getAvatarColor(user?.name)} rounded-full flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-gray-700 block">
                  {user?.name || 'Administrateur'}
                </span>
                <span className="text-xs text-gray-500 block capitalize">
                  {user?.role || 'Admin'}
                </span>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrateur'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@grandhotel.com'}</p>
                </div>
                
                <button 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Paramètres
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button 
                  onClick={() => {
                    setShowDropdown(false)
                    onLogout()
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  )
}

export default Header