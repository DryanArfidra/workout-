import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Wallet, WalletTransaction, HistoryPeriod, KeuanganStats, MonthlySummary } from '../types';
import { getTodayDate, getWeekRange, getMonthRange, getMonthStart, getMonthEnd } from '../utils/dateUtils';

interface WalletState {
  wallets: Wallet[];
  transactions: WalletTransaction[];
  
  // Core functions
  getWallet: (userId: string) => Wallet;
  addTransaction: (userId: string, transaction: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => { success: boolean; message?: string };
  deleteTransaction: (transactionId: string) => void;
  updateTarget: (userId: string, target: number) => void;
  
  // Transfer functions
  transferToSaving: (userId: string, amount: number, description?: string) => { success: boolean; message?: string };
  withdrawFromSaving: (userId: string, amount: number, description?: string) => { success: boolean; message?: string };
  
  // Query functions
  getTransactionHistory: (userId: string, period: HistoryPeriod, limit?: number) => WalletTransaction[];
  getWalletStats: (userId: string) => KeuanganStats;
  getMonthlySummaries: (userId: string, months?: number) => MonthlySummary[];
  getTransactionsByDateRange: (userId: string, startDate: string, endDate: string) => WalletTransaction[];
  
  // Migration helper
  _migrateOldData: (userId: string, oldBalance: number) => void;
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
            mainBalance: 0,
            savingBalance: 0,
            target: 1000000, // Default target 1 juta
            lastUpdated: new Date().toISOString(),
          };
          
