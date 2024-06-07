// context/NotificationContext.js
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    if (userToken) {
      axiosInstance.get('/head/notification', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      })
      .then(response => {
        const readNotifications = new Set(JSON.parse(localStorage.getItem('readNotificationsHead')) || []);
        const notificationsWithReadStatus = response.data.map(notification => ({
          ...notification,
          read: readNotifications.has(notification.notificationId),
        }));
        setNotifications(notificationsWithReadStatus);
        setUnreadCount(notificationsWithReadStatus.filter(notification => !notification.read).length);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [userToken]);

  const handleReadNotification = (id) => {
    setUnreadCount(prevCount => prevCount - 1);
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.notificationId === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, handleReadNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
