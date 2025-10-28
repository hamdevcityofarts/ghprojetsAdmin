import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, 
  Eye, Calendar, User, RefreshCw, Loader 
} from 'lucide-react'
import TableCard from '../components/TableCard'
import { useToast } from '../../context/ToastContext'
import reservationService from '../../services/reservationService'

const Reservations = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [allReservationsLoaded, setAllReservationsLoaded] = useState(false)

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

  // Charger les réservations initiales
  const loadReservations = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(1)
        setHasMore(true)
        setAllReservationsLoaded(false)
        setReservations([]) // ✅ VIDER les réservations avant de recharger
      }
      
      const currentPage = reset ? 1 : page
      const params = {
        page: currentPage,
        limit: 10
      }
      
      // ✅ CORRECTION : Toujours envoyer le filtre statut à l'API
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      // ✅ CORRECTION : Envoyer aussi le terme de recherche à l'API
      if (searchTerm) {
        params.search = searchTerm
      }
      
      console.log(`📋 Chargement page ${currentPage} avec filtres:`, params)
      
      const response = await reservationService.getReservations(params)
      
      if (response.success) {
        const newReservations = response.reservations || []
        
        if (reset) {
          setReservations(newReservations)
        } else {
          setReservations(prev => [...prev, ...newReservations])
        }
        
        // Vérifier s'il reste des réservations à charger
        const reservationsCount = newReservations.length
        if (reservationsCount < 10) {
          setHasMore(false)
          setAllReservationsLoaded(true)
          console.log('✅ Toutes les réservations sont chargées')
        }
        
        console.log(`📊 ${reservationsCount} réservation(s) chargée(s) pour le statut: ${statusFilter}`)
      }
    } catch (error) {
      console.error('❌ Erreur chargement réservations:', error)
      toast.error('Erreur lors du chargement des réservations')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Charger plus de réservations
  const loadMoreReservations = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const nextPage = page + 1
    
    try {
      const params = {
        page: nextPage,
        limit: 10
      }
      
      // ✅ CORRECTION : Appliquer les mêmes filtres pour le chargement supplémentaire
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      console.log(`📋 Chargement page supplémentaire ${nextPage} avec statut: ${statusFilter}`)
      
      const response = await reservationService.getReservations(params)
      
      if (response.success) {
        const newReservations = response.reservations || []
        setReservations(prev => [...prev, ...newReservations])
        setPage(nextPage)
        
        const reservationsCount = newReservations.length
        if (reservationsCount < 10) {
          setHasMore(false)
          setAllReservationsLoaded(true)
          console.log('✅ Toutes les réservations supplémentaires sont chargées')
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement réservations supplémentaires:', error)
      toast.error('Erreur lors du chargement des réservations supplémentaires')
    } finally {
      setLoadingMore(false)
    }
  }

  // Observer pour l'infinite scroll
  const observer = React.useRef()
  const lastReservationElementRef = useCallback(node => {
    if (loadingMore) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        console.log('🔄 Déclenchement du chargement automatique...')
        loadMoreReservations()
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loadingMore, hasMore, statusFilter]) // ✅ AJOUTER statusFilter aux dépendances

  // Chargement initial
  useEffect(() => {
    loadReservations(true)
  }, [])

  // ✅ CORRECTION : Recharger automatiquement quand les filtres changent
  useEffect(() => {
    console.log(`🔄 Filtre changé: statut=${statusFilter}, recherche=${searchTerm}`)
    loadReservations(true)
  }, [statusFilter, searchTerm])

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
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

  // ✅ CORRECTION : Filtrer côté client en fallback (au cas où l'API ne filtre pas)
  const filteredReservations = reservations.filter(reservation => {
    if (statusFilter === 'all') return true
    return reservation.status === statusFilter
  })

  // Actions sur les réservations
  const confirmReservation = async (id) => {
    try {
      const response = await reservationService.confirmReservation(id)
      if (response.success) {
        toast.success('Réservation confirmée avec succès')
        loadReservations(true) // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur confirmation:', error)
      toast.error('Erreur lors de la confirmation')
    }
  }

  const cancelReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }
    
    try {
      const response = await reservationService.cancelReservation(id)
      if (response.success) {
        toast.success(response.message)
        loadReservations(true) // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur annulation:', error)
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const viewReservation = (id) => {
    navigate(`/dashboard/reservation/${id}/edit`)
  }

  const createNewReservation = () => {
    navigate('/dashboard/add-reservation')
  }

  // Calculer les statistiques
  const getReservationStats = () => {
    const totalReservations = reservations.length
    const pending = reservations.filter(r => r.status === 'pending').length
    const confirmed = reservations.filter(r => r.status === 'confirmed').length
    const completed = reservations.filter(r => r.status === 'completed').length
    const cancelled = reservations.filter(r => r.status === 'cancelled').length

    return {
      total: totalReservations,
      pending,
      confirmed,
      completed,
      cancelled
    }
  }

  const stats = getReservationStats()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {filteredReservations.length} réservation(s) {statusFilter !== 'all' ? `avec statut "${getStatusText(statusFilter)}"` : 'trouvée(s)'}
            {allReservationsLoaded && ' • Toutes les réservations sont chargées'}
            {hasMore && !allReservationsLoaded && ' • Défilez pour charger plus'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => loadReservations(true)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors order-2 sm:order-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          <button 
            onClick={createNewReservation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors order-1 sm:order-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Réservation</span>
          </button>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher client ou chambre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre statut */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
              <option value="completed">Terminée</option>
            </select>
          </div>

          {/* Statistiques rapides */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700 font-medium">En attente:</span>
              <span className="font-semibold text-blue-900">
                {stats.pending}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTIQUES RAPIDES - POSITIONNÉES AVANT LE TABLEAU */}
      {reservations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {statusFilter !== 'all' ? `Aperçu des Réservations - ${getStatusText(statusFilter)}` : 'Aperçu des Réservations'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Total */}
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total</div>
            </div>
            
            {/* En attente */}
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-sm text-yellow-600 mt-1">En attente</div>
            </div>
            
            {/* Confirmées */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{stats.confirmed}</div>
              <div className="text-sm text-green-600 mt-1">Confirmées</div>
            </div>
            
            {/* Terminées */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{stats.completed}</div>
              <div className="text-sm text-blue-600 mt-1">Terminées</div>
            </div>
            
            {/* Annulées */}
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">{stats.cancelled}</div>
              <div className="text-sm text-red-600 mt-1">Annulées</div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des Réservations */}
      <TableCard
        title={`Réservations ${statusFilter !== 'all' ? `- ${getStatusText(statusFilter)}` : ''} (${filteredReservations.length})`}
        headers={['Client', 'Chambre', 'Dates', 'Nuits', 'Statut', 'Montant', 'Actions']}
        data={filteredReservations} // ✅ UTILISER filteredReservations au lieu de reservations
        emptyMessage={
          statusFilter !== 'all' 
            ? `Aucune réservation avec le statut "${getStatusText(statusFilter)}"`
            : 'Aucune réservation trouvée'
        }
        renderRow={(reservation, index) => {
          // Ajouter la référence pour l'infinite scroll sur le dernier élément
          const isLastElement = index === filteredReservations.length - 1
          const shouldAttachObserver = isLastElement && hasMore && !loadingMore
          
          return (
            <tr 
              key={reservation._id} 
              ref={shouldAttachObserver ? lastReservationElementRef : null}
              className="hover:bg-gray-50 border-b border-gray-200"
            >
              {/* Client */}
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {reservation.client?.name} {reservation.client?.surname}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {reservation.client?.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Chambre */}
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {reservation.chambre?.number}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {reservation.chambre?.name}
                  </div>
                </div>
              </td>

              {/* Dates */}
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <div className="text-sm text-gray-900">
                    <div>{formatDate(reservation.checkIn)}</div>
                    <div className="text-xs text-gray-500">au</div>
                    <div>{formatDate(reservation.checkOut)}</div>
                  </div>
                </div>
              </td>

              {/* Nuits */}
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {reservation.nuits || reservation.nights}
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
                {reservation.acompte > 0 && (
                  <div className="text-xs text-gray-500">
                    Acompte: {formatAmountCFA(reservation.acompte)}
                  </div>
                )}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-1 sm:space-x-2">
                  {/* Voir/Modifier */}
                  <button
                    onClick={() => viewReservation(reservation._id)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                    title="Voir/Modifier"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Actions conditionnelles */}
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => confirmReservation(reservation._id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Confirmer"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelReservation(reservation._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Annuler"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => cancelReservation(reservation._id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      title="Annuler"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )
        }}
      />

      {/* Indicateur de chargement pour l'infinite scroll */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-3">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Chargement des réservations supplémentaires...</span>
          </div>
        </div>
      )}

      {/* Message quand toutes les réservations sont chargées */}
      {allReservationsLoaded && filteredReservations.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm border-t border-gray-200">
          ✅ Toutes les réservations sont chargées ({filteredReservations.length} au total)
        </div>
      )}

      {/* Bouton de chargement manuel (fallback) */}
      {hasMore && !loadingMore && (
        <div className="text-center">
          <button
            onClick={loadMoreReservations}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Charger plus de réservations
          </button>
        </div>
      )}
    </div>
  )
}

export default Reservations