          set(state => ({
            wallets: [...state.wallets, wallet!],
          }));
        } else {
          // Recalculate balance from transactions to ensure consistency
          const userTransactions = transactions.filter(t => t.userId === userId);
          let calculatedMainBalance = 0;
          let calculatedSavingBalance = 0;
          
          userTransactions.forEach(t => {
            if (t.type === 'income') {
              calculatedMainBalance += t.amount;
            } else if (t.type === 'expense') {
              calculatedMainBalance -= t.amount;
            } else if (t.type === 'saving') {
              calculatedMainBalance -= t.amount;
              calculatedSavingBalance += t.amount;
            }
          });
          
          if (wallet.mainBalance !== calculatedMainBalance || wallet.savingBalance !== calculatedSavingBalance) {
            wallet = { 
              ...wallet, 
              mainBalance: calculatedMainBalance, 
              savingBalance: calculatedSavingBalance,
              lastUpdated: new Date().toISOString() 
            };
            set(state => ({
              wallets: state.wallets.map(w => w.userId === userId ? wallet! : w),
            }));
          }
        }
        
        return wallet;
      },

      addTransaction: (userId: string, transaction: Omit<WalletTransaction, 'id' | 'userId' | 'date'>) => {
        const wallet = get().getWallet(userId);
        
        // Validation for expense: cannot exceed main balance
        if (transaction.type === 'expense' && transaction.amount > wallet.mainBalance) {
          return { 
            success: false, 
            message: `Saldo tidak mencukupi. Saldo utama Anda: Rp ${wallet.mainBalance.toLocaleString('id-ID')}` 
          };
        }
        
        const newTransaction: WalletTransaction = {
          id: Date.now().toString(),
          userId,
          date: getTodayDate(),
          ...transaction,
        };

        // Update balances
        let newMainBalance = wallet.mainBalance;
        let newSavingBalance = wallet.savingBalance;
        
        if (transaction.type === 'income') {
          newMainBalance += transaction.amount;
        } else if (transaction.type === 'expense') {
          newMainBalance -= transaction.amount;
        } else if (transaction.type === 'saving') {
          newMainBalance -= transaction.amount;
          newSavingBalance += transaction.amount;
        }
        
        set(state => ({
          transactions: [...state.transactions, newTransaction],
          wallets: state.wallets.map(w => 
            w.userId === userId 
              ? { 
                  ...w, 
                  mainBalance: newMainBalance, 
                  savingBalance: newSavingBalance,
                  lastUpdated: new Date().toISOString() 
                }
              : w
          ),
        }));
        
        return { success: true };
      },

      deleteTransaction: (transactionId: string) => {
        const { transactions, wallets } = get();
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (!transaction) return;
        
        // Reverse the transaction effect
        const wallet = get().getWallet(transaction.userId);
        let newMainBalance = wallet.mainBalance;
        let newSavingBalance = wallet.savingBalance;
        
        if (transaction.type === 'income') {
          newMainBalance -= transaction.amount;
        } else if (transaction.type === 'expense') {
          newMainBalance += transaction.amount;
        } else if (transaction.type === 'saving') {
          newMainBalance += transaction.amount;
          newSavingBalance -= transaction.amount;
        }
        
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== transactionId),
          wallets: state.wallets.map(w => 
            w.userId === transaction.userId 
              ? { 
                  ...w, 
                  mainBalance: newMainBalance, 
                  savingBalance: newSavingBalance,
                  lastUpdated: new Date().toISOString() 
                }
              : w
          ),
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

      transferToSaving: (userId: string, amount: number, description: string = 'Transfer ke Tabungan') => {
        const wallet = get().getWallet(userId);
        
        if (amount <= 0) {
          return { success: false, message: 'Nominal harus lebih dari 0' };
        }
        
        if (amount > wallet.mainBalance) {
          return { 
            success: false, 
            message: `Saldo tidak mencukupi. Saldo utama Anda: Rp ${wallet.mainBalance.toLocaleString('id-ID')}` 
          };
        }
        
        return get().addTransaction(userId, {
          type: 'saving',
          amount,
          description,
          category: 'Tabungan',
        });
      },

      withdrawFromSaving: (userId: string, amount: number, description: string = 'Tarik dari Tabungan') => {
        const wallet = get().getWallet(userId);
        
        if (amount <= 0) {
          return { success: false, message: 'Nominal harus lebih dari 0' };
        }
        
        if (amount > wallet.savingBalance) {
          return { 
            success: false, 
            message: `Saldo tabungan tidak mencukupi. Saldo tabungan Anda: Rp ${wallet.savingBalance.toLocaleString('id-ID')}` 
          };
        }
        
        // Withdraw from saving: create an income transaction
        return get().addTransaction(userId, {
          type: 'income',
          amount,
          description,
          category: 'Tarik Tabungan',
        });
      },

      getTransactionHistory: (userId: string, period: HistoryPeriod, limit?: number) => {
        const { transactions } = get();
        let userTransactions = transactions.filter(t => t.userId === userId);
        
        if (period !== 'daily') {
          const now = new Date();
          const range = period === 'weekly' ? getWeekRange(now) : getMonthRange(now);
          userTransactions = userTransactions.filter(t => 
            t.date >= range.start && t.date <= range.end
          );
        }
        
        // Sort by date descending (newest first)
        userTransactions = [...userTransactions].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        if (limit && limit > 0) {
          userTransactions = userTransactions.slice(0, limit);
        }
        
        return userTransactions;
      },

      getWalletStats: (userId: string): KeuanganStats => {
        const { transactions } = get();
        const wallet = get().getWallet(userId);
        const userTransactions = transactions.filter(t => t.userId === userId);
        
        const now = new Date();
        const monthStart = getMonthStart(now);
        const monthEnd = getMonthEnd(now);
        
        const thisMonthTransactions = userTransactions.filter(t => 
          t.date >= monthStart && t.date <= monthEnd
        );
        
        const totalIncomeThisMonth = thisMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenseThisMonth = thisMonthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalSavingThisMonth = thisMonthTransactions
          .filter(t => t.type === 'saving')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const targetProgress = wallet.target > 0 
          ? (wallet.savingBalance / wallet.target) * 100 
          : 0;
        
        const savingPercentage = totalIncomeThisMonth > 0
          ? (totalSavingThisMonth / totalIncomeThisMonth) * 100
          : 0;
        
        return {
          totalIncomeThisMonth,
          totalExpenseThisMonth,
          totalSavingThisMonth,
          mainBalance: wallet.mainBalance,
          savingBalance: wallet.savingBalance,
          targetProgress: Math.min(targetProgress, 100),
          savingPercentage: Math.min(savingPercentage, 100),
        };
      },

      getMonthlySummaries: (userId: string, months: number = 6): MonthlySummary[] => {
        const { transactions } = get();
        const userTransactions = transactions.filter(t => t.userId === userId);
        
        const summaries: MonthlySummary[] = [];
        const now = new Date();
        
        for (let i = 0; i < months; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStart = getMonthStart(date);
          const monthEnd = getMonthEnd(date);
          const monthName = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
          
          const monthTransactions = userTransactions.filter(t => 
            t.date >= monthStart && t.date <= monthEnd
          );
          
          const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const expense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const saving = monthTransactions
            .filter(t => t.type === 'saving')
            .reduce((sum, t) => sum + t.amount, 0);
          
          summaries.push({
            month: monthName,
            income,
            expense,
            saving,
          });
        }
        
        return summaries.reverse();
      },

      getTransactionsByDateRange: (userId: string, startDate: string, endDate: string) => {
        const { transactions } = get();
        return transactions.filter(t => 
          t.userId === userId && t.date >= startDate && t.date <= endDate
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      _migrateOldData: (userId: string, oldBalance: number) => {
        const wallet = get().getWallet(userId);
        
        // Only migrate if mainBalance is 0 and savingBalance is 0 (new system)
        if (wallet.mainBalance === 0 && wallet.savingBalance === 0 && oldBalance > 0) {
          set(state => ({
            wallets: state.wallets.map(w => 
              w.userId === userId 
                ? { ...w, mainBalance: oldBalance, lastUpdated: new Date().toISOString() }
                : w
            ),
          }));
        }
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);