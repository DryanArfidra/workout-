import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DailyWorkout, WorkoutType, HistoryPeriod } from '../types';
import { getTodayDate, isSameDay, getWeekRange, getMonthRange } from '../utils/dateUtils';
import { WORKOUT_DETAILS } from '../utils/constants';

const OLD_WORKOUT_TYPES = ['pushup', 'situp', 'squat', 'plank', 'jumping_jacks'];

// Migration function - diperbaiki
const migrateWorkoutData = (persistedState: any, version: number) => {
  console.log('Migrating workout data from version:', version);
  
  if (!persistedState) {
    console.log('No persisted state found, returning default');
    return {
      dailyWorkouts: [],
      workoutTypes: [
        'chest-triceps',
        'core',
        'legs-glutes',
        'shoulders-back',
        'full-body-light',
        'core-stretching',
        'full-workout'
      ]
    };
  }
  
  // Jika versi lama (1 atau tidak ada versi)
  if (version < 2) {
    console.log('Migrating from old version');
    const migratedWorkouts: DailyWorkout[] = [];
    
    if (persistedState.dailyWorkouts) {
      for (const workout of persistedState.dailyWorkouts) {
        if (OLD_WORKOUT_TYPES.includes(workout.workoutType)) {
          // Map old workout type to new one based on date
          const workoutDate = new Date(workout.date);
          const dayOfWeek = workoutDate.getDay();
          
          let newWorkoutType: WorkoutType;
          switch (dayOfWeek) {
            case 1: newWorkoutType = 'chest-triceps'; break;
            case 2: newWorkoutType = 'core'; break;
            case 3: newWorkoutType = 'legs-glutes'; break;
            case 4: newWorkoutType = 'shoulders-back'; break;
            case 5: newWorkoutType = 'full-body-light'; break;
            case 6: newWorkoutType = 'core-stretching'; break;
            case 0: 
            default: newWorkoutType = 'full-workout'; break;
          }
          
          const workoutDetail = WORKOUT_DETAILS[newWorkoutType];
          
          migratedWorkouts.push({
            ...workout,
            workoutType: newWorkoutType,
            duration: workoutDetail?.duration || 10
          });
        } else {
          // Already in new format
          migratedWorkouts.push(workout);
        }
      }
    }
    
    return {
      dailyWorkouts: migratedWorkouts,
      workoutTypes: [
        'chest-triceps',
        'core',
        'legs-glutes',
        'shoulders-back',
        'full-body-light',
        'core-stretching',
        'full-workout'
      ]
    };
  }
  
  // Jika sudah versi 2, return as is
  return persistedState;
};

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
  clearWorkoutData: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      dailyWorkouts: [],
      workoutTypes: [
        'chest-triceps',
        'core',
        'legs-glutes',
        'shoulders-back',
        'full-body-light',
        'core-stretching',
        'full-workout'
      ] as WorkoutType[],

      getTodayWorkout: (userId: string) => {
        const { dailyWorkouts } = get();
        const today = getTodayDate();
        
        let todayWorkout = dailyWorkouts.find(
          w => w.userId === userId && isSameDay(w.date, today)
        );

        if (!todayWorkout) {
          const dayOfWeek = new Date().getDay();
          let workoutType: WorkoutType;
          
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
          
          const workoutDetail = WORKOUT_DETAILS[workoutType];
          
          todayWorkout = {
            id: `workout_${userId}_${today}_${Date.now()}`,
            userId,
            date: today,
            completed: false,
            workoutType,
            duration: workoutDetail?.duration || 10,
          };
          
          set(state => ({
            dailyWorkouts: [...state.dailyWorkouts, todayWorkout!],
          }));
        }

        return todayWorkout;
      },

      toggleWorkout: (userId: string) => {
        const today = getTodayDate();
        
        set(state => {
          const workoutExists = state.dailyWorkouts.some(
            w => w.userId === userId && isSameDay(w.date, today)
          );
          
          if (!workoutExists) {
            // Create workout if it doesn't exist
            const dayOfWeek = new Date().getDay();
            let workoutType: WorkoutType;
            
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
            
            const workoutDetail = WORKOUT_DETAILS[workoutType];
            
            const newWorkout: DailyWorkout = {
              id: `workout_${userId}_${today}_${Date.now()}`,
              userId,
              date: today,
              completed: true,
              workoutType,
              duration: workoutDetail?.duration || 10,
            };
            
            return {
              dailyWorkouts: [...state.dailyWorkouts, newWorkout],
            };
          } else {
            // Toggle existing workout
            const updatedWorkouts = state.dailyWorkouts.map(w => {
              if (w.userId === userId && isSameDay(w.date, today)) {
                return {
                  ...w,
                  completed: !w.completed,
                };
              }
              return w;
            });
            
            return {
              dailyWorkouts: updatedWorkouts,
            };
          }
        });
      },

      resetDailyWorkout: () => {
        const today = getTodayDate();
        set(state => ({
          dailyWorkouts: state.dailyWorkouts.filter(w => !isSameDay(w.date, today)),
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
        
        const validWorkouts = userWorkouts.filter(w => 
          Object.keys(WORKOUT_DETAILS).includes(w.workoutType)
        );
        
        const totalWorkouts = validWorkouts.filter(w => w.completed).length;
        
        // Calculate streak - perbaiki logika streak
        let streak = 0;
        const sortedWorkouts = [...validWorkouts]
          .filter(w => w.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (sortedWorkouts.length > 0) {
          // Check if today is completed
          const today = getTodayDate();
          const todayWorkout = sortedWorkouts.find(w => isSameDay(w.date, today));
          
          if (todayWorkout) {
            streak = 1;
            
            // Count consecutive days from today backwards
            let currentDate = new Date(today);
            for (let i = 1; i < sortedWorkouts.length; i++) {
              currentDate.setDate(currentDate.getDate() - 1);
              const prevDate = currentDate.toISOString().split('T')[0];
              
              const hasWorkout = sortedWorkouts.find(w => isSameDay(w.date, prevDate));
              if (hasWorkout) {
                streak++;
              } else {
                break;
              }
            }
          }
        }
        
        const completionRate = validWorkouts.length > 0
          ? Math.round((totalWorkouts / validWorkouts.length) * 100 * 10) / 10
          : 0;
        
        return {
          totalWorkouts,
          streak,
          completionRate,
        };
      },

      clearWorkoutData: () => {
        set({ dailyWorkouts: [] });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => localStorage),
      migrate: migrateWorkoutData,
      version: 2,
      partialize: (state) => ({
        dailyWorkouts: state.dailyWorkouts,
        workoutTypes: state.workoutTypes,
      }),
    }
  )
);