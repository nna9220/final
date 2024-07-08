import React, { useState, useEffect } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './HomeHead.scss';
import NotificationOfHeader from '../../components/Notification/NotificationOfHeader';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function HomeHead() {
  const [authorized, setAuthorized] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const userToken = getTokenFromUrlAndSaveToStorage();

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
    <div className='homeHead'>
      <SidebarHead unreadCount={unreadCount} />
      <div className='context'>
        <Navbar/>
        <hr />
        <div className='widgets'>
          <div className='home-head'>
            <div className='title-head'>
              <h5>TRANG CỦA BẠN</h5>
            </div>
          </div>
          <NotificationOfHeader onUpdateUnreadCount={setUnreadCount} />
        </div>
      </div>
    </div>
  );
}

export default HomeHead;
