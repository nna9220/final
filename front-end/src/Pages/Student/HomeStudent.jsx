import React, { useState, useEffect } from 'react';
import './homeStudent.scss';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import NotificationOfStudent from '../../components/Notification/NotificationOfStudent';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function HomeStudent() {
  useEffect(() => {
    document.title = "Trang chủ sinh viên";
  }, []);

  const [authorized, setAuthorized] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    const checkAuthorization = async () => {
      const userToken = getTokenFromUrlAndSaveToStorage();
      if (userToken) {
        try {
          const response = await axiosInstance.post('/check-authorization/student', null, {
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
  }, []);

  if (!authorized) {
    return <Navigate to="/" />;
  }

  return (
    <div className='HomeStudent'>
      <SidebarStudent unreadCount={unreadCount}/>
      <div className='context'>
        <Navbar />
        <hr />
        <div className='widgets'>
          <div className='home-head'>
            <div className='title-head'>
              <h5>TRANG CỦA BẠN</h5>
            </div>
          </div>
          <NotificationOfStudent onUpdateUnreadCount={setUnreadCount} />
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
