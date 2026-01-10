import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWaterStore } from '../../store/waterStore';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { 
  CalendarIcon,
  BeakerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { formatShortDate, getWeekRange, getMonthRange } from '../../utils/dateUtils';
import {type HistoryPeriod } from '../../types';

const WaterHistory: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getWaterHistory = useWaterStore((state) => state.getWaterHistory);
  
  const [period, setPeriod] = useState<HistoryPeriod>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!currentUser) return null;

  const history = getWaterHistory(currentUser.id, period);

  useMemo(() => {
    if (period === 'weekly') return getWeekRange(currentDate);
    return getMonthRange(currentDate);
  }, [period, currentDate]);

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const totalGlasses = history.reduce((sum, day) => sum + day.current, 0);
  const averagePerDay = history.length > 0 ? totalGlasses / history.length : 0;
  const completionDays = history.filter(day => day.current >= day.target).length;
  const completionRate = history.length > 0 ? (completionDays / history.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Air Putih</h1>
          <p className="text-gray-600">Analisis konsumsi air harian</p>
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
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p === 'weekly' ? 'Mingguan' : 'Bulanan'}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-200 rounded-lg mr-4">
              <BeakerIcon className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gelas</p>
              <p className="text-2xl font-bold text-gray-800">{totalGlasses}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-200 rounded-lg mr-4">
              <ChartBarIcon className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata/Hari</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(averagePerDay * 10) / 10}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-200 rounded-lg mr-4">
              <CalendarIcon className="w-8 h-8 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(completionRate)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-200 rounded-lg mr-4">
              <BeakerIcon className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hari Target Tercapai</p>
              <p className="text-2xl font-bold text-gray-800">{completionDays}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Progress */}
      <Card title="Progress Harian">
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Tidak ada data untuk periode ini</p>
          ) : (
            [...history].reverse().map((day) => {
              const percentage = (day.current / day.target) * 100;
              
              return (
                <div key={day.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-800">
                        {formatShortDate(day.date)}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      day.current >= day.target
                        ? 'bg-blue-100 text-blue-700'
                        : day.current >= day.target / 2
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {day.current}/{day.target}
                    </span>
                  </div>
                  <ProgressBar 
                    progress={percentage}
                    color={
                      day.current >= day.target ? 'blue' :
                      day.current >= day.target / 2 ? 'amber' : 'emerald'
                    }
                  />
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Visual Chart */}
      <Card title="Visualisasi Konsumsi">
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {history.slice(0, 7).map((day) => {
              const percentage = (day.current / day.target) * 100;
              const height = Math.max(20, (percentage / 100) * 80);
              
              return (
                <div key={day.id} className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-1">
                    {formatShortDate(day.date).split(' ')[0]}
                  </div>
                  <div className="relative w-8">
                    <div 
                      className={`w-8 rounded-t-lg ${
                        day.current >= day.target ? 'bg-blue-500' :
                        day.current >= day.target / 2 ? 'bg-blue-400' : 'bg-blue-300'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                      {day.current}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded mr-1" />
              <span>Kurang dari 4 gelas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded mr-1" />
              <span>4-7 gelas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1" />
              <span>8+ gelas</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card title="Ringkasan">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Total Hari:</span>
            <span className="font-medium text-gray-800">{history.length} hari</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Hari Target Tercapai:</span>
            <span className="font-medium text-blue-700">{completionDays} hari</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Rata-rata Gelas:</span>
            <span className="font-medium text-emerald-700">
              {Math.round(averagePerDay * 10) / 10} gelas/hari
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Completion Rate:</span>
            <span className="font-medium text-amber-700">
              {Math.round(completionRate)}%
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WaterHistory;