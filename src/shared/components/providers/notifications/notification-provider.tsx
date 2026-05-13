import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Route, useRouter } from 'expo-router';

import { useAuthStore } from '@src/shared/store';
import http from '@src/shared/utils/http';
import { logger } from '@src/shared/utils/logger';
import { registerForPushNotificationsAsync } from '@src/shared/services/notification/register-push-notification';
import { NotificationContext } from '@src/shared/lib/context/notifications';
import { isExpoGo } from '@src/shared/utils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  // SEPARATE refs to avoid overwriting
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  /**
   * Helper to update notification status on the backend
   */
  const updateStatus = useCallback(
    async (id: string, payload: { isRead?: boolean; isReceived?: boolean }) => {
      try {
        await http.patch(`/notifications/${id}/status`, {
          ...payload,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Failed to sync notification status:', { id, error });
      }
    },
    []
  );

  /**
   * Handles foreground receipt
   */
  const onNotificationReceived = useCallback(
    async (noti: Notifications.Notification) => {
      setNotification(noti);
      const notificationId = noti.request.content.data?.id;
      if (notificationId) {
        await updateStatus(notificationId, { isReceived: true });
        logger.debug('Notification marked as Received (Foreground)');
      }
    },
    [updateStatus]
  );

  /**
   * Handles user tapping the notification
   */
  const onNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;
      if (data?.route) router.push(data.route as Route);

      if (data?.id) {
        await updateStatus(data.id as string, { isRead: true });
        logger.debug('Notification marked as Read');
      }
    },
    [router, updateStatus]
  );

  /**
   * Sync background notifications when app becomes active
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isAuthenticated) {
        // Tell backend to mark all pending notifications as received
        http.post('/notifications/sync-received').catch(() => {});
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isExpoGo() || !isAuthenticated || !user || Platform.OS === 'web') return;

    const init = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await http.post('/notifications/register', { token });
      }
    };
    init();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(onNotificationReceived);
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuthenticated, user, onNotificationReceived, onNotificationResponse]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};
