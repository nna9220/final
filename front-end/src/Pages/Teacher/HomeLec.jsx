import React, { useState, useEffect } from 'react';
import SidebarLec from '../../components/Sidebar/SidebarLec';
import Navbar from '../../components/Navbar/Navbar';
import './HomeLec.scss';
import NotificationOfLecturer from '../../components/Notification/NotificationOfLecturer';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';
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

  const [authorized, setAuthorized] = useState(true);
  useEffect(() => {
    const checkAuthorization = async () => {
      const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
      if (userToken) {
        try {
          const response = await axiosInstance.post('/check-authorization/lecturer', null, {
            headers: {
              'Authorization': `Bearer ${userToken}`,
            },
          });
          console.log("Nhận : ", response.data);
          if (response.data == "Authorized") {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (error) {
          if (error.response) {
              console.error("Response error:", error.response.data);
              console.error("Response status:", error.response.status);
              console.error("Response headers:", error.response.headers);
              setAuthorized(false);
          } else if (error.request) {
              console.error("Request error:", error.request);
              setAuthorized(false);
          } else {
              console.error("Axios error:", error.message);
              setAuthorized(false);
          }
      }
      } else {
        // Nếu không có token, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  if (!authorized) {
    return <Navigate to="/" />;
  }
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
