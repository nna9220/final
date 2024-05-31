import React, { useState, useEffect } from 'react';
import SidebarLec from '../../components/Sidebar/SidebarLec';
import Navbar from '../../components/Navbar/Navbar';
import './HomeLec.scss';
import NotificationOfLecturer from '../../components/Notification/NotificationOfLecturer';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function HomeLec() {
  const [notifications, setNotifications] = useState([]);
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
        setNotifications(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [userToken]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

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
          <NotificationOfLecturer notifications={notifications} />
        </div>
      </div>
    </div>
  );
}

export default HomeLec;
