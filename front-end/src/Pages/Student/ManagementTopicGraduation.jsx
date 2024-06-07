import React, { useEffect, useState } from 'react';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import './ManagementTopic.scss';
import KanbanBoardKL from '../../components/Kanban/Graduation/KanbanBoardKL';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';
function ManagementTopicGraduation() {
    useEffect(() => {
        document.title = "Quản lý đề tài - Khóa luận tốt nghiệp";
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
        <div className='HomeStudent'>
          <SidebarStudent />
          <div className='context'>
            <Navbar />
            <hr />
            <div className='widgets'>
              <div className='header-notification'>
                <h4 className='title'>QUẢN LÝ ĐỀ TÀI - KHÓA LUẬN TỐT NGHIỆP</h4>
              </div>
              <KanbanBoardKL />
            </div>
          </div>
        </div>
      );
}

export default ManagementTopicGraduation