import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWorkoutStore } from '../../store/workoutStore';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { 
  CalendarIcon,
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  WORKOUT_TRANSLATIONS,
  getRandomQuote 
} from '../../utils/constants';
import { 
  formatShortDate, 
  getWeekRange, 
  getMonthRange,
  isToday 
} from '../../utils/dateUtils';
import {type HistoryPeriod } from '../../types';

const WorkoutHistory: React.FC = () => {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);
  
  const [period, setPeriod] = useState<HistoryPeriod>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string | null>(null);

  if (!currentUser) return null;

  const history = getWorkoutHistory(currentUser.id, period);

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

  // Filter history by workout type if selected
  const filteredHistory = selectedWorkoutType
    ? history.filter(workout => workout.workoutType === selectedWorkoutType)
    : history;

  const completedWorkouts = history.filter(w => w.completed).length;
  const completionRate = history.length > 0 ? (completedWorkouts / history.length) * 100 : 0;
  
  // Calculate workout type distribution
  const workoutTypeStats = useMemo(() => {
    const stats: Record<string, { count: number; completed: number }> = {};
    
    history.forEach(workout => {
      if (!stats[workout.workoutType]) {
        stats[workout.workoutType] = { count: 0, completed: 0 };
      }
      stats[workout.workoutType].count++;
      if (workout.completed) {
        stats[workout.workoutType].completed++;
      }
    });
    
    return Object.entries(stats).map(([type, data]) => ({
      type,
      name: WORKOUT_TRANSLATIONS[type],
      count: data.count,
      completed: data.completed,
      percentage: (data.completed / data.count) * 100
    }));
  }, [history]);

  // Calculate streak info
  const calculateStreaks = () => {
    const sortedHistory = [...history].sort((a, b) => a.date.localeCompare(b.date));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const workout of sortedHistory) {
      if (workout.completed) {
        tempStreak++;
        currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak, longestStreak };
  };

  const { currentStreak, longestStreak } = calculateStreaks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Olahraga</h1>
          <p className="text-gray-600">Analisis perkembangan kebugaran Anda</p>
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
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p === 'weekly' ? 'Mingguan' : 'Bulanan'}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-200 rounded-lg mr-4">
              <FireIcon className="w-8 h-8 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Olahraga</p>
              <p className="text-2xl font-bold text-gray-800">{completedWorkouts}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-200 rounded-lg mr-4">
              <ChartBarIcon className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(completionRate)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-200 rounded-lg mr-4">
              <CalendarIcon className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Streak Saat Ini</p>
              <p className="text-2xl font-bold text-gray-800">{currentStreak} hari</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-200 rounded-lg mr-4">
              <FireIcon className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Streak Terpanjang</p>
              <p className="text-2xl font-bold text-gray-800">{longestStreak} hari</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Workout Type Filter */}
      <Card title="Filter Jenis Olahraga">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedWorkoutType(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedWorkoutType === null
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {workoutTypeStats.map((workout) => (
            <button
              key={workout.type}
              onClick={() => setSelectedWorkoutType(workout.type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedWorkoutType === workout.type
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {workout.name} ({workout.completed}/{workout.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Workout Type Distribution */}
      <Card title="Distribusi Jenis Olahraga">
        <div className="space-y-4">
          {workoutTypeStats.map((workout) => (
            <div key={workout.type} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    workout.percentage === 100 ? 'bg-green-500' :
                    workout.percentage >= 50 ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-800">{workout.name}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {workout.completed}/{workout.count} ({Math.round(workout.percentage)}%)
                </span>
              </div>
              <ProgressBar 
                progress={workout.percentage}
                color={
                  workout.percentage === 100 ? 'emerald' :
                  workout.percentage >= 50 ? 'amber' : 'purple'
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Workout Log */}
      <Card title="Log Olahraga Harian">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <FireIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {selectedWorkoutType 
                ? `Tidak ada data untuk ${WORKOUT_TRANSLATIONS[selectedWorkoutType]}`
                : 'Tidak ada data olahraga untuk periode ini'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...filteredHistory].reverse().map((workout) => (
              <div 
                key={workout.id} 
                className={`p-4 rounded-lg border ${
                  workout.completed 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      workout.completed ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <FireIcon className={`w-5 h-5 ${
                        workout.completed ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {WORKOUT_TRANSLATIONS[workout.workoutType]}
                        </h3>
                        {isToday(workout.date) && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Hari Ini
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatShortDate(workout.date)}
                        <span className="mx-2">•</span>
                        <span>{workout.duration} menit</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`flex items-center px-3 py-1 rounded-full ${
                      workout.completed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {workout.completed ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          <span className="font-medium">Selesai</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          <span className="font-medium">Terlewat</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {workout.completed && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-sm text-emerald-700">
                      🎉 Anda telah menyelesaikan {WORKOUT_TRANSLATIONS[workout.workoutType].toLowerCase()} selama {workout.duration} menit!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Motivation Quote */}
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="flex items-start">
          <div className="p-2 bg-amber-200 rounded-lg mr-4">
            <FireIcon className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">Motivasi Olahraga</h3>
            <p className="text-amber-700 italic">"{getRandomQuote()}"</p>
            <p className="text-sm text-amber-600 mt-2">
              Setiap gerakan membuatmu lebih sehat!
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card title="Ringkasan Statistik">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 mb-2">Performansi</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Hari:</span>
                <span className="font-medium text-gray-800">{history.length} hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Hari Berolahraga:</span>
                <span className="font-medium text-emerald-700">{completedWorkouts} hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Hari Terlewat:</span>
                <span className="font-medium text-amber-700">
                  {history.length - completedWorkouts} hari
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Completion Rate:</span>
                <span className="font-medium text-blue-700">
                  {Math.round(completionRate)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 mb-2">Streak Info</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Streak Saat Ini:</span>
                <span className="font-medium text-amber-700">{currentStreak} hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Streak Terpanjang:</span>
                <span className="font-medium text-purple-700">{longestStreak} hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Menit:</span>
                <span className="font-medium text-green-700">
                  {completedWorkouts * 10} menit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Jenis Olahraga:</span>
                <span className="font-medium text-gray-800">
                  {workoutTypeStats.length} jenis
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Rekomendasi</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-1">Target Mingguan</p>
              <p className="text-blue-700">
                Cobalah untuk mencapai 5 hari olahraga dalam seminggu!
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-800 font-medium mb-1">Tips</p>
              <p className="text-emerald-700">
                Variasikan jenis olahraga untuk hasil yang lebih baik!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkoutHistory;