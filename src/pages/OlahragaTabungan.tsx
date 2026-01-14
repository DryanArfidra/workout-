import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useWalletStore } from '../store/walletStore';
import ProgressBar from '../components/common/ProgressBar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { 
  FireIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MinusIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { WORKOUT_TRANSLATIONS, WORKOUT_DETAILS, TRANSACTION_CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/dateUtils';

const OlahragaTabungan: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getTodayWorkout = useWorkoutStore((state) => state.getTodayWorkout);
  const toggleWorkout = useWorkoutStore((state) => state.toggleWorkout);
  const getWorkoutStats = useWorkoutStore((state) => state.getWorkoutStats);
  const getWallet = useWalletStore((state) => state.getWallet);
  const addTransaction = useWalletStore((state) => state.addTransaction);
  const getTransactionHistory = useWalletStore((state) => state.getTransactionHistory);
  const updateTarget = useWalletStore((state) => state.updateTarget);
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0); // Untuk force re-render

  if (!currentUser) return null;

  const workout = getTodayWorkout(currentUser.id);
  const workoutStats = getWorkoutStats(currentUser.id);
  const wallet = getWallet(currentUser.id);
  const transactions = getTransactionHistory(currentUser.id, 'daily').slice(0, 5);

  // Fungsi untuk mendapatkan workout detail yang aman
  const getSafeWorkoutDetail = (workoutType: string) => {
    // Check if workoutType exists in new system
    if (WORKOUT_DETAILS[workoutType]) {
      return WORKOUT_DETAILS[workoutType];
    }
    
    // If old workout type, map to today's workout
    const oldWorkoutTypes = ['pushup', 'situp', 'squat', 'plank', 'jumping_jacks'];
    if (oldWorkoutTypes.includes(workoutType)) {
      // Get today's workout instead
      const dayOfWeek = new Date().getDay();
      let newWorkoutType: string;
      
      switch (dayOfWeek) {
        case 1: // Monday
          newWorkoutType = 'chest-triceps';
          break;
        case 2: // Tuesday
          newWorkoutType = 'core';
          break;
        case 3: // Wednesday
          newWorkoutType = 'legs-glutes';
          break;
        case 4: // Thursday
          newWorkoutType = 'shoulders-back';
          break;
        case 5: // Friday
          newWorkoutType = 'full-body-light';
          break;
        case 6: // Saturday
          newWorkoutType = 'core-stretching';
          break;
        case 0: // Sunday
        default:
          newWorkoutType = 'full-workout';
          break;
      }
      
      return WORKOUT_DETAILS[newWorkoutType] || getDefaultWorkoutDetail();
    }
    
    // Fallback to default workout for today
    return getDefaultWorkoutDetail();
  };

  // Fungsi untuk mendapatkan default workout berdasarkan hari ini
  const getDefaultWorkoutDetail = () => {
    const dayOfWeek = new Date().getDay();
    let workoutType: string;
    
    switch (dayOfWeek) {
      case 1: workoutType = 'chest-triceps'; break;
      case 2: workoutType = 'core'; break;
      case 3: workoutType = 'legs-glutes'; break;
      case 4: workoutType = 'shoulders-back'; break;
      case 5: workoutType = 'full-body-light'; break;
      case 6: workoutType = 'core-stretching'; break;
      case 0: 
      default: workoutType = 'full-workout'; break;
    }
    
    return WORKOUT_DETAILS[workoutType] || {
      day: 'Hari ini',
      duration: 10,
      exercises: ['Lakukan aktivitas fisik ringan selama 10 menit'],
      workTime: 40,
      restTime: 20,
      rounds: 2,
      focus: 'Tetap aktif dan sehat!'
    };
  };

  const workoutDetail = getSafeWorkoutDetail(workout.workoutType);
  const workoutTranslation = WORKOUT_TRANSLATIONS[workout.workoutType] || 'Olahraga';

  const handleToggleWorkout = () => {
    toggleWorkout(currentUser.id);
    
    // Force re-render untuk update UI
    setForceUpdate(prev => prev + 1);
    
    // Tambahkan small delay untuk memastikan state sudah update
    setTimeout(() => {
      // Ambil workout terbaru untuk memastikan data fresh
      const updatedWorkout = getTodayWorkout(currentUser.id);
      console.log('Workout status updated:', updatedWorkout.completed);
    }, 50);
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !description.trim()) {
      alert('Harap isi semua field dengan benar');
      return;
    }

    addTransaction(currentUser.id, {
      type: transactionType,
      amount: numAmount,
      description: description.trim(),
      category: category || 'Lainnya',
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setShowTransactionForm(false);
  };

  const handleUpdateTarget = () => {
    const numTarget = parseFloat(target);
    if (numTarget > 0) {
      updateTarget(currentUser.id, numTarget);
      setTarget('');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Key untuk force re-render komponen workout
  const workoutKey = `workout-${workout.id}-${workout.completed}-${forceUpdate}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olahraga & Tabungan</h1>
          <p className="text-gray-600">Kelolah kesehatan fisik dan keuangan Anda</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/history/workout"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Riwayat Olahraga
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            to="/history/tabungan"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Riwayat Tabungan
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Olahraga */}
        <div className="space-y-6">
          <Card title="Olahraga Harian" key={workoutKey}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg mr-3 ${workout.completed ? 'bg-amber-100' : 'bg-gray-100'}`}>
                    <FireIcon className={`w-6 h-6 ${workout.completed ? 'text-amber-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {workoutDetail.day} - {workoutTranslation}
                    </h3>
                    <p className="text-sm text-gray-600">{workoutDetail.duration} menit • {workoutDetail.rounds} ronde</p>
                  </div>
                </div>
                
                {/* Gerakan */}
                <div className="mt-4">
                  <p className="text-gray-700 font-medium mb-2">Gerakan:</p>
                  <ul className="space-y-1">
                    {workoutDetail.exercises.map((exercise, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="mr-2">•</span>
                        <span className="text-sm">{exercise}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Detail waktu dan ronde */}
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-700">Waktu Kerja:</div>
                    <div className="font-medium">{workoutDetail.workTime} detik</div>
                    
                    <div className="text-gray-700">Waktu Istirahat:</div>
                    <div className="font-medium">{workoutDetail.restTime} detik</div>
                    
                    <div className="text-gray-700">Jumlah Ronde:</div>
                    <div className="font-medium">{workoutDetail.rounds} ronde</div>
                    
                    {workoutDetail.focus && (
                      <>
                        <div className="text-gray-700 col-span-2 mt-1 pt-2 border-t border-amber-200">Fokus:</div>
                        <div className="font-medium text-amber-700 col-span-2">
                          {workoutDetail.focus}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleToggleWorkout}
                className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-colors min-w-[120px] ${
                  workout.completed
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {workout.completed ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 inline mr-2" />
                    Selesai
                  </>
                ) : (
                  'Tandai Selesai'
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Status</span>
                <div className="flex items-center">
                  {workout.completed ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-medium">Sudah olahraga</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">Belum olahraga</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Streak</span>
                <span className="font-bold text-amber-700">{workoutStats.streak} hari</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Olahraga</span>
                <span className="font-bold text-amber-700">{workoutStats.totalWorkouts}x</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Jadwal Olahraga Minggu Ini</h4>
              <div className="space-y-2">
                {Object.entries(WORKOUT_DETAILS).map(([key, detail]) => {
                  const isTodayWorkout = workout.workoutType === key;
                  const translation = WORKOUT_TRANSLATIONS[key] || key;
                  
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg transition-colors ${
                        isTodayWorkout
                          ? 'bg-amber-100 border border-amber-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 mr-2">{detail.day}</span>
                            {isTodayWorkout && (
                              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                                HARI INI
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{translation}</p>
                        </div>
                        <span className="text-gray-700 font-medium ml-2">{detail.duration} menit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card title="Statistik Olahraga">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">Rate Penyelesaian</span>
                  <span className="font-bold text-amber-700">{workoutStats.completionRate}%</span>
                </div>
                <ProgressBar progress={workoutStats.completionRate} color="amber" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-800 mb-1">Streak Terbaik</p>
                  <p className="text-2xl font-bold text-amber-900">{workoutStats.streak} hari</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-sm text-emerald-800 mb-1">Total Menit</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {workoutStats.totalWorkouts * workoutDetail.duration}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Tabungan */}
        <div className="space-y-6">
          <Card title="Tabungan">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                <CurrencyDollarIcon className="w-10 h-10 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-purple-700 mb-2">
                Rp {wallet.balance.toLocaleString('id-ID')}
              </p>
              <p className="text-gray-600">Saldo saat ini</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Progress Target</span>
                <span className="font-bold text-purple-700">
                  {Math.round((wallet.balance / wallet.target) * 100)}%
                </span>
              </div>
              <ProgressBar 
                progress={(wallet.balance / wallet.target) * 100}
                color="purple"
                showLabel
              />
              <p className="text-sm text-gray-600 mt-2">
                Target: Rp {wallet.target.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target baru"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                onClick={handleUpdateTarget}
                variant="outline"
                className="border-purple-600 text-purple-600"
              >
                Update
              </Button>
            </div>

            <Button
              onClick={() => setShowTransactionForm(!showTransactionForm)}
              variant="primary"
              fullWidth
              icon={<PlusIcon className="w-5 h-5" />}
            >
              Tambah Transaksi
            </Button>
          </Card>

          {/* Transaction Form */}
          {showTransactionForm && (
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">
                Tambah Transaksi Baru
              </h3>
              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionType('income')}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      transactionType === 'income'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <PlusIcon className="w-4 h-4 inline mr-2" />
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('expense')}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      transactionType === 'expense'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <MinusIcon className="w-4 h-4 inline mr-2" />
                    Pengeluaran
                  </button>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Jumlah</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Keterangan</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Misal: Gaji bulanan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    {TRANSACTION_CATEGORIES[transactionType].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant={transactionType === 'income' ? 'primary' : 'secondary'}
                    fullWidth
                  >
                    Simpan Transaksi
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowTransactionForm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card title="Transaksi Terbaru">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada transaksi</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <PlusIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <MinusIcon className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{transaction.description}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {formatDate(transaction.date)}
                          <span className="mx-2">•</span>
                          {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      Rp {transaction.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Pemasukan:</span>
                <span className="text-green-600 font-medium">
                  +Rp {totalIncome.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Total Pengeluaran:</span>
                <span className="text-red-600 font-medium">
                  -Rp {totalExpense.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OlahragaTabungan;