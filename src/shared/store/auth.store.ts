import { create } from 'zustand';
import type { AuthUser } from '@src/features/auth/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SecureStorageManager } from './store-manager';
import http from '../utils/http';
import { SECURE_STORE_KEYS } from '../constants';
import { logger } from '../utils';

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
      logout: async () => {
        const refreshToken = SecureStorageManager.getItem(SECURE_STORE_KEYS.REFRESH_TOKEN);

        const res = await http.post('/auth/logout', {
          token: refreshToken,
        });

        if (res.success) {
          SecureStorageManager.removeItem(SECURE_STORE_KEYS.ACCESS_TOKEN);
          SecureStorageManager.removeItem(SECURE_STORE_KEYS.REFRESH_TOKEN);
          set({ user: null, isAuthenticated: false, isHydrated: false });
        } else {
          logger.error(res.message);
        }
      },
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => SecureStorageManager),
    }
  )
);
