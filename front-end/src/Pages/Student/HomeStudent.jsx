import React, { useState, useEffect } from 'react';
import './homeStudent.scss';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import NotificationOfStudent from '../../components/Notification/NotificationOfStudent';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function HomeStudent() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [isCancelClicked, setIsCancelClicked] = useState(false);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    document.title = "Trang chủ sinh viên";

    if (userToken) {
      axiosInstance.get('/student/notification', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      })
        .then(response => {
          const readNotifications = new Set(JSON.parse(localStorage.getItem('readNotificationsStudent')) || []);
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

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const checkAuthorization = async () => {
      const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
      if (userToken) {
        try {
          // Gửi token đến backend để kiểm tra quyền truy cập
          const response = await axiosInstance.post('/check-authorization/student', { token: userToken });
          if (response.data.authorized) {
            // Nếu có quyền truy cập, setAuthorized(true)
            setAuthorized(true);
          } else {
            // Nếu không có quyền truy cập, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
            setAuthorized(false);
          }
        } catch (error) {
          console.error("Error checking authorization:", error);
        }
      } else {
        // Nếu không có token, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  if (!authorized) {
    return <Navigate to="/unauthorized" />;
  }

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
          <NotificationOfStudent notifications={notifications} onReadNotification={handleReadNotification} />
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
