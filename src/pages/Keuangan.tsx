import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWalletStore } from '../store/walletStore';
import Card from '../components/common/Card';
import TransactionForm from '../components/keuangan/TransactionForm';
import QuickActionsKeuangan from '../components/keuangan/QuickActionsKeuangan';
import SavingTargetCard from '../components/keuangan/SavingTargetCard';
import StatisticsCard from '../components/keuangan/StatisticsCard';
import TransferModal from '../components/keuangan/TransferModal';
import { formatCurrency, getTransactionColor, getTransactionIcon } from '../utils/constants';
import { 
  CurrencyDollarIcon, 
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '../utils/dateUtils';

const Keuangan: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getWallet = useWalletStore((state) => state.getWallet);
  const addTransaction = useWalletStore((state) => state.addTransaction);
  const transferToSaving = useWalletStore((state) => state.transferToSaving);
  const updateTarget = useWalletStore((state) => state.updateTarget);
  const getTransactionHistory = useWalletStore((state) => state.getTransactionHistory);
  const getWalletStats = useWalletStore((state) => state.getWalletStats);
  
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  if (!currentUser) return null;
  
  const wallet = getWallet(currentUser.id);
  const stats = getWalletStats(currentUser.id);
  const recentTransactions = getTransactionHistory(currentUser.id, 'daily', 5);
  
  const forceRefresh = () => setRefreshKey(prev => prev + 1);
  
  const handleAddIncome = async (data: { type: 'income' | 'expense'; amount: number; category: string; description: string }) => {
    setIsLoading(true);
    const result = addTransaction(currentUser.id, {
      type: 'income',
      amount: data.amount,
      category: data.category,
      description: data.description,
    });
    
    if (result.success) {
      setShowIncomeForm(false);
      forceRefresh();
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };
  
  const handleAddExpense = async (data: { type: 'income' | 'expense'; amount: number; category: string; description: string }) => {
    setIsLoading(true);
    const result = addTransaction(currentUser.id, {
      type: 'expense',
      amount: data.amount,
      category: data.category,
      description: data.description,
    });
    
    if (result.success) {
      setShowExpenseForm(false);
      forceRefresh();
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };
  
  const handleTransferToSaving = async (amount: number, description: string) => {
    setIsLoading(true);
    const result = transferToSaving(currentUser.id, amount, description);
    
    if (result.success) {
      setShowTransferModal(false);
      forceRefresh();
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };
  
  const handleUpdateTarget = (newTarget: number) => {
    updateTarget(currentUser.id, newTarget);
    forceRefresh();
  };
  
  const totalBalance = wallet.mainBalance + wallet.savingBalance;
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Keuangan Saya</h1>
        <p className="text-gray-600">Kelola pemasukan, pengeluaran, dan tabungan</p>
      </div>
      
      {/* Main Balance Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="text-center">
          <p className="text-purple-100 mb-2">Total Kekayaan</p>
          <p className="text-4xl font-bold mb-4">{formatCurrency(totalBalance)}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-purple-500">
            <div>
              <p className="text-purple-100 text-sm">Saldo Utama</p>
              <p className="text-xl font-semibold">{formatCurrency(wallet.mainBalance)}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Saldo Tabungan</p>
              <p className="text-xl font-semibold">{formatCurrency(wallet.savingBalance)}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Pemasukan</span>
          </div>
          <p className="text-xl font-bold text-green-700">
            {formatCurrency(stats.totalIncomeThisMonth)}
          </p>
          <p className="text-xs text-gray-500">Bulan ini</p>
        </div>
        
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
              <CurrencyDollarIcon className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-600">Pengeluaran</span>
          </div>
          <p className="text-xl font-bold text-red-700">
            {formatCurrency(stats.totalExpenseThisMonth)}
          </p>
          <p className="text-xs text-gray-500">Bulan ini</p>
        </div>
      </div>
      
      {/* Saving Target Card */}
      <SavingTargetCard
        currentSaving={wallet.savingBalance}
        target={wallet.target}
        onUpdateTarget={handleUpdateTarget}
      />
      
      {/* Statistics Card */}
      <StatisticsCard
        totalIncome={stats.totalIncomeThisMonth}
        totalExpense={stats.totalExpenseThisMonth}
        totalSaving={stats.totalSavingThisMonth}
        savingPercentage={stats.savingPercentage}
      />
      
      {/* Quick Actions */}
      <QuickActionsKeuangan
        onAddIncome={() => setShowIncomeForm(true)}
        onAddExpense={() => setShowExpenseForm(true)}
        onTransferToSaving={() => setShowTransferModal(true)}
        onViewHistory={() => navigate('/history/keuangan')}
      />
      
      {/* Recent Transactions */}
      <Card title="Transaksi Terbaru">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada transaksi</p>
            <p className="text-sm text-gray-400 mt-1">
              Tambahkan pemasukan atau pengeluaran untuk memulai
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className={`p-2 rounded-lg mr-3 ${getTransactionColor(transaction.type)}`}>
                    <span className="font-bold">
                      {getTransactionIcon(transaction.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{transaction.description}</h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {formatDate(transaction.date)}
                      <span className="mx-2">•</span>
                      {transaction.category}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ml-3 ${
                  transaction.type === 'income' ? 'text-green-600' : 
                  transaction.type === 'expense' ? 'text-red-600' : 'text-purple-600'
                }`}>
                  {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '→'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
            
            {recentTransactions.length > 0 && (
              <button
                onClick={() => navigate('/history/keuangan')}
                className="w-full mt-2 py-2 text-center text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors"
              >
                Lihat Semua Transaksi
              </button>
            )}
          </div>
        )}
      </Card>
      
      {/* Modals */}
      {showIncomeForm && (
        <TransactionForm
          onClose={() => setShowIncomeForm(false)}
          onSubmit={handleAddIncome}
          isLoading={isLoading}
        />
      )}
      
      {showExpenseForm && (
        <TransactionForm
          onClose={() => setShowExpenseForm(false)}
          onSubmit={handleAddExpense}
          isLoading={isLoading}
        />
      )}
      
      {showTransferModal && (
        <TransferModal
          onClose={() => setShowTransferModal(false)}
          onSubmit={handleTransferToSaving}
          isLoading={isLoading}
          currentBalance={wallet.mainBalance}
        />
      )}
    </div>
  );
};

export default Keuangan;