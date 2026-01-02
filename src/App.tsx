import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import WeeklyWorkout from './pages/WeeklyWorkout';
import { workoutData } from './data/workouts';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'workout'>('home');
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  // Calculate weekly progress
  useEffect(() => {
    const calculateProgress = () => {
      const savedData = localStorage.getItem('workout-progress');
      if (savedData) {
        const data = JSON.parse(savedData) as {
          completedExercises?: Record<string, number[]>;
        };

        const completedExercises: Record<string, number[]> =
          data.completedExercises || {};

        const totalExercises = workoutData.reduce(
          (sum, day) => sum + day.exercises.length,
          0
        );

        const completedTotal = Object.values(completedExercises).reduce(
          (sum, arr) => sum + arr.length,
          0
        );

        const progress =
          totalExercises > 0 ? (completedTotal / totalExercises) * 100 : 0;

        setWeeklyProgress(progress);
      }
    };

    calculateProgress();
    // Update progress every 30 seconds in case of changes in other tabs
    const interval = setInterval(calculateProgress, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-3">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('workout')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'workout'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Weekly Workout
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-12">
        {currentPage === 'home' ? (
          <Home
            onStartWorkout={() => setCurrentPage('workout')}
            weeklyProgress={weeklyProgress}
          />
        ) : (
          <WeeklyWorkout />
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">
            Daily Home Workout Tracker
          </p>
          <p className="text-gray-400 text-sm">
            Designed for height: 168cm • Weight: 75kg • Goal: Fat Loss + Basic Muscle
          </p>
          <p className="text-gray-400 text-sm mt-2">
            No equipment needed • Beginner friendly • 10-20 minutes daily
          </p>
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            <p>💪 Consistency is key to transformation. Track daily, stay motivated!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
