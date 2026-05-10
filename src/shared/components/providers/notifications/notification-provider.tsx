import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

import { useAuthStore, useNotificationStore } from '@src/shared/store';
import http from '@src/shared/utils/http';
import { logger } from '@src/shared/utils/logger';
import { registerForPushNotificationsAsync } from '@src/shared/services/notification/register-push-notification';

interface NotificationContextType {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { setLinked, isLinked, setRegistered, isRegistered } = useNotificationStore();

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

  useEffect(() => {
    // Only register for notifications if authenticated
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

  useEffect(() => {
    if (isAuthenticated) {
      linkTokenToBackend(expoPushToken);
    }
  }, [isAuthenticated, expoPushToken, linkTokenToBackend]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};
