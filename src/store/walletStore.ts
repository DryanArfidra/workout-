import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Wallet, WalletTransaction, HistoryPeriod } from '../types';
import { getTodayDate, getWeekRange, getMonthRange } from '../utils/dateUtils';

interface WalletState {
  wallets: Wallet[];
  transactions: WalletTransaction[];
  getWallet: (userId: string) => Wallet;
  addTransaction: (userId: string, transaction: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => void;
  deleteTransaction: (transactionId: string) => void;
  updateTarget: (userId: string, target: number) => void;
  getTransactionHistory: (userId: string, period: HistoryPeriod) => WalletTransaction[];
  getWalletStats: (userId: string) => {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    progressToTarget: number;
  };
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: [],
      transactions: [],

      getWallet: (userId: string) => {
        const { wallets, transactions } = get();
        
        let wallet = wallets.find(w => w.userId === userId);
        
        if (!wallet) {
          wallet = {
            userId,
            balance: 0,
            target: 1000000, // Default target 1 juta
            lastUpdated: new Date().toISOString(),
          };
          
          set(state => ({
            wallets: [...state.wallets, wallet!],
          }));
        }
        
        // Calculate current balance
        const userTransactions = transactions.filter(t => t.userId === userId);
        const balance = userTransactions.reduce((sum, t) => {
          return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);
        
        if (wallet.balance !== balance) {
          wallet = { ...wallet, balance, lastUpdated: new Date().toISOString() };
          set(state => ({
            wallets: state.wallets.map(w => w.userId === userId ? wallet! : w),
          }));
        }
        
        return wallet;
      },

      addTransaction: (userId: string, transaction: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => {
        const newTransaction: WalletTransaction = {
          id: Date.now().toString(),
          userId,
          date: getTodayDate(),
          ...transaction,
        };

        set(state => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      deleteTransaction: (transactionId: string) => {
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== transactionId),
        }));
      },

      updateTarget: (userId: string, target: number) => {
        set(state => ({
          wallets: state.wallets.map(w => 
            w.userId === userId 
              ? { ...w, target, lastUpdated: new Date().toISOString() }
              : w
          ),
        }));
      },

      getTransactionHistory: (userId: string, period: HistoryPeriod) => {
        const { transactions } = get();
        const userTransactions = transactions.filter(t => t.userId === userId);
        
        if (period === 'daily') {
          return userTransactions;
        }
        
        const now = new Date();
        const range = period === 'weekly' ? getWeekRange(now) : getMonthRange(now);
        
        return userTransactions.filter(t => 
          t.date >= range.start && t.date <= range.end
        );
      },

      getWalletStats: (userId: string) => {
        const { transactions, wallets } = get();
        const userTransactions = transactions.filter(t => t.userId === userId);
        const wallet = wallets.find(w => w.userId === userId);
        
        const totalIncome = userTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = userTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const netBalance = totalIncome - totalExpense;
        const progressToTarget = wallet ? (wallet.balance / wallet.target) * 100 : 0;
        
        return {
          totalIncome,
          totalExpense,
          netBalance,
          progressToTarget: Math.min(progressToTarget, 100),
        };
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);