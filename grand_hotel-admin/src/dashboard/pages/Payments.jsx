// pages/Payments.jsx
import React from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import TableCard from '../components/TableCard';
import { usePayments } from '../../hooks/usePayments';

const Payments = () => {
  const { payments, loading, error, refetch } = usePayments();

  // 🔄 Même logique d'affichage des statuts...
  const getStatusDisplay = (status, type) => {
    if (status === 'completed') {
      return type === 'deposit' ? 'acompte' : 'complet';
    }
    if (status === 'failed') return 'en retard';
    if (status === 'pending') return 'en attente';
    return status;
  };

  const getStatusIcon = (status, type) => {
    const displayStatus = getStatusDisplay(status, type);
    
    switch (displayStatus) {
      case 'complet': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'acompte': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'en retard': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'en attente': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status, type) => {
    const displayStatus = getStatusDisplay(status, type);
    
    switch (displayStatus) {
      case 'complet': return 'bg-green-100 text-green-800';
      case 'acompte': return 'bg-yellow-100 text-yellow-800';
      case 'en retard': return 'bg-red-100 text-red-800';
      case 'en attente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calcul des statistiques
  const statsData = payments.reduce((acc, payment) => {
    const status = getStatusDisplay(payment.status, payment.type);
    
    if (status === 'complet') acc.complet += payment.amount;
    else if (status === 'acompte') acc.acompte += payment.amount;
    else if (status === 'en retard') acc.retard += payment.amount;
    
    return acc;
  }, { complet: 0, acompte: 0, retard: 0 });

  // 🔄 Rendu identique mais avec vos services
  return (
    <div className="space-y-6">
      {/* En-tête identique */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
        <button 
          onClick={refetch}
          className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Statistiques identiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... même code pour les statistiques ... */}
      </div>

      {/* Tableau identique */}
      <TableCard
        title={`Historique des Paiements (${payments.length})`}
        headers={['Client', 'Montant', 'Date', 'Type', 'Statut', 'Référence', 'Actions']}
        data={payments}
        renderRow={(payment) => (
          <tr key={payment._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {payment.client?.name} {payment.client?.surname}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              €{payment.amount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
              {payment.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {getStatusIcon(payment.status, payment.type)}
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status, payment.type)}`}>
                  {getStatusDisplay(payment.status, payment.type)}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
              {payment.transactionId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                onClick={() => window.location.href = `/dashboard/payments/${payment._id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                Voir détails
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default Payments;