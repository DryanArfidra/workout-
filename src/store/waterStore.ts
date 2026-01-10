import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyWater, HistoryPeriod } from '../types';
import { getTodayDate, isSameDay, getWeekRange, getMonthRange } from '../utils/dateUtils';

interface WaterState {
  dailyWater: DailyWater[];
  getTodayWater: (userId: string) => DailyWater;
  addGlass: (userId: string) => void;
  removeGlass: (userId: string) => void;
  resetDailyWater: () => void;
  getWaterHistory: (userId: string, period: HistoryPeriod) => DailyWater[];
  getWaterStats: (userId: string) => {
    totalGlasses: number;
    dailyAverage: number;
    completionRate: number;
  };
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      dailyWater: [],

      getTodayWater: (userId: string) => {
        const { dailyWater } = get();
        const today = getTodayDate();
        
        let todayWater = dailyWater.find(
          w => w.userId === userId && isSameDay(w.date, today)
        );

        if (!todayWater) {
          todayWater = {
            id: Date.now().toString(),
            userId,
            date: today,
            current: 0,
            target: 8,
          };
          
          set(state => ({
            dailyWater: [...state.dailyWater, todayWater!],
          }));
        }

        return todayWater;
      },

      addGlass: (userId: string) => {
        set(state => {
          const today = getTodayDate();
          return {
            dailyWater: state.dailyWater.map(w => {
              if (w.userId === userId && isSameDay(w.date, today)) {
                return {
                  ...w,
                  current: Math.min(w.current + 1, w.target),
                };
              }
              return w;
            }),
          };
        });
      },

      removeGlass: (userId: string) => {
        set(state => {
          const today = getTodayDate();
          return {
            dailyWater: state.dailyWater.map(w => {
              if (w.userId === userId && isSameDay(w.date, today)) {
                return {
                  ...w,
                  current: Math.max(w.current - 1, 0),
                };
              }
              return w;
            }),
          };
        });
      },

      resetDailyWater: () => {
        const today = getTodayDate();
        set(state => ({
          dailyWater: state.dailyWater.filter(w => isSameDay(w.date, today)),
        }));
      },

      getWaterHistory: (userId: string, period: HistoryPeriod) => {
        const { dailyWater } = get();
        const userWater = dailyWater.filter(w => w.userId === userId);
        
        if (period === 'daily') {
          return userWater;
        }
        
        const now = new Date();
        const range = period === 'weekly' ? getWeekRange(now) : getMonthRange(now);
        
        return userWater.filter(w => 
          w.date >= range.start && w.date <= range.end
        );
      },

      getWaterStats: (userId: string) => {
        const { dailyWater } = get();
        const userWater = dailyWater.filter(w => w.userId === userId);
        
        const totalGlasses = userWater.reduce((sum, w) => sum + w.current, 0);
        const dailyAverage = userWater.length > 0 
          ? totalGlasses / userWater.length 
          : 0;
        
        const completionRate = userWater.length > 0
          ? (userWater.filter(w => w.current >= w.target).length / userWater.length) * 100
          : 0;
        
        return {
          totalGlasses,
          dailyAverage: Math.round(dailyAverage * 10) / 10,
          completionRate: Math.round(completionRate * 10) / 10,
        };
      },
    }),
    {
      name: 'water-storage',
    }
  )
);