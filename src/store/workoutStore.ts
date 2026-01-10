import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyWorkout, WorkoutType, HistoryPeriod } from '../types';
import { getTodayDate, isSameDay, getWeekRange, getMonthRange } from '../utils/dateUtils';

interface WorkoutState {
  dailyWorkouts: DailyWorkout[];
  workoutTypes: WorkoutType[];
  getTodayWorkout: (userId: string) => DailyWorkout;
  toggleWorkout: (userId: string) => void;
  resetDailyWorkout: () => void;
  getWorkoutHistory: (userId: string, period: HistoryPeriod) => DailyWorkout[];
  getWorkoutStats: (userId: string) => {
    totalWorkouts: number;
    streak: number;
    completionRate: number;
  };
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      dailyWorkouts: [],
      workoutTypes: ['pushup', 'situp', 'squat', 'plank', 'jumping_jacks'],

      getTodayWorkout: (userId: string) => {
        const { dailyWorkouts, workoutTypes } = get();
        const today = getTodayDate();
        
        let todayWorkout = dailyWorkouts.find(
          w => w.userId === userId && isSameDay(w.date, today)
        );

        if (!todayWorkout) {
          // Rotasi workout type berdasarkan hari
          const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
          const workoutType = workoutTypes[dayOfYear % workoutTypes.length];
          
          todayWorkout = {
            id: Date.now().toString(),
            userId,
            date: today,
            completed: false,
            workoutType,
            duration: 10,
          };
          
          set(state => ({
            dailyWorkouts: [...state.dailyWorkouts, todayWorkout!],
          }));
        }

        return todayWorkout;
      },

      toggleWorkout: (userId: string) => {
        set(state => {
          const today = getTodayDate();
          return {
            dailyWorkouts: state.dailyWorkouts.map(w => {
              if (w.userId === userId && isSameDay(w.date, today)) {
                return {
                  ...w,
                  completed: !w.completed,
                };
              }
              return w;
            }),
          };
        });
      },

      resetDailyWorkout: () => {
        const today = getTodayDate();
        set(state => ({
          dailyWorkouts: state.dailyWorkouts.filter(w => isSameDay(w.date, today)),
        }));
      },

      getWorkoutHistory: (userId: string, period: HistoryPeriod) => {
        const { dailyWorkouts } = get();
        const userWorkouts = dailyWorkouts.filter(w => w.userId === userId);
        
        if (period === 'daily') {
          return userWorkouts;
        }
        
        const now = new Date();
        const range = period === 'weekly' ? getWeekRange(now) : getMonthRange(now);
        
        return userWorkouts.filter(w => 
          w.date >= range.start && w.date <= range.end
        );
      },

      getWorkoutStats: (userId: string) => {
        const { dailyWorkouts } = get();
        const userWorkouts = dailyWorkouts.filter(w => w.userId === userId);
        
        const totalWorkouts = userWorkouts.filter(w => w.completed).length;
        
        // Calculate streak
        let streak = 0;
        const sortedWorkouts = [...userWorkouts].sort((a, b) => b.date.localeCompare(a.date));
        
        for (const workout of sortedWorkouts) {
          if (workout.completed) streak++;
          else break;
        }
        
        const completionRate = userWorkouts.length > 0
          ? (totalWorkouts / userWorkouts.length) * 100
          : 0;
        
        return {
          totalWorkouts,
          streak,
          completionRate: Math.round(completionRate * 10) / 10,
        };
      },
    }),
    {
      name: 'workout-storage',
    }
  )
);