import React, { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import NotificationContainer from './layout/NontificationContainer';
import { useAuthStore } from './store/authStore';
import { useAmalanStore } from './store/amalanStore';
import { useWaterStore } from './store/waterStore';
import { useWorkoutStore } from './store/workoutStore';
import { getTodayDate, isSameDay } from './utils/dateUtils';
import { useNotifications } from './utils/nontificationManager';

const App: React.FC = () => {
  const resetDailyAmalan = useAmalanStore((state) => state.resetDailyAmalan);
  const resetDailyWater = useWaterStore((state) => state.resetDailyWater);
  const resetDailyWorkout = useWorkoutStore((state) => state.resetDailyWorkout);
  const { currentUser } = useAuthStore();
  const { showInfo } = useNotifications();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [dailyResetChecked, setDailyResetChecked] = useState(false);

  // Initialize daily reset check
  useEffect(() => {
    const checkAndResetDailyData = () => {
      const today = getTodayDate();
      const lastReset = localStorage.getItem('lastDailyReset');
      
      // If it's a new day, reset all daily data
      if (!lastReset || !isSameDay(lastReset, today)) {
        console.log('Resetting daily data for new day:', today);
        
        resetDailyAmalan();
        resetDailyWater();
        resetDailyWorkout();
        
        // Update all stores to ensure today's data is created
        localStorage.setItem('lastDailyReset', today);
        
        // Show notification
        showInfo(
          'Hari Baru Dimulai!',
          'Data harian telah direset. Selamat beraktivitas!',
          5000
        );
        
        // Force re-initialization of today's data
        if (currentUser) {
          // Trigger creation of today's records by accessing them
          const amalanStore = useAmalanStore.getState();
          const waterStore = useWaterStore.getState();
          const workoutStore = useWorkoutStore.getState();
          
          amalanStore.getTodayAmalan(currentUser.id);
          waterStore.getTodayWater(currentUser.id);
          workoutStore.getTodayWorkout(currentUser.id);
        }
      }
      
      setDailyResetChecked(true);
      setIsInitialized(true);
    };

    // Check immediately
    checkAndResetDailyData();

    // Set up interval to check every minute (in case app runs across midnight)
    const intervalId = setInterval(checkAndResetDailyData, 60000); // 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [resetDailyAmalan, resetDailyWater, resetDailyWorkout, currentUser, showInfo]);

  // Check for multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lastDailyReset') {
        // If another tab updated the reset date, re-check
        const today = getTodayDate();
        const lastReset = localStorage.getItem('lastDailyReset');
        
        if (!lastReset || !isSameDay(lastReset, today)) {
          window.location.reload(); // Reload to ensure fresh data
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading while initializing
  if (!isInitialized || !dailyResetChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <span className="text-2xl text-emerald-600">🕌</span>
          </div>
          <h2 className="text-xl font-semibold text-emerald-700 mb-2">
            My Islamic Tracker
          </h2>
          <p className="text-gray-600">Menyiapkan aplikasi...</p>
          <div className="mt-4">
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NotificationContainer />
      <AppRoutes />
      
    </div>
  );
};

export default App;