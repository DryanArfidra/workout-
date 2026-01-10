import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAmalanStore } from '../store/amalanStore';
import { useWaterStore } from '../store/waterStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useWalletStore } from '../store/walletStore';
import ProgressBar from '../components/common/ProgressBar';
import Card from '../components/common/Card';
import { 
  getGreeting, 
  getRandomQuote,
  WORKOUT_TRANSLATIONS,
  AMALAN_TRANSLATIONS 
} from '../utils/constants';
import { formatDate } from '../utils/dateUtils';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  FireIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';


const Home: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getTodayAmalan = useAmalanStore((state) => state.getTodayAmalan);
  const getTodayWater = useWaterStore((state) => state.getTodayWater);
  const getTodayWorkout = useWorkoutStore((state) => state.getTodayWorkout);
  const getWallet = useWalletStore((state) => state.getWallet);
  
  const [quote, setQuote] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setQuote(getRandomQuote());
    setCurrentDate(formatDate(new Date().toISOString()));
  }, []);

  if (!currentUser) return null;

  const amalan = getTodayAmalan(currentUser.id);
  const water = getTodayWater(currentUser.id);
  const workout = getTodayWorkout(currentUser.id);
  const wallet = getWallet(currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{getGreeting()}, {currentUser.username}!</h1>
        <p className="text-emerald-100">{currentDate}</p>
        <div className="mt-4">
          <p className="text-emerald-50 italic">"{quote}"</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Amalan Card */}
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <BookOpenIcon className="w-5 h-5 text-emerald-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Amalan Sunnah</h3>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {amalan.completedCount}/{amalan.totalCount}
              </p>
            </div>
            <div className={`p-2 rounded-full ${amalan.completedCount === amalan.totalCount ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              {amalan.completedCount === amalan.totalCount ? (
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar progress={(amalan.completedCount / amalan.totalCount) * 100} />
          </div>
        </Card>

        {/* Water Card */}
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <BeakerIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Air Putih</h3>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {water.current}/{water.target}
              </p>
            </div>
            <div className={`p-2 rounded-full ${water.current >= water.target ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <BeakerIcon className={`w-6 h-6 ${water.current >= water.target ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar 
              progress={(water.current / water.target) * 100} 
              color="blue"
            />
          </div>
        </Card>

        {/* Workout Card */}
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <FireIcon className="w-5 h-5 text-amber-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Olahraga</h3>
              </div>
              <p className="text-lg font-bold text-amber-700">
                {WORKOUT_TRANSLATIONS[workout.workoutType]}
              </p>
              <p className="text-sm text-gray-600">{workout.duration} menit</p>
            </div>
            <div className={`p-2 rounded-full ${workout.completed ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <FireIcon className={`w-6 h-6 ${workout.completed ? 'text-amber-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              checked={workout.completed}
              readOnly
              className="w-5 h-5 text-amber-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              {workout.completed ? 'Sudah selesai' : 'Belum olahraga'}
            </span>
          </div>
        </Card>

        {/* Wallet Card */}
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <CurrencyDollarIcon className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Tabungan</h3>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                Rp {wallet.balance.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-600">
                Target: Rp {wallet.target.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar 
              progress={(wallet.balance / wallet.target) * 100} 
              color="purple"
            />
          </div>
        </Card>
      </div>

      {/* Amalan Details */}
      <Card title="Amalan Hari Ini">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(amalan.amalan).map(([key, value]) => (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg ${
                value ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'
              }`}
            >
              <span className={`font-medium ${value ? 'text-emerald-700' : 'text-gray-700'}`}>
                {AMALAN_TRANSLATIONS[key]}
              </span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                value ? 'bg-emerald-500' : 'bg-gray-300'
              }`}>
                {value ? (
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                ) : (
                  <XCircleIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Aksi Cepat">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-left">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <BeakerIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Tambah Air</h4>
                <p className="text-sm text-gray-600">Tambahkan 1 gelas air putih</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-left">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <FireIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Tandai Olahraga</h4>
                <p className="text-sm text-gray-600">Tandai sudah olahraga hari ini</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Home;