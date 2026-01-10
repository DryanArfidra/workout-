import React, { useEffect, useState } from 'react';
import Notification from '../components/common/Nontification';
import {
  notificationManager,
  type Notification as NotificationItem,
} from '../utils/notificationManager';

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationManager.getNotifications()
  );

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(
      (newNotifications: NotificationItem[]) => {
        setNotifications(newNotifications);
      }
    );

    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    notificationManager.remove(id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-96 max-w-full">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
