import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

import { useAuthStore, useNotificationStore } from '@src/shared/store';
import http from '@src/shared/utils/http';
import { logger } from '@src/shared/utils/logger';
import { registerForPushNotificationsAsync } from '@src/shared/services/notification/register-push-notification';
import { NotificationContext } from '@src/shared/lib/context/notifications';
import { isExpoGo } from '@src/shared/utils';

/**
 * Global notification handler configuration.
 * Defines how notifications are handled when the app is in the foreground.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Props for the NotificationProvider component.
 */
interface NotificationProviderProps {
  /** The child components to render within the provider. */
  children: React.ReactNode;
}

/**
 * NotificationProvider component manages push notifications for the application.
 *
 * This provider handles:
 * - Registering the device for push notifications with Expo
 * - Sending the push token to the backend for storage
 * - Listening for incoming notifications in the foreground
 * - Handling notification tap events and navigation
 * - Linking tokens to user accounts for authenticated users
 *
 * @example
 * ```tsx
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  /** The Expo push token for the current device. Used for sending push notifications. */
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  /** The most recently received notification while the app is in the foreground. */
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  /** Reference to the notification received listener. Used for cleanup on unmount. */
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  /** Reference to the notification response listener. Used for cleanup on unmount. */
  const responseListener = useRef<Notifications.EventSubscription>(null);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { setLinked, isLinked, setRegistered, isRegistered } = useNotificationStore();

  /**
   * Handles the user's response to a notification (when user taps on the notification).
   * Navigates to the URL specified in the notification's data payload.
   *
   * @param response - The notification response containing the notification data
   */
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;

      // Handle navigation based on notification data
      // Expecting a 'url' field in the notification data payload
      if (data?.url) {
        router.push(data.url as any);
      }
    },
    [router]
  );

  /**
   * Sends the Expo push token to the backend to register the device for push notifications.
   * Only sends if the device is not already registered.
   *
   * @param token - The Expo push token to send to the backend
   */
  const sendTokenToBackend = useCallback(
    async (token: string) => {
      try {
        if (isRegistered) return;
        const res = await http.post('/notifications/register', { token: token });

        if (res.success) {
          setRegistered(true);
        }
      } catch (error) {
        // Silently fail or log to an error monitoring service
        logger.error('Failed to send push token to backend:', { error });
      }
    },
    [isRegistered, setRegistered]
  );

  /**
   * Effect to set up push notifications when the user is authenticated.
   *
   * This effect:
   * - Skips setup on Expo Go (not supported)
   * - Skips setup on web platform
   * - Registers the device for push notifications with Expo
   * - Sends the push token to the backend for storage
   * - Sets up listeners for foreground notifications and notification responses
   * - Cleans up listeners on unmount
   */
  useEffect(() => {
    // Only register for notifications if authenticated
    if (isExpoGo()) {
      // Expo Go does not support notifications
      return;
    }
    if (!isAuthenticated || !user) {
      // If we had a token and now we are not authenticated, we might want to clear it on backend
      // However, usually logout happens via a dedicated action that should clear it.
      return;
    }

    if (Platform.OS === 'web') return;

    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await sendTokenToBackend(token);
      }
    };

    setupNotifications();

    // Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Notification click listener
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, user, handleNotificationResponse, sendTokenToBackend]);

  /**
   * Links the push token to the authenticated user's account on the backend.
   * This associates the device with the user for targeted notifications.
   * Only links if not already linked.
   *
   * @param token - The Expo push token to link to the user account
   */
  const linkTokenToBackend = useCallback(
    async (token: string | undefined) => {
      try {
        if (isLinked) return;
        const res = await http.post('/notifications/link', { token: token });
        if (res.success) {
          setLinked(true);
        }
      } catch (error) {
        // Silently fail or log to an error monitoring service
        logger.error('Failed to send push token to backend:', { error });
      }
    },
    [isLinked, setLinked]
  );

  /**
   * Effect to link the push token to the authenticated user's account.
   *
   * This effect runs when the user becomes authenticated or when the push token changes.
   * It associates the device token with the user for targeted push notifications.
   */
  useEffect(() => {
    if (isAuthenticated) {
      linkTokenToBackend(expoPushToken);
    }
  }, [isAuthenticated, expoPushToken, linkTokenToBackend]);

  /**
   * Provides notification context to child components.
   * @returns The NotificationContext.Provider with expoPushToken and notification values
   */
  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};
