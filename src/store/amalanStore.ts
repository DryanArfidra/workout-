import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type{ DailyAmalan, HistoryPeriod } from '../types';
import { getTodayDate, isSameDay, getWeekRange, getMonthRange } from '../utils/dateUtils';

interface AmalanState {
  dailyAmalan: DailyAmalan[];
  getTodayAmalan: (userId: string) => DailyAmalan;
  updateAmalan: (userId: string, amalanName: keyof DailyAmalan['amalan'], value: boolean) => void;
  resetDailyAmalan: () => void;
  getAmalanHistory: (userId: string, period: HistoryPeriod) => DailyAmalan[];
  getAmalanStats: (userId: string) => {
    totalCompleted: number;
    dailyAverage: number;
    streak: number;
  };
}

export const useAmalanStore = create<AmalanState>()(
  persist(
    (set, get) => ({
      dailyAmalan: [],

      getTodayAmalan: (userId: string) => {
        const { dailyAmalan } = get();
        const today = getTodayDate();
        
        let todayAmalan = dailyAmalan.find(
          a => a.userId === userId && isSameDay(a.date, today)
        );

        if (!todayAmalan) {
          todayAmalan = {
            id: Date.now().toString(),
            userId,
            date: today,
            amalan: {
              dzikirPagi: false,
              dzikirPetang: false,
              tilawah: false,
              sholatDhuha: false,
              sholatTahajud: false,
              sedekah: false,
            },
            completedCount: 0,
            totalCount: 6,
          };
          
          set(state => ({
            dailyAmalan: [...state.dailyAmalan, todayAmalan!],
          }));
        }

        // Update completed count
        const completedCount = Object.values(todayAmalan.amalan).filter(v => v).length;
        if (todayAmalan.completedCount !== completedCount) {
          todayAmalan = { ...todayAmalan, completedCount };
          set(state => ({
            dailyAmalan: state.dailyAmalan.map(a => 
              a.id === todayAmalan!.id ? todayAmalan! : a
            ),
          }));
        }

        return todayAmalan;
      },

      updateAmalan: (userId: string, amalanName: keyof DailyAmalan['amalan'], value: boolean) => {
        set(state => {
          const today = getTodayDate();
          const updatedAmalan = state.dailyAmalan.map(a => {
            if (a.userId === userId && isSameDay(a.date, today)) {
              const updated = { ...a.amalan, [amalanName]: value };
              const completedCount = Object.values(updated).filter(v => v).length;
              
              return {
                ...a,
                amalan: updated,
                completedCount,
              };
            }
            return a;
          });

          return { dailyAmalan: updatedAmalan };
        });
      },

      resetDailyAmalan: () => {
        const today = getTodayDate();
        set(state => ({
          dailyAmalan: state.dailyAmalan.filter(a => isSameDay(a.date, today)),
        }));
      },

      getAmalanHistory: (userId: string, period: HistoryPeriod) => {
        const { dailyAmalan } = get();
        const userAmalan = dailyAmalan.filter(a => a.userId === userId);
        
        if (period === 'daily') {
          return userAmalan;
        }
        
        const now = new Date();
        const range = period === 'weekly' ? getWeekRange(now) : getMonthRange(now);
        
        return userAmalan.filter(a => 
          a.date >= range.start && a.date <= range.end
        );
      },

      getAmalanStats: (userId: string) => {
        const { dailyAmalan } = get();
        const userAmalan = dailyAmalan.filter(a => a.userId === userId);
        
        const totalCompleted = userAmalan.reduce((sum, a) => sum + a.completedCount, 0);
        const dailyAverage = userAmalan.length > 0 
          ? totalCompleted / userAmalan.length 
          : 0;
        
        // Calculate streak
        let streak = 0;
        const sortedAmalan = [...userAmalan].sort((a, b) => b.date.localeCompare(a.date));
        
        for (const amalan of sortedAmalan) {
          if (amalan.completedCount > 0) streak++;
          else break;
        }
        
        return {
          totalCompleted,
          dailyAverage: Math.round(dailyAverage * 10) / 10,
          streak,
        };
      },
    }),
    {
      name: 'amalan-storage',
    }
  )
);