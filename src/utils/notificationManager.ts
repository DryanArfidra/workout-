import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

class NotificationManager {
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private notifications: Notification[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(notification: Omit<Notification, 'id'>) {
    const id = uuidv4();
    const newNotification = { id, ...notification };
    
    this.notifications.push(newNotification);
    this.notify();

    // Auto remove if duration is set
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }

    return id;
  }

  success(title: string, message: string, duration?: number) {
    return this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration?: number) {
    return this.show({ type: 'error', title, message, duration });
  }

  info(title: string, message: string, duration?: number) {
    return this.show({ type: 'info', title, message, duration });
  }

  warning(title: string, message: string, duration?: number) {
    return this.show({ type: 'warning', title, message, duration });
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  getNotifications() {
    return [...this.notifications];
  }
}

export const notificationManager = new NotificationManager();

// React hook untuk menggunakan notification manager
export const useNotifications = () => {
  const showSuccess = (title: string, message: string, duration?: number) => {
    return notificationManager.success(title, message, duration);
  };

  const showError = (title: string, message: string, duration?: number) => {
    return notificationManager.error(title, message, duration);
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    return notificationManager.info(title, message, duration);
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    return notificationManager.warning(title, message, duration);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    remove: notificationManager.remove,
    clear: notificationManager.clear,
  };
};