import React, { useState, useEffect } from 'react';
import './homeStudent.scss';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import NotificationOfStudent from '../../components/Notification/NotificationOfStudent';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function HomeStudent() {
  const [notifications, setNotifications] = useState([]);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    document.title = "Trang chủ sinh viên";

    if (userToken) {
      axiosInstance.get('/student/notification', {
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
    <div className='HomeStudent'>
      <SidebarStudent />
      <div className='context'>
        <Navbar unreadCount={unreadCount} />
        <hr />
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>TRANG CỦA BẠN</h4>
          </div>
          <NotificationOfStudent notifications={notifications} />
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
