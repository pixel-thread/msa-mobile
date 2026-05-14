import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEYS } from '@src/shared/constants';

/**
 * Base URL for the API.
 * Defaults to localhost if EXPO_PUBLIC_API_URL is not provided.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL as string;

/**
 * Paths that bypass the automatic token refresh logic.
 * Errors on these paths are returned directly to the caller.
 */
const AUTH_PATHS = [
  'auth/sign-in',
  'auth/sign-in/verify',
  'auth/sign-up',
  'auth/refresh',
  'auth/forgot-password',
  'auth/reset-password',
] as const;

/**
 * Represents a pending request in the queue while a token refresh is in progress.
 */
interface QueueItem {
  /** Function to resolve the promise with a new token */
  resolve: (token: string) => void;
  /** Function to reject the promise with an error */
  reject: (error: unknown) => void;
}

/** Flag indicating if a token refresh request is currently in flight */
let isRefreshing = false;
/** List of requests waiting for the token refresh to complete */
const failedQueue: QueueItem[] = [];

/**
 * Processes the failed request queue after a refresh attempt.
 *
 * @param error - If provided, all queued requests will be rejected with this error.
 * @param token - If provided, all queued requests will be resolved with this new token.
 */
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

/**
 * Checks if a given URL is one of the authentication-related paths.
 *
 * @param url - The URL to check.
 * @returns True if the URL is an auth path, false otherwise.
 */
const isAuthPath = (url: string): boolean => {
  return AUTH_PATHS.some((path) => url.includes(path));
};

/**
 * Configured Axios instance for application-wide API requests.
 * Includes base URL, credentials support, and default JSON headers.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Performs a token refresh request using the stored refresh token.
 * Updates the SecureStore with new tokens upon success.
 *
 * @throws Error if no refresh token is found or if the refresh request fails.
 * @returns The new access token.
 */
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

// Request interceptor to attach the access token to every outgoing request
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh on 401 errors
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

    // If the error occurred on an auth path, resolve the response so the UI can handle the error message
    if (isAuthPath(requestPath)) {
      if (error.response) return Promise.resolve(error.response);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors by attempting to refresh the token

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
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
        // If refresh fails, clear tokens and reject all queued requests
        processQueue(refreshError, null);

        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.MFA_TEMP_TOKEN);

        // Resolve the original 401 so the application-level handlers can manage the logout/redirect
        if (error.response) return Promise.resolve(error.response);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Reject other errors normally
    return Promise.reject(error);
  }
);
export default apiClient;
