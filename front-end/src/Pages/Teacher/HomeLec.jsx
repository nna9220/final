import React, { useState, useEffect } from 'react';
import SidebarLec from '../../components/Sidebar/SidebarLec';
import Navbar from '../../components/Navbar/Navbar';
import './HomeLec.scss';
import NotificationOfLecturer from '../../components/Notification/NotificationOfLecturer';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function HomeLec() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    document.title = "Trang chủ giảng viên";

    if (userToken) {
      axiosInstance.get('/lecturer/notification', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      })
      .then(response => {
        const readNotifications = new Set(JSON.parse(localStorage.getItem('readNotificationsLecturer')) || []);
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
    <div className='homeLec'>
      <SidebarLec />
      <div className='context'>
        <Navbar unreadCount={unreadCount} />
        <hr />
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>TRANG CỦA BẠN</h4>
          </div>
          <NotificationOfLecturer notifications={notifications} onReadNotification={handleReadNotification} />
        </div>
      </div>
    </div>
  );
}

export default HomeLec;
