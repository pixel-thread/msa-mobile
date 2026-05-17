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
        const refreshToken = await SecureStorageManager.getItem(SECURE_STORE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            await http.post('/auth/logout', { token: refreshToken });
          } catch (e) {
            logger.error('Logout API call failed', { e });
          }
        }

        await SecureStorageManager.removeItem(SECURE_STORE_KEYS.ACCESS_TOKEN);
        await SecureStorageManager.removeItem(SECURE_STORE_KEYS.REFRESH_TOKEN);
        set({ user: null, isAuthenticated: false });
      },
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => SecureStorageManager),
    }
  )
);
