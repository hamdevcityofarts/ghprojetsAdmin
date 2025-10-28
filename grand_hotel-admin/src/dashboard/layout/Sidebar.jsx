import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  Bed, 
  Users, 
  CreditCard, 
  Settings,
  UserCog,
  BarChart3
} from 'lucide-react'
import logo from '../../assets/ghLogo.png' // Chez correct

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { path: '/dashboard/reservations', icon: Calendar, label: 'Réservations' },
    { path: '/dashboard/rooms', icon: Bed, label: 'Chambres' },
    { path: '/dashboard/clients', icon: Users, label: 'Clients' },
    { path: '/dashboard/payments', icon: CreditCard, label: 'Paiements' },
    { path: '/dashboard/users', icon: UserCog, label: 'Utilisateurs' },
    { path: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-3  py-5">
          {/* Logo CORRECTEMENT utilisé */}
          <div className="w-23 h-20 rounded-lg flex items-center justify-center ">
            <img 
              src={logo} // Utilisez la variable importée directement
              alt="Grand Hotel Logo" 
              className="h-18 w-18 object-contain" // Ajustez selon votre logo
            />
          </div>
          <div>
          </div>
        </div>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar