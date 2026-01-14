import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyWater, HistoryPeriod } from '../types';
import {
  getTodayDate,
  isSameDay,
  getWeekRange,
  getMonthRange,
} from '../utils/dateUtils';

interface WaterState {
  dailyWater: DailyWater[];

  // helper
  ensureTodayWater: (userId: string) => void;

  // getters
  getTodayWater: (userId: string) => DailyWater;

  // actions
  addGlass: (userId: string) => void;
  removeGlass: (userId: string) => void;
  resetDailyWater: () => void;

  // history & stats
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

      /* =========================
         ENSURE TODAY WATER
      ========================== */
      ensureTodayWater: (userId: string) => {
        const today = getTodayDate();
        const exists = get().dailyWater.some(
          w => w.userId === userId && isSameDay(w.date, today)
        );

        if (!exists) {
          set(state => ({
            dailyWater: [
              ...state.dailyWater,
              {
                id: Date.now().toString(),
                userId,
                date: today,
                current: 0,
                target: 8,
              },
            ],
          }));
        }
      },

      /* =========================
         GET TODAY WATER (PURE)
      ========================== */
      getTodayWater: (userId: string) => {
        const today = getTodayDate();
        return (
          get().dailyWater.find(
            w => w.userId === userId && isSameDay(w.date, today)
          ) ?? {
            id: 'temp',
            userId,
            date: today,
            current: 0,
            target: 8,
          }
        );
      },

      /* =========================
         ADD GLASS (+1)
      ========================== */
      addGlass: (userId: string) => {
        get().ensureTodayWater(userId);

        set(state => {
          const today = getTodayDate();
          return {
            dailyWater: state.dailyWater.map(w =>
              w.userId === userId && isSameDay(w.date, today)
                ? {
                    ...w,
                    current: Math.min(w.current + 1, w.target),
                  }
                : w
            ),
          };
        });
      },

      /* =========================
         REMOVE GLASS (-1)
      ========================== */
      removeGlass: (userId: string) => {
        get().ensureTodayWater(userId);

        set(state => {
          const today = getTodayDate();
          return {
            dailyWater: state.dailyWater.map(w =>
              w.userId === userId && isSameDay(w.date, today)
                ? {
                    ...w,
                    current: Math.max(w.current - 1, 0),
                  }
                : w
            ),
          };
        });
      },

      /* =========================
         RESET (KEEP TODAY ONLY)
      ========================== */
      resetDailyWater: () => {
        const today = getTodayDate();
        set(state => ({
          dailyWater: state.dailyWater.filter(w =>
            isSameDay(w.date, today)
          ),
        }));
      },

      /* =========================
         HISTORY
      ========================== */
      getWaterHistory: (userId: string, period: HistoryPeriod) => {
        const userWater = get().dailyWater.filter(
          w => w.userId === userId
        );

        if (period === 'daily') return userWater;

        const now = new Date();
        const range =
          period === 'weekly'
            ? getWeekRange(now)
            : getMonthRange(now);

        return userWater.filter(
          w => w.date >= range.start && w.date <= range.end
        );
      },

      /* =========================
         STATS
      ========================== */
      getWaterStats: (userId: string) => {
        const userWater = get().dailyWater.filter(
          w => w.userId === userId
        );

        const totalGlasses = userWater.reduce(
          (sum, w) => sum + w.current,
          0
        );

        const dailyAverage =
          userWater.length > 0
            ? totalGlasses / userWater.length
            : 0;

        const completionRate =
          userWater.length > 0
            ? (userWater.filter(w => w.current >= w.target).length /
                userWater.length) *
              100
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
