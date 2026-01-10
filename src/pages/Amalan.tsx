import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAmalanStore } from '../store/amalanStore';
import { useWaterStore } from '../store/waterStore';
import ProgressBar from '../components/common/ProgressBar';
import Card from '../components/common/Card';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  BeakerIcon,
  ArrowRightIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { AMALAN_TRANSLATIONS } from '../utils/constants';


const Amalan: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getTodayAmalan = useAmalanStore((state) => state.getTodayAmalan);
  const updateAmalan = useAmalanStore((state) => state.updateAmalan);
  const getAmalanStats = useAmalanStore((state) => state.getAmalanStats);
  const getTodayWater = useWaterStore((state) => state.getTodayWater);
  const addGlass = useWaterStore((state) => state.addGlass);
  const removeGlass = useWaterStore((state) => state.removeGlass);
  
  const [selectedAmalan, setSelectedAmalan] = useState<string | null>(null);

  if (!currentUser) return null;

  const amalan = getTodayAmalan(currentUser.id);
  const water = getTodayWater(currentUser.id);
  const stats = getAmalanStats(currentUser.id);

  const handleAmalanClick = (amalanName: keyof typeof amalan.amalan) => {
    updateAmalan(currentUser.id, amalanName, !amalan.amalan[amalanName]);
    setSelectedAmalan(amalanName);
    setTimeout(() => setSelectedAmalan(null), 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Amalan Sunnah</h1>
          <p className="text-gray-600">Lacak amalan harian dan air putih Anda</p>
        </div>
        <Link
          to="/history/amalan"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
        >
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Lihat Riwayat
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-200 rounded-lg mr-4">
              <CheckCircleIcon className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amalan</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-200 rounded-lg mr-4">
              <ClockIcon className="w-8 h-8 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-gray-800">{stats.streak} hari</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-200 rounded-lg mr-4">
              <ChartBarIcon className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata</p>
              <p className="text-2xl font-bold text-gray-800">{stats.dailyAverage}/hari</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Amalan Checklist */}
      <Card title="Checklist Amalan Sunnah">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Progress Harian</span>
            <span className="font-bold text-emerald-700">
              {amalan.completedCount}/{amalan.totalCount}
            </span>
          </div>
          <ProgressBar 
            progress={(amalan.completedCount / amalan.totalCount) * 100}
            showLabel
          />
        </div>

        <div className="space-y-3">
          {Object.entries(amalan.amalan).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAmalanClick(key as keyof typeof amalan.amalan)}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                selectedAmalan === key ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
              } ${
                value
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  value ? 'bg-emerald-100' : 'bg-gray-200'
                }`}>
                  {value ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold ${
                    value ? 'text-emerald-700' : 'text-gray-700'
                  }`}>
                    {AMALAN_TRANSLATIONS[key]}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {value ? 'Sudah dikerjakan' : 'Belum dikerjakan'}
                  </p>
                </div>
              </div>
              <ArrowRightIcon className={`w-5 h-5 ${
                value ? 'text-emerald-500' : 'text-gray-400'
              }`} />
            </button>
          ))}
        </div>
      </Card>

      {/* Water Tracker */}
      <Card title="Tracker Air Putih">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <BeakerIcon className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-5xl font-bold text-blue-700 mb-2">
            {water.current}<span className="text-2xl text-blue-600">/{water.target}</span>
          </p>
          <p className="text-gray-600">Gelas hari ini</p>
        </div>

        <div className="mb-6">
          <ProgressBar 
            progress={(water.current / water.target) * 100}
            color="blue"
            showLabel
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => removeGlass(currentUser.id)}
            disabled={water.current === 0}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              water.current === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            -1 Gelas
          </button>
          
          <button
            onClick={() => addGlass(currentUser.id)}
            disabled={water.current >= water.target}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              water.current >= water.target
                ? 'bg-blue-200 text-blue-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            +1 Gelas
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: water.target }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center ${
                  index < water.current
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Amalan;