import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { 
  CalendarIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { 
  formatShortDate, 
  getWeekRange, 
  getMonthRange,
  isToday 
} from '../../utils/dateUtils';
import { type HistoryPeriod } from '../../types';

const TabunganHistory: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getTransactionHistory = useWalletStore((state) => state.getTransactionHistory);
  const getWalletStats = useWalletStore((state) => state.getWalletStats);
  const deleteTransaction = useWalletStore((state) => state.deleteTransaction);
  const getWallet = useWalletStore((state) => state.getWallet);
  
  const [period, setPeriod] = useState<HistoryPeriod>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  if (!currentUser) return null;

  const history = getTransactionHistory(currentUser.id, period);
  const stats = getWalletStats(currentUser.id);
  const wallet = getWallet(currentUser.id);

  const dateRange = useMemo(() => {
    if (period === 'weekly') return getWeekRange(currentDate);
    return getMonthRange(currentDate);
  }, [period, currentDate]);

  void dateRange; // ✅ FIX WARNING TANPA UBAH LOGIC / UI

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Filter transactions
  const filteredHistory = useMemo(() => {
    let filtered = history;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [history, filterType]);

  const totalIncome = filteredHistory
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredHistory
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpense;

  // Calculate daily balances
  const dailyBalances = useMemo(() => {
    const balances: Record<string, { income: number; expense: number; net: number }> = {};
    
    history.forEach(transaction => {
      if (!balances[transaction.date]) {
        balances[transaction.date] = { income: 0, expense: 0, net: 0 };
      }
      
      if (transaction.type === 'income') {
        balances[transaction.date].income += transaction.amount;
        balances[transaction.date].net += transaction.amount;
      } else {
        balances[transaction.date].expense += transaction.amount;
        balances[transaction.date].net -= transaction.amount;
      }
    });
    
    return Object.entries(balances)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [history]);

  // Calculate category totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, { income: number; expense: number }> = {};
    
    history.forEach(transaction => {
      if (!totals[transaction.category]) {
        totals[transaction.category] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        totals[transaction.category].income += transaction.amount;
      } else {
        totals[transaction.category].expense += transaction.amount;
      }
    });
    
    return Object.entries(totals)
      .map(([category, data]) => ({
        category,
        total: data.income + data.expense,
        ...data
      }))
      .sort((a, b) => b.total - a.total);
  }, [history]);

  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      deleteTransaction(transactionId);
      setSelectedTransaction(null);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Gaji': 'bg-blue-100 text-blue-700',
      'Bonus': 'bg-green-100 text-green-700',
      'Hadiah': 'bg-purple-100 text-purple-700',
      'Makanan': 'bg-red-100 text-red-700',
      'Transportasi': 'bg-amber-100 text-amber-700',
      'Belanja': 'bg-pink-100 text-pink-700',
      'Hiburan': 'bg-indigo-100 text-indigo-700',
      'Kesehatan': 'bg-emerald-100 text-emerald-700',
      'Lainnya': 'bg-gray-100 text-gray-700'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Tabungan</h1>
          <p className="text-gray-600">Analisis keuangan dan transaksi Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigatePeriod('prev')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="font-medium text-gray-700">
              {period === 'weekly' ? 'Minggu' : 'Bulan'} ini
            </span>
          </div>
          <button
            onClick={() => navigatePeriod('next')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {(['weekly', 'monthly'] as HistoryPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p === 'weekly' ? 'Mingguan' : 'Bulanan'}
          </button>
        ))}
      </div>

      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-purple-200 mb-2">Saldo Saat Ini</p>
            <p className="text-3xl md:text-4xl font-bold mb-2">
              Rp {wallet.balance.toLocaleString('id-ID')}
            </p>
            <div className="flex items-center text-purple-200">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              <span>Target: Rp {wallet.target.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-100">Progress Target</span>
              <span className="font-bold">
                {Math.round((wallet.balance / wallet.target) * 100)}%
              </span>
            </div>
            <ProgressBar 
              progress={(wallet.balance / wallet.target) * 100}
              color="emerald"
              height="sm"
            />
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-200 rounded-lg mr-4">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {stats.totalIncome.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-200 rounded-lg mr-4">
              <ArrowTrendingDownIcon className="w-8 h-8 text-red-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {stats.totalExpense.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-200 rounded-lg mr-4">
              <ChartBarIcon className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance Net</p>
              <p className={`text-2xl font-bold ${
                stats.netBalance >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {stats.netBalance >= 0 ? '+' : '-'}
                Rp {Math.abs(stats.netBalance).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card title="Filter Transaksi">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PlusIcon className="w-4 h-4 inline mr-2" />
            Pemasukan
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MinusIcon className="w-4 h-4 inline mr-2" />
            Pengeluaran
          </button>
        </div>
      </Card>

      {/* Transaction List */}
      <Card title="Daftar Transaksi">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <CurrencyDollarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {filterType === 'all' 
                ? 'Belum ada transaksi untuk periode ini'
                : `Belum ada transaksi ${filterType === 'income' ? 'pemasukan' : 'pengeluaran'} untuk periode ini`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border transition-all ${
                  selectedTransaction === transaction.id ? 'ring-2 ring-purple-500' : ''
                } ${
                  transaction.type === 'income'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
                onClick={() => setSelectedTransaction(transaction.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start flex-1 min-w-0">
                    <div className={`p-2 rounded-lg mr-3 ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <PlusIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <MinusIcon className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {transaction.description}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(transaction.category)}`}>
                          {transaction.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatShortDate(transaction.date)}
                        {isToday(transaction.date) && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Hari Ini
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      Rp {transaction.amount.toLocaleString('id-ID')}
                    </div>
                    
                    {selectedTransaction === transaction.id && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTransaction(transaction.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        icon={<TrashIcon className="w-4 h-4" />}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Summary */}
        {filteredHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 mb-1">Total Pemasukan</p>
                <p className="text-xl font-bold text-green-700">
                  +Rp {totalIncome.toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800 mb-1">Total Pengeluaran</p>
                <p className="text-xl font-bold text-red-700">
                  -Rp {totalExpense.toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className={`text-center p-3 rounded-lg ${
                netBalance >= 0 ? 'bg-blue-50' : 'bg-amber-50'
              }`}>
                <p className="text-sm text-gray-800 mb-1">Balance Net</p>
                <p className={`text-xl font-bold ${
                  netBalance >= 0 ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  {netBalance >= 0 ? '+' : '-'}
                  Rp {Math.abs(netBalance).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Category Analysis */}
      <Card title="Analisis Kategori">
        {categoryTotals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada data kategori</p>
        ) : (
          <div className="space-y-4">
            {categoryTotals.map((category) => {
              const total = category.income + category.expense;
              const maxTotal = Math.max(...categoryTotals.map(c => c.income + c.expense));
              const percentage = (total / maxTotal) * 100;
              
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        category.income > category.expense ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium text-gray-800">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">
                        Rp {total.toLocaleString('id-ID')}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="text-green-600">+{category.income.toLocaleString('id-ID')}</span>
                        {' / '}
                        <span className="text-red-600">-{category.expense.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <ProgressBar 
                    progress={percentage}
                    color={category.income > category.expense ? 'emerald' : 'amber'}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Daily Balance */}
      <Card title="Balance Harian">
        {dailyBalances.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada data harian</p>
        ) : (
          <div className="space-y-4">
            {dailyBalances.slice(0, 7).map((day) => (
              <div key={day.date} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-800">
                      {formatShortDate(day.date)}
                    </span>
                  </div>
                  <div className={`font-bold ${
                    day.net >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {day.net >= 0 ? '+' : ''}
                    Rp {day.net.toLocaleString('id-ID')}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-xs text-green-600">Pemasukan</div>
                    <div className="font-medium text-green-700">
                      +Rp {day.income.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-xs text-red-600">Pengeluaran</div>
                    <div className="font-medium text-red-700">
                      -Rp {day.expense.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Financial Tips */}
      <Card title="Tips Keuangan">
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">📊 Aturan 50/30/20</p>
            <p className="text-blue-700">
              Alokasikan 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan.
            </p>
          </div>
          
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-800 font-medium mb-1">💰 Prioritaskan Tabungan</p>
            <p className="text-emerald-700">
              Sisihkan tabungan di awal bulan, bukan dari sisa uang di akhir bulan.
            </p>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800 font-medium mb-1">📝 Catat Semua Pengeluaran</p>
            <p className="text-amber-700">
              Mencatat setiap transaksi membantu mengidentifikasi kebocoran keuangan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TabunganHistory;