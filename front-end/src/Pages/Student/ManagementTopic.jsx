import React, { useEffect, useState } from 'react';
import KanbanBoard from '../../components/Kanban/Board';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import './ManagementTopic.scss';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function ManagementTopic() {
  useEffect(() => {
    document.title = "Quản lý đề tài - Tiểu luận tiêu ngành";
  }, []);

  const [authorized, setAuthorized] = useState(true);
  // Kiểm tra quyền truy cập
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
            <h4 className='title'>QUẢN LÝ ĐỀ TÀI - TIỂU LUẬN CHUYÊN NGÀNH</h4>
          </div>
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}

export default ManagementTopic;
