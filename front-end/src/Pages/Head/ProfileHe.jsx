import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './ProfileHe.scss'
import EditProfileHe from '../../components/Profile/ProfileHead/EditProfileHe'
import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';

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
                    // Gửi token đến backend để kiểm tra quyền truy cập
                    const response = await axiosInstance.post('/admin/check-authorization/head', { token: userToken });
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
        return <Navigate to="/" />;
    }
  return (
    <div className='homeProfile'>
      <SidebarHead/>
      <div className='context'>
      <Navbar unreadCount={unreadCount} />
        <hr></hr>
        <EditProfileHe/>
      </div>
    </div>
  )
}

export default ProfileHe