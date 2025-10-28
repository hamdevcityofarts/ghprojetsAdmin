import React, { useState } from 'react'
import { Save, Building, CreditCard, Bell, Shield } from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState({
    hotelName: 'Grand Hotel',
    email: 'contact@grandhotel.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    cancellationPolicy: 48,
    currency: 'EUR'
  })

  const handleSave = () => {
    // Logique de sauvegarde
    console.log('Settings saved:', settings)
  }

  const sections = [
    {
      icon: Building,
      title: 'Informations de l\'Hôtel',
      fields: [
        { name: 'hotelName', label: 'Nom de l\'hôtel', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Téléphone', type: 'tel' },
        { name: 'address', label: 'Adresse', type: 'text' }
      ]
    },
    {
      icon: CreditCard,
      title: 'Paramètres de Réservation',
      fields: [
        { name: 'cancellationPolicy', label: 'Délai d\'annulation (heures)', type: 'number' },
        { name: 'currency', label: 'Devise', type: 'select', options: ['EUR', 'USD', 'GBP'] }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          <span>Sauvegarder</span>
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={settings[field.name]}
                          onChange={(e) => setSettings({
                            ...settings,
                            [field.name]: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={settings[field.name]}
                          onChange={(e) => setSettings({
                            ...settings,
                            [field.name]: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Settings