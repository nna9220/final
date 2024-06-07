import React from 'react'
import SidebarStudent from '../../components/Sidebar/SidebarStudent'
import Navbar from '../../components/Navbar/Navbar'
import EditProfileSt from '../../components/Profile/ProfileStudent/EditProfileSt'
import './ProfileST.scss'
import { useEffect, useState } from 'react'
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function ProfileST() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);
  const [authorized, setAuthorized] = useState(true);
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
    <div className='profileST'>
        <SidebarStudent></SidebarStudent>
        <div className='context'>
            <Navbar/>
            <hr/>
            <EditProfileSt/>
        </div>
    </div>
  )
}

export default ProfileST