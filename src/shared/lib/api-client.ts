import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEYS } from '@src/shared/constants';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

const AUTH_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/sign-up/verify',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
const failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue.length = 0;
};

const isAuthPath = (url: string): boolean => {
  return AUTH_PATHS.some((path) => url.includes(path));
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshToken = async (): Promise<string> => {
  const refreshToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<{
    data?: { accessToken: string; refreshToken?: string };
  }>(`${API_BASE_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });

  const newAccessToken = response.data?.data?.accessToken;
  if (!newAccessToken) {
    throw new Error('No access token in refresh response');
  }

  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, newAccessToken);

  const newRefreshToken = response.data?.data?.refreshToken;
  if (newRefreshToken) {
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, newRefreshToken);
  }

  return newAccessToken;
};

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestPath = originalRequest.url ?? '';

    if (isAuthPath(requestPath)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.MFA_TEMP_TOKEN);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
