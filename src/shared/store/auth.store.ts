import { create } from 'zustand';
import type { AuthUser } from '@src/features/auth/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SecureStorageManager } from './store-manager';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      //TODO: make call to server for logout
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => SecureStorageManager),
    }
  )
);
