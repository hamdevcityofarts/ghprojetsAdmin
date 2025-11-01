import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  Mail,
  Undo2,
  Flag
} from 'lucide-react';
import paymentService from '../../services/paymentService';
import { usePayment } from '../../hooks/usePayments';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payment, loading, error, refetch } = usePayment(id);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/${id}`);
      setPayment(response.data.payment);
    } catch (err) {
      setError(err.response?.data?.message || 'Paiement non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!window.confirm('Confirmer le remboursement ?')) return;
    
    try {
      setProcessing(true);
      await paymentService.refundPayment(id);
      alert('Remboursement effectué avec succès');
      refetch(); // Recharger les données
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      setProcessing(true);
      const blob = await paymentService.downloadReceipt(id);
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reçu-${payment.transactionId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'refunded': return <Undo2 className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Complet';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      case 'partially_refunded': return 'Partiellement remboursé';
      default: return status;
    }
  };

  // Formatage montant F CFA
  const formatAmountCFA = (amount) => {
    return `${parseFloat(amount).toLocaleString('fr-FR')} FCFA`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (error || !payment) return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600">{error || 'Paiement non trouvé'}</p>
      <button 
        onClick={() => navigate('/dashboard/payments')}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Retour aux paiements
      </button>
    </div>
  );

  // 🔄 Construction du breakdown depuis les données réelles
  const breakdown = [
    { 
      item: `${payment.reservation?.nights || 0} nuits - ${payment.reservation?.chambre?.name || 'Chambre'}`,
      amount: payment.reservation?.totalAmount || payment.amount 
    },
    { item: 'Taxes et frais', amount: 0 }, // À adapter selon votre logique
  ];

  if (payment.type === 'deposit') {
    breakdown.push({ 
      item: 'Solde à payer', 
      amount: -(payment.reservation?.totalAmount - payment.amount || 0) 
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/payments')} 
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Paiement #{payment.transactionId}
            </h1>
            <p className="text-gray-600">Référence: {payment.transactionId}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Télécharger</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Détails du paiement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Détails du Paiement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Client</p>
                <p className="font-medium">
                  {payment.client?.name} {payment.client?.surname}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Montant</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatAmountCFA(payment.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-medium">
                  {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Méthode</p>
                <p className="font-medium capitalize">
                  {payment.method} {payment.cardLast4 ? `•••• ${payment.cardLast4}` : ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Réservation</p>
                <p className="font-medium">
                  {payment.reservation?.chambre?.name} - {payment.reservation?.nights} nuits
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Statut</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(payment.status)}
                  <span className="font-medium capitalize">
                    {getStatusText(payment.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Détail du montant */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Détail du Montant</h2>
            <div className="space-y-3">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className={item.amount < 0 ? 'text-red-600' : 'text-gray-700'}>
                    {item.item}
                  </span>
                  <span className={item.amount < 0 ? 'text-red-600 font-medium' : 'text-gray-900 font-medium'}>
                    {item.amount > 0 ? '+' : ''}{formatAmountCFA(Math.abs(item.amount))}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                <span>Total payé</span>
                <span className="text-blue-600">{formatAmountCFA(payment.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleSendReceipt}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Envoyer un reçu</span>
              </button>
              
              {payment.status === 'completed' && (
                <button 
                  onClick={handleRefund}
                  disabled={processing}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Traiter un remboursement</span>
                </button>
              )}
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                <Flag className="w-4 h-4" />
                <span>Marquer comme contesté</span>
              </button>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Informations Techniques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID Transaction</span>
                <span className="font-mono">{payment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processeur</span>
                <span className="capitalize">{payment.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="capitalize">{payment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière mise à jour</span>
                <span>{new Date(payment.updatedAt).toLocaleString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;