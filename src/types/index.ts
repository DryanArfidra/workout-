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

// Update atau tambahkan tipe untuk DailyWorkout
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

export interface WalletTransaction {
  id: string;
  userId: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  target: number;
  lastUpdated: string;
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