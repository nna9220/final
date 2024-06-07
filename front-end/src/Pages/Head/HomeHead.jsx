import React, { useState, useEffect } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './HomeHead.scss';
import NotificationOfHeader from '../../components/Notification/NotificationOfHeader';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate} from 'react-router-dom';

function HomeHead() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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

  const [authorized, setAuthorized] = useState(true);

    // Kiểm tra quyền truy cập
    useEffect(() => {
      const checkAuthorization = async () => {
          const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
          if (userToken) {
              try {
                  // Gửi token đến backend để kiểm tra quyền truy cập
                  const response = await axiosInstance.post('/admin/check-authorization/admin',null, {
                      headers: {
                          'Authorization': `Bearer ${userToken}`,
                      },
              });
                  console.log("trước if : ", response.data);
                  if (response.data == "Authorized") {
                      // Nếu có quyền truy cập, setAuthorized(true)
                      setAuthorized(true);
                  } else {
                      // Nếu không có quyền truy cập, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
                      setAuthorized(false);
                  }
              } catch (error) {
                  if (error.response) {
                      // Request made and server responded
                      console.error("Response error:", error.response.data);
                      console.error("Response status:", error.response.status);
                      console.error("Response headers:", error.response.headers);
                      setAuthorized(false);
                  } else if (error.request) {
                      // Request made but no response received
                      console.error("Request error:", error.request);
                  } else {
                      // Something else happened while setting up the request
                      console.error("Axios error:", error.message);
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
    <div className='homeHead'>
      <SidebarHead />
      <div className='context'>
        <Navbar unreadCount={unreadCount} />
        <hr />
        <div className='widgets'>
          <div className='home-head'>
            <div className='title-head'>
              <h5>TRANG CỦA BẠN</h5>
            </div>
          </div>
          <NotificationOfHeader notifications={notifications} onReadNotification={handleReadNotification} />
        </div>
      </div>
    </div>
  );
}

export default HomeHead;
