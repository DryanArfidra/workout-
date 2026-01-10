import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User } from '../types';

interface AuthState {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  getCurrentUser: () => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const { users } = get();
        const user = users.find(
          u => u.username === username && u.password === password
        );
        
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: (username: string, password: string) => {
        const { users } = get();
        
        if (users.some(u => u.username === username)) {
          return false;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username,
          password,
          bio: 'Pengguna baru',
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
        }));
        
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      updateProfile: (data: Partial<User>) => {
        set(state => {
          if (!state.currentUser) return state;
          
          const updatedUser = { ...state.currentUser, ...data };
          const updatedUsers = state.users.map(u => 
            u.id === updatedUser.id ? updatedUser : u
          );
          
          return {
            currentUser: updatedUser,
            users: updatedUsers,
          };
        });
      },

      getCurrentUser: () => get().currentUser,
    }),
    {
      name: 'auth-storage',
    }
  )
);