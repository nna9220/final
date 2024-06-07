import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './ProfileHe.scss'
import EditProfileHe from '../../components/Profile/ProfileHead/EditProfileHe'
import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';

function ProfileHe() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);
  const { notifications, unreadCount } = useContext(NotificationContext);

  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
      if (userToken) {
        try {
          const response = await axiosInstance.post('/check-authorization/head', null, {
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
    <div className='homeProfile'>
      <SidebarHead />
      <div className='context'>
        <Navbar unreadCount={unreadCount} />
        <hr></hr>
        <EditProfileHe />
      </div>
    </div>
  )
}

export default ProfileHe