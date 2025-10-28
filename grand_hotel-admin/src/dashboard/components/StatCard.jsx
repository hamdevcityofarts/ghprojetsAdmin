import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatCard = ({ title, value, change, icon: Icon, color = 'blue', isCurrency = false }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  }

  const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600'
  const ChangeIcon = change >= 0 ? TrendingUp : TrendingDown

  // ✅ FORMATER LA VALEUR SI C'EST UNE DEVISE
  const formatValue = (val) => {
    if (isCurrency && typeof val === 'number') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
      }).format(val);
    }
    return typeof val === 'number' ? val.toLocaleString() : val;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${changeColor}`}>
              <ChangeIcon className="w-4 h-4 mr-1" />
              <span>{Math.abs(change)}% vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default StatCard