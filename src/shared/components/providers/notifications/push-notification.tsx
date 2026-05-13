import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import http from '@src/shared/utils/http';
import { logger } from '@src/shared/utils/logger';
import { registerForPushNotificationsAsync } from '@src/shared/services/notification/register-push-notification';
import { PushNotificationContext } from '@src/shared/lib/context/notifications';
import { isExpoGo } from '@src/shared/utils';
import { useAuthStore } from '@src/features/auth';

export const PushNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [isRegistered, setIsRegistered] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isExpoGo() || Platform.OS === 'web') return;

    const init = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          await http.post('/notifications/register', { token });
          setIsRegistered(true);
          logger.debug('Push notification token registered');
        }
      } catch (error) {
        logger.error('Failed to register push notification token:', { error });
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (isExpoGo() || Platform.OS === 'web') return;

    const init = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token && isAuthenticated && user?.id) {
          setExpoPushToken(token);
          await http.post('/notifications/link', { token, userId: user?.id });
          setIsRegistered(true);
          logger.debug('Push notification token registered');
        }
      } catch (error) {
        logger.error('Failed to register push notification token:', { error });
      }
    };

    init();
  }, [isAuthenticated, user]);

  return (
    <PushNotificationContext.Provider value={{ expoPushToken, isRegistered }}>
      {children}
    </PushNotificationContext.Provider>
  );
};

