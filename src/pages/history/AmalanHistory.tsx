import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAmalanStore } from '../../store/amalanStore';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import {
  CalendarIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { AMALAN_TRANSLATIONS } from '../../utils/constants';
import { formatShortDate } from '../../utils/dateUtils';
import { type HistoryPeriod } from '../../types';

const AmalanHistory: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getAmalanHistory = useAmalanStore((state) => state.getAmalanHistory);
  const getAmalanStats = useAmalanStore((state) => state.getAmalanStats);

  const [period, setPeriod] = useState<HistoryPeriod>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!currentUser) return null;

  const history = getAmalanHistory(currentUser.id, period);
  const stats = getAmalanStats(currentUser.id);

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }

    setCurrentDate(newDate);
  };

  const totalAmalan = history.reduce((sum, day) => sum + day.completedCount, 0);
  const totalPossible = history.length * 6;
  const averagePerDay = history.length > 0 ? totalAmalan / history.length : 0;
  const completionRate =
    totalPossible > 0 ? (totalAmalan / totalPossible) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Amalan</h1>
          <p className="text-gray-600">Analisis perkembangan amalan harian</p>
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
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p === 'weekly' ? 'Mingguan' : 'Bulanan'}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-200 rounded-lg mr-4">
              <ChartBarIcon className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amalan</p>
              <p className="text-2xl font-bold text-gray-800">{totalAmalan}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-200 rounded-lg mr-4">
              <CalendarIcon className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata / Hari</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(averagePerDay * 10) / 10}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-200 rounded-lg mr-4">
              <ChartBarIcon className="w-8 h-8 text-amber-700" />
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
              <CalendarIcon className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hari Aktif</p>
              <p className="text-2xl font-bold text-gray-800">
                {history.filter((h) => h.completedCount > 0).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card title="Progress Amalan">
        <div className="space-y-4">
          {Object.keys(AMALAN_TRANSLATIONS).map((amalanKey) => {
            const completed = history.reduce(
              (sum, day) =>
                sum +
                (day.amalan[
                  amalanKey as keyof typeof day.amalan
                ]
                  ? 1
                  : 0),
              0
            );

            const percentage =
              history.length > 0
                ? (completed / history.length) * 100
                : 0;

            return (
              <div key={amalanKey} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    {AMALAN_TRANSLATIONS[amalanKey]}
                  </span>
                  <span className="font-medium text-emerald-700">
                    {completed}/{history.length} hari
                  </span>
                </div>
                <ProgressBar progress={percentage} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Daily Details */}
      <Card title="Detail Harian">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Tidak ada data untuk periode ini
          </p>
        ) : (
          <div className="space-y-4">
            {[...history].reverse().map((day) => (
              <div key={day.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-800">
                      {formatShortDate(day.date)}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      day.completedCount === day.totalCount
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {day.completedCount}/{day.totalCount}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(day.amalan).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center p-2 rounded ${
                        value ? 'bg-emerald-50' : 'bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          value ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          value
                            ? 'text-emerald-700'
                            : 'text-gray-600'
                        }`}
                      >
                        {AMALAN_TRANSLATIONS[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card title="Ringkasan">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Total Hari:</span>
            <span className="font-medium text-gray-800">
              {history.length} hari
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Hari Sempurna:</span>
            <span className="font-medium text-emerald-700">
              {
                history.filter(
                  (h) => h.completedCount === h.totalCount
                ).length
              }{' '}
              hari
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Hari Tidak Aktif:</span>
            <span className="font-medium text-amber-700">
              {history.filter((h) => h.completedCount === 0).length} hari
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Streak Terpanjang:</span>
            <span className="font-medium text-purple-700">
              {stats.streak} hari
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AmalanHistory;
