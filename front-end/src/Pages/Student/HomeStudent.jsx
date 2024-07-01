import React, { useState, useEffect } from 'react';
import './homeStudent.scss';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import NotificationOfStudent from '../../components/Notification/NotificationOfStudent';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function HomeStudent() {
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [authorized, setAuthorized] = useState(true);
  useEffect(() => {
    document.title = "Trang chủ sinh viên";
  }, []);
  useEffect(() => {
    const checkAuthorization = async () => {
        const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
        if (userToken) {
            try {
                const response = await axiosInstance.post('/check-authorization/student',null, {
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
    <div className='HomeStudent'>
      <SidebarStudent />
      <div className='context'>
        <Navbar/>
        <hr />
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>TRANG CỦA BẠN</h4>
          </div>
          <NotificationOfStudent />
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
