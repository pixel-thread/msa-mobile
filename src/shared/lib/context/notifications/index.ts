import * as Notifications from 'expo-notifications';
import { createContext } from 'react';

interface NotificationContextType {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
