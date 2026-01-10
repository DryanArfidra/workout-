import React, { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { useAmalanStore } from './store/amalanStore';
import { useWaterStore } from './store/waterStore';
import { useWorkoutStore } from './store/workoutStore';
import { getTodayDate, isSameDay } from './utils/dateUtils';

const App: React.FC = () => {
  const resetDailyAmalan = useAmalanStore((state) => state.resetDailyAmalan);
  const resetDailyWater = useWaterStore((state) => state.resetDailyWater);
  const resetDailyWorkout = useWorkoutStore((state) => state.resetDailyWorkout);
  const { currentUser } = useAuthStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAndResetDailyData = () => {
      const today = getTodayDate();
      const lastReset = localStorage.getItem('lastDailyReset');

      // Jika hari berganti → reset data harian
      if (!lastReset || !isSameDay(lastReset, today)) {
        resetDailyAmalan();
        resetDailyWater();
        resetDailyWorkout();
        localStorage.setItem('lastDailyReset', today);

        // Pastikan data hari ini dibuat ulang
        if (currentUser) {
          const amalanStore = useAmalanStore.getState();
          const waterStore = useWaterStore.getState();
          const workoutStore = useWorkoutStore.getState();

          amalanStore.getTodayAmalan(currentUser.id);
          waterStore.getTodayWater(currentUser.id);
          workoutStore.getTodayWorkout(currentUser.id);
        }
      }

      setIsInitialized(true);
    };

    checkAndResetDailyData();

    // Cek ulang setiap 1 menit (jika aplikasi dibuka melewati tengah malam)
    const intervalId = setInterval(checkAndResetDailyData, 60000);

    return () => clearInterval(intervalId);
  }, [
    resetDailyAmalan,
    resetDailyWater,
    resetDailyWorkout,
    currentUser,
  ]);

  // Loading awal aplikasi
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading aplikasi...</span>
      </div>
    );
  }

  return <AppRoutes />;
};

export default App;
