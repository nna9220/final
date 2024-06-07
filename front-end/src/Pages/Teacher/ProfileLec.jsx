import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './ProfileLec.scss'
import EditProfileLec from '../../components/Profile/ProfileLec/EditProfileLec'
import { useEffect, useState } from 'react'
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function ProfileLec() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);
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
          } else {
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
    <div className='homeProfile'>
      <SidebarLec/>
      <div className='context'>
        <Navbar/>
        <hr></hr>
        <EditProfileLec/>
      </div>
    </div>
  )
}

export default ProfileLec