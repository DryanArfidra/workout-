import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import Card from '../../components/common/Card';
import { formatCurrency, getTransactionColor, getTransactionIcon } from '../../utils/constants';
import { formatDate, getTodayDate, getWeekRange, getMonthRange } from '../../utils/dateUtils';
import { 
  CalendarIcon, 
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

type FilterPeriod = 'daily' | 'weekly' | 'monthly';

const KeuanganHistory: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getTransactionHistory = useWalletStore((state) => state.getTransactionHistory);
  const getWalletStats = useWalletStore((state) => state.getWalletStats);
  
  const [period, setPeriod] = useState<FilterPeriod>('daily');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'saving'>('all');
  
  if (!currentUser) return null;
  
  const transactions = getTransactionHistory(currentUser.id, period);
  const stats = getWalletStats(currentUser.id);
  
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') return transactions;
    return transactions.filter(t => t.type === filterType);
  }, [transactions, filterType]);
  
  const getPeriodLabel = () => {
    const now = new Date();
    switch (period) {
      case 'daily':
        return formatDate(getTodayDate());
      case 'weekly': {
        const range = getWeekRange(now);
        return `${formatDate(range.start)} - ${formatDate(range.end)}`;
      }
      case 'monthly': {
        const range = getMonthRange(now);
        return `${formatDate(range.start)} - ${formatDate(range.end)}`;
      }
    }
  };
  
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const saving = filteredTransactions
      .filter(t => t.type === 'saving')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expense, saving };
  }, [filteredTransactions]);
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Keuangan</h1>
        <p className="text-gray-600">Lihat semua transaksi pemasukan, pengeluaran, dan tabungan</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">Pemasukan</p>
          <p className="text-sm font-bold text-green-700">{formatCurrency(stats.totalIncomeThisMonth)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">Pengeluaran</p>
          <p className="text-sm font-bold text-red-700">{formatCurrency(stats.totalExpenseThisMonth)}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">Tabungan</p>
          <p className="text-sm font-bold text-purple-700">{formatCurrency(stats.totalSavingThisMonth)}</p>
        </div>
      </div>
      
      {/* Filter Controls */}
      <Card>
        <div className="space-y-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Periode
            </label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    period === p
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{getPeriodLabel()}</p>
          </div>
          
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FunnelIcon className="w-4 h-4 inline mr-1" />
              Jenis Transaksi
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Semua', color: 'gray' },
                { value: 'income', label: 'Pemasukan', color: 'green' },
                { value: 'expense', label: 'Pengeluaran', color: 'red' },
                { value: 'saving', label: 'Tabungan', color: 'purple' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === type.value
                      ? `bg-${type.color}-600 text-white`
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-600">Total Pemasukan</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(totals.income)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Pengeluaran</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(totals.expense)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Tabungan</p>
            <p className="text-lg font-bold text-purple-700">{formatCurrency(totals.saving)}</p>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Transaksi</h3>
          <button
            onClick={() => {
              setPeriod('daily');
              setFilterType('all');
            }}
            className="text-purple-600 text-sm hover:text-purple-800 flex items-center"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada transaksi</p>
            <p className="text-sm text-gray-400 mt-1">
              untuk periode yang dipilih
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
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
                    <div className="flex items-center text-xs text-gray-500 flex-wrap gap-x-2">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.category}</span>
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ml-3 whitespace-nowrap ${
                  transaction.type === 'income' ? 'text-green-600' : 
                  transaction.type === 'expense' ? 'text-red-600' : 'text-purple-600'
                }`}>
                  {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '→'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default KeuanganHistory;