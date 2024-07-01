import React, { useState, useEffect } from 'react';
import './notification.scss';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function NotificationOfHeader() {
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
            console.log("Ntification: ", response.data);
          setNotifications(response.data)
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userToken]);

    return (
        <div className='notification-list'>
            
        </div>
    );
}

export default NotificationOfHeader;
