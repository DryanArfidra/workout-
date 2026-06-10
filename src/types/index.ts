export interface User {
  id: string;
  username: string;
  password: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface DailyAmalan {
  id: string;
  userId: string;
  date: string;
  amalan: {
    dzikirPagi: boolean;
    dzikirPetang: boolean;
    tilawah: boolean;
    sholatDhuha: boolean;
    sholatTahajud: boolean;
    sedekah: boolean;
  };
  completedCount: number;
  totalCount: number;
}

export interface DailyWater {
  id: string;
  userId: string;
  date: string;
  current: number;
  target: number;
}

export interface DailyWorkout {
  id: string;
  userId: string;
  date: string;
  completed: boolean;
  workoutType: string;
  duration: number;
}

export type WorkoutType = 
  | 'chest-triceps' 
  | 'core' 
  | 'legs-glutes' 
  | 'shoulders-back' 
  | 'full-body-light' 
  | 'core-stretching' 
  | 'full-workout';

// UPDATED: Wallet dengan sistem baru
export interface Wallet {
  userId: string;
  mainBalance: number;      // Uang aktif
  savingBalance: number;    // Uang yang sudah ditabung
  target: number;           // Target tabungan
  lastUpdated: string;
}

// UPDATED: Transaction dengan type 'saving'
export interface WalletTransaction {
  id: string;
  userId: string;
  date: string;
  type: 'income' | 'expense' | 'saving';
  amount: number;
  description: string;
  category: string;
}

export interface ActivityHistory {
  id: string;
  userId: string;
  type: 'amalan' | 'water' | 'workout' | 'transaction';
  description: string;
  date: string;
  details?: Record<string, any>;
}

export type HistoryPeriod = 'daily' | 'weekly' | 'monthly';

// New types for Keuangan
export interface KeuanganStats {
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalSavingThisMonth: number;
  mainBalance: number;
  savingBalance: number;
  targetProgress: number;
  savingPercentage: number; // persentase tabungan terhadap pemasukan
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  saving: number;
}