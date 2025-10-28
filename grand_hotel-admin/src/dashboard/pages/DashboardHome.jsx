import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Bed, Calendar, Users, Euro } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import TableCard from '../components/TableCard'
import reservationService from '../../services/reservationService'
import {
  statsData,
  revenueData,
  occupancyData
} from '../data/mockData'

 const CFAIcon = ({ className = "w-5 h-5" }) => (
    <div className={`${className} flex items-center justify-center font-bold text-green-600`}>
      <span className="text-xs">FCFA</span>
    </div>
  );

const DashboardHome = () => {
  const [recentReservations, setRecentReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    occupancyRate: 0,
    totalBookings: 0,
    availableRooms: 0
  })

  // Fonction de conversion Euro → F CFA
  const convertToCFA = (amountInEuro) => {
    const exchangeRate = 655.957;
    return Math.round(amountInEuro * exchangeRate);
  };

  // Formatage montant F CFA
  const formatAmountCFA = (amountInEuro) => {
    const amountInCFA = convertToCFA(amountInEuro);
    return `${amountInCFA.toLocaleString('fr-FR')} FCFA`;
  };

  // Charger les dernières réservations
  const loadRecentReservations = async () => {
    try {
      setLoading(true)
      
      // Charger les réservations (les 3 premières de la première page)
      const response = await reservationService.getReservations({ 
        page: 1, 
        limit: 3,
        sort: 'createdAt:desc' // Les plus récentes d'abord
      })
      
      if (response.success) {
        const reservations = response.reservations || []
        setRecentReservations(reservations.slice(0, 3)) // Prendre les 3 premières
        
        // Calculer les statistiques basiques
        const totalRevenue = reservations.reduce((sum, res) => sum + (res.totalAmount || 0), 0)
        const confirmedReservations = reservations.filter(res => res.status === 'confirmed').length
        
        setDashboardStats({
          totalRevenue,
          occupancyRate: Math.round((confirmedReservations / Math.max(reservations.length, 1)) * 100),
          totalBookings: reservations.length,
          availableRooms: 10 - confirmedReservations // Exemple: 10 chambres au total
        })
      }
    } catch (error) {
      console.error('❌ Erreur chargement réservations récentes:', error)
      // En cas d'erreur, utiliser les données mockées
      setRecentReservations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecentReservations()
  }, [])

  // Convertir les données de revenus en F CFA
  const revenueDataCFA = revenueData.map(item => ({
    ...item,
    revenue: convertToCFA(item.revenue)
  }));

  const stats = [
    {
      title: 'Revenu Total',
      value: formatAmountCFA(dashboardStats.totalRevenue),
      change: 12.5,
      icon: CFAIcon,
      color: 'green'
    },
    {
      title: 'Taux Occupation',
      value: `${dashboardStats.occupancyRate}%`,
      change: 8.2,
      icon: Bed,
      color: 'blue'
    },
    {
      title: 'Réservations',
      value: dashboardStats.totalBookings,
      change: 15.3,
      icon: Calendar,
      color: 'orange'
    },
    {
      title: 'Chambres Libres',
      value: dashboardStats.availableRooms,
      change: -5.2,
      icon: Users,
      color: 'purple'
    }
  ]

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Texte des statuts
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée'
      case 'pending': return 'En attente'
      case 'cancelled': return 'Annulée'
      case 'completed': return 'Terminée'
      default: return status
    }
  }

  // Couleurs des statuts
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenus Mensuels (F CFA)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueDataCFA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Revenu']}
                labelFormatter={(label) => `Mois: ${label}`}
              />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Revenu"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Taux d'Occupation Hebdomadaire">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Occupation']}
              />
              <Line 
                type="monotone" 
                dataKey="occupancy" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="Taux d'occupation"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Dernières Réservations */}
      <TableCard
        title="Dernières Réservations"
        headers={['Client', 'Chambre', 'Dates', 'Statut', 'Montant']}
        data={recentReservations}
        emptyMessage={
          loading 
            ? "Chargement des réservations..." 
            : "Aucune réservation récente"
        }
        renderRow={(reservation) => (
          <tr key={reservation._id} className="hover:bg-gray-50 border-b border-gray-200">
            {/* Client */}
            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.client?.name} {reservation.client?.surname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.client?.email}
                  </div>
                </div>
              </div>
            </td>

            {/* Chambre */}
            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 font-medium">
                {reservation.chambre?.number}
              </div>
              <div className="text-sm text-gray-500">
                {reservation.chambre?.name}
              </div>
            </td>

            {/* Dates */}
            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {formatDate(reservation.checkIn)}
              </div>
              <div className="text-sm text-gray-500">
                au {formatDate(reservation.checkOut)}
              </div>
              <div className="text-xs text-gray-400">
                {reservation.nights || reservation.nuits} nuit(s)
              </div>
            </td>

            {/* Statut */}
            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </td>

            {/* Montant */}
            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {formatAmountCFA(reservation.totalAmount)}
              </div>
              <div className="text-xs text-gray-500">
                {reservation.totalAmount} €
              </div>
            </td>
          </tr>
        )}
      />

      {/* Bouton de rafraîchissement */}
      <div className="flex justify-center">
        <button
          onClick={loadRecentReservations}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <span>{loading ? 'Chargement...' : 'Rafraîchir les données'}</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardHome