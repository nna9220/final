import React, { useState, useEffect } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './ProfileHe.scss';
import EditProfileHe from '../../components/Profile/ProfileHead/EditProfileHe';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';

function ProfileHe() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);

  const [authorized, setAuthorized] = useState(true);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userToken) {
        try {
          const response = await axiosInstance.get('/head/notification', {
            headers: {
              'Authorization': `Bearer ${userToken}`,
            },
          });
          const notifications = response.data;
          const readNotifications = new Set(JSON.parse(localStorage.getItem('readNotifications')) || []);
          const unreadCount = notifications.filter(notification => !readNotifications.has(notification.notificationId)).length;
          setUnreadCount(unreadCount);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchNotifications();
  }, [userToken]);
  
  useEffect(() => {
    const checkAuthorization = async () => {
      if (userToken) {
        try {
          const response = await axiosInstance.post('/check-authorization/head', null, {
            headers: {
              'Authorization': `Bearer ${userToken}`,
            },
          });
          if (response.data === "Authorized") {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (error) {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [userToken]);


  if (!authorized) {
    return <Navigate to="/" />;
  }

  return (
    <div className='homeProfile'>
      <SidebarHead unreadCount={unreadCount} />
      <div className='context'>
        <Navbar />
        <hr />
        <EditProfileHe />
      </div>
    </div>
  );
}

export default ProfileHe;
