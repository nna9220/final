import React, { useState, useEffect } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './HomeHead.scss';
import NotificationOfHeader from '../../components/Notification/NotificationOfHeader';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function HomeHead() {
  const [notifications, setNotifications] = useState([]);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    document.title = "Trang chủ Trưởng bộ môn";

    if (userToken) {
      axiosInstance.get('/head/notification', {
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
    <div className='homeHead'>
      <SidebarHead />
      <div className='context'>
        <Navbar unreadCount={unreadCount} />
        <hr />
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>TRANG CỦA BẠN</h4>
          </div>
          <NotificationOfHeader notifications={notifications} />
        </div>
      </div>
    </div>
  );
}

export default HomeHead;
